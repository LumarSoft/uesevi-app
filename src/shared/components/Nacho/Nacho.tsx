"use client";

import { useEffect, useRef } from "react";
import { crearNacho, type EstadoNacho, type InstanciaNacho } from "./motor";

interface NachoProps {
  /** Estado actual. Cambiarlo no re-renderiza nada: se lo pasa al motor. */
  estado?: EstadoNacho;
  /** Lado del cuadrado, en px. */
  tamano?: number;
  className?: string;
  /**
   * Engancha el saludo y el seguimiento del puntero al elemento clickeable
   * que lo contiene (el <a> del sidebar, por ejemplo). Los listeners van sobre
   * el DOM, no sobre React: pasar el mouse no cuesta un render.
   */
  saludaEnHover?: boolean;
  /**
   * Sigue el puntero por toda la ventana. Se usa en el estado vacío del chat,
   * donde Nacho es lo único en pantalla y tiene que sentirse atento.
   */
  sigueCursor?: boolean;
}

/**
 * Nacho, el asistente del panel. Silueta llena de contorno irregular y dos
 * ojos grandes: la personalidad sale del movimiento, no del detalle.
 *
 * El SVG va `aria-hidden` — lo que Nacho está haciendo se anuncia por texto
 * desde la línea de pasos y desde el live region del módulo, nunca desde acá.
 */
const Nacho = ({
  estado = "reposo",
  tamano = 32,
  className,
  saludaEnHover = false,
  sigueCursor = false,
}: NachoProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const instanciaRef = useRef<InstanciaNacho | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const instancia = crearNacho(svg, estado);
    instanciaRef.current = instancia;
    return () => {
      instancia.destruir();
      instanciaRef.current = null;
    };
    // El estado inicial se aplica al crear; los cambios los toma el efecto de
    // abajo. Recrear la instancia en cada cambio de estado perdería la fase de
    // respiración y el parpadeo en curso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    instanciaRef.current?.setEstado(estado);
  }, [estado]);

  useEffect(() => {
    if (!saludaEnHover) return;
    const svg = svgRef.current;
    const blanco = svg?.closest("a, button") ?? svg?.parentElement;
    if (!blanco) return;

    const entrar = () => instanciaRef.current?.saludar();
    const mover = (evento: Event) => {
      const { clientX, clientY } = evento as MouseEvent;
      const caja = blanco.getBoundingClientRect();
      // La mirada se mapea sobre el ancho del elemento clickeable, no sobre el
      // del dibujo: en el sidebar plegado el <a> es mucho más ancho que Nacho.
      instanciaRef.current?.apuntar(
        ((clientX - caja.left) / caja.width) * 2 - 1,
        ((clientY - caja.top) / caja.height) * 2 - 1
      );
    };
    const salir = () => instanciaRef.current?.soltar();

    blanco.addEventListener("mouseenter", entrar);
    blanco.addEventListener("mousemove", mover);
    blanco.addEventListener("mouseleave", salir);
    return () => {
      blanco.removeEventListener("mouseenter", entrar);
      blanco.removeEventListener("mousemove", mover);
      blanco.removeEventListener("mouseleave", salir);
    };
  }, [saludaEnHover]);

  useEffect(() => {
    if (!sigueCursor) return;
    const svg = svgRef.current;
    if (!svg) return;

    // La caja se cachea: `getBoundingClientRect` en cada pointermove fuerza
    // layout, y estos eventos llegan de a decenas por segundo.
    let caja: DOMRect | null = null;
    const medir = () => {
      caja = svg.getBoundingClientRect();
    };
    const invalidar = () => {
      caja = null;
    };
    const mover = (evento: PointerEvent) => {
      if (!caja) medir();
      if (!caja) return;
      const cx = caja.left + caja.width / 2;
      const cy = caja.top + caja.height / 2;
      // Satura alrededor de media pantalla: más lejos que eso la mirada ya
      // está al tope y seguir estirándola no se nota.
      instanciaRef.current?.apuntar(
        (evento.clientX - cx) / 360,
        (evento.clientY - cy) / 260
      );
    };

    medir();
    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("resize", invalidar);
    window.addEventListener("scroll", invalidar, true);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("resize", invalidar);
      window.removeEventListener("scroll", invalidar, true);
      instanciaRef.current?.soltar();
    };
  }, [sigueCursor]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 120"
      width={tamano}
      height={tamano}
      className={`nacho shrink-0 select-none ${className ?? ""}`}
      aria-hidden
      focusable="false"
    >
      {/* Halo de actividad: sólo se ve mientras consulta o piensa. */}
      <circle className="nacho-halo" pathLength="100" cx="60" cy="62" r="54" />
      <g className="nacho-cuerpo">
        <g className="nacho-masa">
          {/* La Chapa: un rectángulo blando de esquinas desparejas y lados que
              no llegan a ser rectos. Credencial, no escudo policial. */}
          <path d="M35 22.5C58 20 84 21.5 96 26.5 103 32 102.5 84 97 93 88.5 100 32 102.5 24.5 96 18 88 18.5 33 24 27 27 24 30 23 35 22.5Z" />
        </g>
        <g className="nacho-ojos">
          <g className="nacho-ojo nacho-ojo-izq">
            <rect className="nacho-pupila" x="41.5" y="48" width="13" height="32" rx="6.5" />
            <path className="nacho-arco" d="M40 69Q48 55 56 69" />
          </g>
          <g className="nacho-ojo nacho-ojo-der">
            <rect className="nacho-pupila" x="65.5" y="48" width="13" height="32" rx="6.5" />
            <path className="nacho-arco" d="M64 69Q72 55 80 69" />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default Nacho;
