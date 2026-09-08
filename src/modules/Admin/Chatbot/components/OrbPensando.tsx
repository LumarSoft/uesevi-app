"use client";

import { useEffect, useRef, useState } from "react";
import { ORB_IDLE, ORB_THINKING, ORB_UNIFORMS_LARGO } from "./orbSeeds";

/**
 * Orbe "Liquid Glass" que reemplaza a los puntitos mientras el asistente
 * responde. Es un shader WGSL corriendo en WebGPU.
 *
 * Tres decisiones que conviene no deshacer:
 *
 * 1. El shader (~69 KB) vive en `public/orb-liquid.wgsl` y se baja recién
 *    cuando hace falta. Inline en el bundle engordaría todo el panel de admin
 *    por un indicador de carga.
 * 2. Sólo se crea el pipeline de pantalla completa. El shader trae además un
 *    pipeline de partículas para el estilo 24, que dibuja 221.184 instancias
 *    por cuadro; ninguno de los dos estados lo usa (los dos son estilo 20), y
 *    no vale la pena tener ese camino vivo para un spinner.
 * 3. Si WebGPU no está disponible, si el navegador pide menos movimiento o si
 *    algo falla en cualquier punto, se avisa por `onFallback` y el chat vuelve
 *    a los puntitos. Nunca queda un hueco vacío.
 *
 * Los tipos de WebGPU no están instalados (`@webgpu/types`), así que la API se
 * usa sin tipar. Está acotado a este archivo a propósito.
 */

// El shader se baja una sola vez por sesión, aunque el orbe se monte y
// desmonte en cada consulta.
let shaderPromesa: Promise<string> | null = null;
const traerShader = () => {
  if (!shaderPromesa) {
    shaderPromesa = fetch("/orb-liquid.wgsl").then((r) => {
      if (!r.ok) throw new Error("No se pudo cargar el shader del orbe");
      return r.text();
    });
    // Un fallo no puede dejar la promesa cacheada en rechazo para siempre.
    shaderPromesa.catch(() => {
      shaderPromesa = null;
    });
  }
  return shaderPromesa;
};

const DURACION_ACTIVACION_MS = 220;

// Índice de `speed` dentro del struct Uniforms.
const IDX_VELOCIDAD = 3;

/**
 * Multiplicador de velocidad sobre los valores del editor.
 *
 * El shader usa `u.time` únicamente como `u.time * u.speed`, y el componente
 * escribe `time = fase / speed`, así que `speed` es exactamente el ritmo al que
 * avanza la fase: subirlo acá acelera el fluido en esa misma proporción y nada
 * más. Con el 0.9 original el remolino tardaba decenas de segundos en dar una
 * vuelta y se leía como una imagen fija en una espera de pocos segundos.
 */
const VELOCIDAD_X = 20;

// Conversión sRGB ↔ lineal: interpolar colores en sRGB crudo apaga los tonos
// intermedios. Los 96 floats desde el índice 40 son colores (vec4 RGBA); la
// componente alfa de cada uno (índice múltiplo de 4 + 3) se interpola lineal.
const aLineal = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const aSrgb = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
const mezclarSrgb = (desde: number, hasta: number, t: number) =>
  aSrgb(aLineal(desde) + (aLineal(hasta) - aLineal(desde)) * t);

interface OrbPensandoProps {
  /** Se llama cuando el orbe no puede dibujarse y hay que usar el respaldo. */
  onFallback: () => void;
  /** Lado del orbe en px CSS. */
  tamano?: number;
}

const OrbPensando = ({ onFallback, tamano = 96 }: OrbPensandoProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef(onFallback);
  fallbackRef.current = onFallback;
  // Generación de arranque. React 18 en modo estricto monta el efecto dos
  // veces en desarrollo, así que dos inicializaciones asíncronas compiten por
  // el mismo <canvas> y el mismo GPUCanvasContext: la última en terminar
  // reconfigura el contexto con SU device y el loop de la otra queda dibujando
  // contra un device ajeno, pinta un cuadro y se congela. El contador vive en
  // un ref (compartido entre montajes, a diferencia de una variable local del
  // efecto) y cada paso asíncrono se planta si ya no es la generación vigente.
  const generacionRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gpu = (navigator as unknown as { gpu?: unknown }).gpu;
    const menosMovimiento =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!gpu || menosMovimiento) {
      fallbackRef.current();
      return;
    }

    let cancelado = false;
    let cuadro = 0;
    let device: any = null;

    generacionRef.current += 1;
    const generacion = generacionRef.current;
    const vigente = () => !cancelado && generacionRef.current === generacion;

    const abortar = (error?: unknown) => {
      if (cancelado) return;
      cancelado = true;
      cancelAnimationFrame(cuadro);
      try {
        device?.destroy();
      } catch (_) {
        /* el device ya puede estar perdido */
      }
      device = null;
      if (error) console.error("Orbe deshabilitado:", error);
      fallbackRef.current();
    };

    const arrancar = async () => {
      const codigo = await traerShader();
      if (!vigente()) return;

      const adapter = await (gpu as any).requestAdapter();
      if (!adapter) throw new Error("No hay un adaptador WebGPU compatible");
      const propio = await adapter.requestDevice();
      // Una generación vieja no configura el contexto ni deja un device suelto.
      if (!vigente()) {
        propio.destroy();
        return;
      }
      device = propio;

      const context = canvas.getContext("webgpu") as any;
      if (!context) throw new Error("No se pudo crear el contexto WebGPU");

      const format = (gpu as any).getPreferredCanvasFormat();
      // El shader devuelve color premultiplicado, así que el orbe se compone
      // sobre el fondo del chat sin recuadro.
      context.configure({ device, format, alphaMode: "premultiplied" });

      const shader = device.createShaderModule({ code: codigo });
      const compilacion = await shader.getCompilationInfo();
      const errores = compilacion.messages.filter((m: any) => m.type === "error");
      if (errores.length) {
        throw new Error(
          errores.map((m: any) => `${m.lineNum}:${m.linePos} ${m.message}`).join("\n")
        );
      }
      if (!vigente()) {
        device.destroy();
        device = null;
        return;
      }

      const mezcla = {
        srcFactor: "one",
        dstFactor: "one-minus-src-alpha",
        operation: "add",
      };
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vs_main" },
        fragment: {
          module: shader,
          entryPoint: "fs_main",
          targets: [{ format, blend: { color: mezcla, alpha: mezcla } }],
        },
        primitive: { topology: "triangle-list" },
      });

      const valores = new Float32Array(ORB_UNIFORMS_LARGO);
      const uniformBuffer = device.createBuffer({
        size: valores.byteLength,
        usage: 0x40 | 0x8, // GPUBufferUsage.UNIFORM | COPY_DST
      });
      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      device.lost?.then((info: any) => {
        abortar(new Error(`WebGPU perdió el device: ${info?.message ?? info?.reason}`));
      });

      // El buffer del canvas se dimensiona ANTES del primer cuadro: por
      // defecto un <canvas> es de 300x150 y ese primer cuadro saldría con la
      // relación de aspecto equivocada.
      const ladoInicial = Math.max(
        1,
        Math.floor(tamano * Math.min(window.devicePixelRatio || 1, 2))
      );
      canvas.width = ladoInicial;
      canvas.height = ladoInicial;

      // Arranca en calma y sube a "pensando": la rampa de 220 ms del autor
      // evita que el orbe aparezca de golpe.
      // Los arreglos de `orbSeeds` se dejan tal cual salieron del editor; el
      // ajuste de velocidad se aplica acá.
      const desde = new Float32Array(ORB_IDLE);
      const hasta = new Float32Array(ORB_THINKING);
      desde[IDX_VELOCIDAD] *= VELOCIDAD_X;
      hasta[IDX_VELOCIDAD] *= VELOCIDAD_X;
      const inicio = performance.now();
      let faseMovimiento = 0;
      let cuadroPrevio: number | null = null;

      const dibujar = (ahora: number) => {
        if (!vigente()) return;
        try {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const lado = Math.max(1, Math.floor(tamano * dpr));
          if (canvas.width !== lado || canvas.height !== lado) {
            canvas.width = lado;
            canvas.height = lado;
          }

          // easeOutCubic, la curva de activación del orbe original.
          const bruto = Math.min(1, (ahora - inicio) / DURACION_ACTIVACION_MS);
          const t = 1 - (1 - bruto) ** 3;
          for (let i = 3; i < ORB_UNIFORMS_LARGO; i += 1) {
            const esColor = i >= 40 && (i - 40) % 4 < 3;
            valores[i] = esColor
              ? mezclarSrgb(desde[i], hasta[i], t)
              : desde[i] + (hasta[i] - desde[i]) * t;
          }

          // El tiempo se integra sobre la velocidad interpolada: si se usara el
          // reloj crudo, cambiar `speed` daría un salto en la animación.
          const delta =
            cuadroPrevio === null
              ? 0
              : Math.min(0.1, Math.max(0, (ahora - cuadroPrevio) / 1000));
          cuadroPrevio = ahora;
          faseMovimiento += delta * Math.max(valores[3], 0);

          valores[0] = lado;
          valores[1] = lado;
          valores[2] = faseMovimiento / Math.max(valores[3], 0.001);
          device.queue.writeBuffer(uniformBuffer, 0, valores);

          const encoder = device.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: "clear",
                storeOp: "store",
              },
            ],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bindGroup);
          pass.draw(3);
          pass.end();
          device.queue.submit([encoder.finish()]);
          cuadro = requestAnimationFrame(dibujar);
        } catch (error) {
          abortar(error);
        }
      };

      cuadro = requestAnimationFrame(dibujar);
    };

    arrancar().catch(abortar);

    return () => {
      cancelado = true;
      cancelAnimationFrame(cuadro);
      try {
        device?.destroy();
      } catch (_) {
        /* nada que hacer si ya se perdió */
      }
    };
  }, [tamano]);

  return (
    <canvas
      ref={canvasRef}
      role="status"
      aria-label="Pensando la respuesta"
      style={{ width: tamano, height: tamano }}
      className="shrink-0"
    />
  );
};

export default OrbPensando;
