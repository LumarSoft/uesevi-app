"use client";

// Presentación de la sección Mejoras, sólo en el panel admin (la monta
// app/admin/(sidebar)/layout.tsx). Tres momentos:
//   1. Bienvenida: una ventana con la novedad y los últimos cambios reales.
//      "Saltear" o "Mostrame cómo"; cualquiera de los dos la da por vista.
//   2. Recorrido: oscurece la pantalla e ilumina, paso a paso, el ítem del
//      menú, cómo se lee un cambio y los filtros (PASOS en ./recorrido.ts).
//   3. Cierre: un despegue y a explorar.
// Se puede repetir desde el botón "Ver recorrido" de la página de Mejoras.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  MapPin,
  MessageSquareText,
  Plus,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { userStore } from "@/shared/stores/userStore";
import { MEJORAS, TipoMejora, fechaCorta, mesYAnio } from "../mejoras";
import { useRecorridoMejoras } from "./estado";
import {
  PASOS,
  anuncioVisto,
  marcarAnuncioVisto,
  posicionTarjeta,
  type PasoRecorrido,
  type Rect,
} from "./recorrido";

const ICONO_TIPO: Record<TipoMejora, LucideIcon> = {
  Nuevo: Plus,
  Mejora: TrendingUp,
  Corrección: Wrench,
  Seguridad: ShieldCheck,
};

const almacen = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export default function RecorridoMejoras() {
  const { etapa, paso, abrirBienvenida, empezar, siguiente, anterior, cerrar } =
    useRecorridoMejoras();
  const router = useRouter();
  const pathname = usePathname();

  // Primera vez en este navegador: la bienvenida aparece sola, con una pausa
  // para que primero se dibuje el panel.
  useEffect(() => {
    if (anuncioVisto(almacen())) return;
    const { token, user } = userStore.getState();
    if (!token || user?.rol !== "admin") return;
    const espera = setTimeout(abrirBienvenida, 800);
    return () => clearTimeout(espera);
  }, [abrirBienvenida]);

  // Si el paso está en otra página, ir hasta ahí.
  const pasoActual = etapa === "pasos" ? PASOS[paso] : null;
  useEffect(() => {
    if (pasoActual?.ruta && pathname !== pasoActual.ruta) router.push(pasoActual.ruta);
  }, [pasoActual, pathname, router]);

  const saltear = () => {
    marcarAnuncioVisto(almacen());
    cerrar();
  };
  const mostrarComo = () => {
    marcarAnuncioVisto(almacen());
    empezar();
  };

  return (
    <>
      <Bienvenida
        abierta={etapa === "bienvenida"}
        onEmpezar={mostrarComo}
        onSaltear={saltear}
      />
      {pasoActual && (
        <Foco
          key={pasoActual.id}
          paso={pasoActual}
          indice={paso}
          total={PASOS.length}
          onSiguiente={() => siguiente(PASOS.length)}
          onAnterior={anterior}
          onCerrar={cerrar}
        />
      )}
      <Final abierta={etapa === "final"} onCerrar={cerrar} />
    </>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Bienvenida                                                              */
/* ------------------------------------------------------------------------ */

const PUNTOS = [
  { icono: CalendarClock, texto: "Qué cambió y cuándo" },
  { icono: MessageSquareText, texto: "Explicado en palabras simples" },
  { icono: MapPin, texto: "Dónde encontrarlo, paso a paso" },
];

function Bienvenida({
  abierta,
  onEmpezar,
  onSaltear,
}: {
  abierta: boolean;
  onEmpezar: () => void;
  onSaltear: () => void;
}) {
  const reducir = useReducedMotion();
  const ultimas = MEJORAS.slice(0, 3);
  const desde = MEJORAS[MEJORAS.length - 1]?.fecha;

  return (
    <DialogPrimitive.Root
      open={abierta}
      onOpenChange={(abrir) => {
        if (!abrir) onSaltear(); // Esc
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          // Un clic afuera por accidente no la descarta para siempre.
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl outline-none"
        >
          {/* El scroll (pantallas bajas) va acá y no en Content: si no, el
              desplazamiento de la animación de entrada lo hacía aparecer. */}
          <motion.div
            initial={reducir ? false : { opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden rounded-2xl border bg-background shadow-2xl"
          >
            {/* Ilustración: los últimos cambios de verdad, sobre los colores
                de UESEVI. */}
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#1f294c] via-[#2a3972] to-[#3e5298] sm:h-56">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:18px_18px]"
              />
              <div
                aria-hidden
                className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-sky-400/25 blur-3xl"
              />
              <motion.div
                aria-hidden
                className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 sm:right-7 sm:top-7"
                animate={reducir ? undefined : { y: [0, -6, 0], rotate: [0, -4, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket className="h-7 w-7 text-white" />
              </motion.div>
              <ol aria-hidden className="absolute left-5 right-24 top-6 space-y-2.5 sm:left-7 sm:right-28">
                {ultimas.map((mejora, i) => {
                  const Icono = ICONO_TIPO[mejora.tipo];
                  return (
                    <motion.li
                      key={`${mejora.fecha}-${mejora.titulo}`}
                      initial={reducir ? false : { opacity: 0, x: -18 }}
                      animate={{ opacity: 1 - i * 0.18, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.12, duration: 0.45, ease: "easeOut" }}
                      className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15"
                    >
                      <span
                        className={
                          i === 0
                            ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[#1f294c]"
                            : "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/15 text-white"
                        }
                      >
                        <Icono className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {mejora.titulo}
                        </span>
                        <span className="block text-xs text-white/60">
                          {fechaCorta(mejora.fecha)} · {mejora.tipo}
                        </span>
                      </span>
                    </motion.li>
                  );
                })}
              </ol>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Novedad en el panel
                </p>
                <DialogPrimitive.Title className="text-2xl font-semibold tracking-tight">
                  Te presentamos Mejoras
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="leading-relaxed text-muted-foreground">
                  Una sección nueva para que veas todo lo que vamos mejorando en
                  el sistema. Lo trabajamos todos los días para que les resulte
                  más simple, y queremos que se note.
                </DialogPrimitive.Description>
              </div>

              <ul className="grid gap-2 sm:grid-cols-3 sm:gap-3">
                {PUNTOS.map(({ icono: Icono, texto }, i) => (
                  <motion.li
                    key={texto}
                    initial={reducir ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2.5 text-sm sm:flex-col sm:items-start sm:gap-2 sm:py-3"
                  >
                    <Icono className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {texto}
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {desde && (
                  <p className="text-center text-sm text-muted-foreground sm:text-left">
                    {MEJORAS.length} mejoras desde {mesYAnio(desde)}.
                  </p>
                )}
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <Button variant="ghost" onClick={onSaltear}>
                    Saltear
                  </Button>
                  <Button onClick={onEmpezar} className="gap-2" autoFocus>
                    Mostrame cómo
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ------------------------------------------------------------------------ */
/* 2. Recorrido: foco sobre un elemento + tarjeta con la explicación          */
/* ------------------------------------------------------------------------ */

const RELLENO = 8; // aire alrededor del elemento iluminado
const ESPERA_MAXIMA_MS = 4000; // si no aparece, la tarjeta va al centro

const mismoRect = (a: Rect | null, b: Rect | null) =>
  !!a &&
  !!b &&
  Math.abs(a.top - b.top) < 0.5 &&
  Math.abs(a.left - b.left) < 0.5 &&
  Math.abs(a.right - b.right) < 0.5 &&
  Math.abs(a.bottom - b.bottom) < 0.5;

function Foco({
  paso,
  indice,
  total,
  onSiguiente,
  onAnterior,
  onCerrar,
}: {
  paso: PasoRecorrido;
  indice: number;
  total: number;
  onSiguiente: () => void;
  onAnterior: () => void;
  onCerrar: () => void;
}) {
  const reducir = useReducedMotion();
  const [montado, setMontado] = useState(false);
  const [esMovil, setEsMovil] = useState(false);
  const [rect, setRect] = useState<Rect | null>(null);
  const [buscando, setBuscando] = useState(true);
  const [pantalla, setPantalla] = useState({ ancho: 1024, alto: 768 });
  const [altoTarjeta, setAltoTarjeta] = useState(220);
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const botonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMontado(true);
    setEsMovil(window.innerWidth < 768);
  }, []);

  const selector = (esMovil && paso.selectorMovil) || paso.selector;
  const texto = (esMovil && paso.textoMovil) || paso.texto;

  // Sigue al elemento en cada cuadro: así acompaña el scroll, el cambio de
  // tamaño de la ventana y la navegación a otra página.
  useEffect(() => {
    let cuadro = 0;
    let llevado = false;
    const inicio = performance.now();
    const seguir = () => {
      const el = document.querySelector<HTMLElement>(selector);
      const caja = el?.getBoundingClientRect();
      const visible = !!el && !!caja && caja.width > 0 && caja.height > 0;
      if (visible && el && caja) {
        if (!llevado) {
          el.scrollIntoView({ block: "center", behavior: reducir ? "auto" : "smooth" });
          llevado = true;
        }
        const nuevo = { top: caja.top, left: caja.left, right: caja.right, bottom: caja.bottom };
        setRect((previo) => (mismoRect(previo, nuevo) ? previo : nuevo));
        setBuscando(false);
      } else if (performance.now() - inicio > ESPERA_MAXIMA_MS) {
        setRect(null);
        setBuscando(false);
      }
      setPantalla((p) =>
        p.ancho === window.innerWidth && p.alto === window.innerHeight
          ? p
          : { ancho: window.innerWidth, alto: window.innerHeight }
      );
      cuadro = requestAnimationFrame(seguir);
    };
    cuadro = requestAnimationFrame(seguir);
    return () => cancelAnimationFrame(cuadro);
  }, [selector, reducir]);

  useLayoutEffect(() => {
    if (tarjetaRef.current) setAltoTarjeta(tarjetaRef.current.offsetHeight);
  }, [texto, montado, buscando]);

  useEffect(() => {
    if (!buscando) botonRef.current?.focus();
  }, [buscando]);

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCerrar]);

  if (!montado) return null;

  const ancho = Math.min(352, pantalla.ancho - 32);
  const foco = rect && {
    top: rect.top - RELLENO,
    left: rect.left - RELLENO,
    right: rect.right + RELLENO,
    bottom: rect.bottom + RELLENO,
  };
  const posicion = posicionTarjeta(foco, { ancho, alto: altoTarjeta }, pantalla);
  const titulo = `recorrido-${paso.id}`;

  return createPortal(
    <div className="fixed inset-0 z-[100]" role="presentation">
      {foco ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute rounded-xl ring-2 ring-primary"
          style={{
            boxShadow:
              "0 0 0 6px hsl(var(--primary) / 0.25), 0 0 0 9999px rgba(2, 8, 23, 0.68)",
          }}
          initial={false}
          animate={{
            top: foco.top,
            left: foco.left,
            width: foco.right - foco.left,
            height: foco.bottom - foco.top,
          }}
          transition={reducir ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 32 }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-[rgba(2,8,23,0.68)]" />
      )}

      {!buscando && (
        <motion.div
          ref={tarjetaRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titulo}
          className="absolute rounded-2xl border bg-background p-5 shadow-2xl"
          style={{ top: posicion.top, left: posicion.left, width: ancho }}
          initial={reducir ? false : { opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">
              Paso {indice + 1} de {total}
            </span>
            <button
              type="button"
              onClick={onCerrar}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Saltear recorrido
            </button>
          </div>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${((indice + 1) / total) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <h2 id={titulo} className="text-lg font-semibold leading-snug">
            {paso.titulo}
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{texto}</p>
          <div className="mt-5 flex items-center justify-end gap-2">
            {indice > 0 && (
              <Button variant="ghost" size="sm" onClick={onAnterior}>
                Anterior
              </Button>
            )}
            <Button ref={botonRef} size="sm" onClick={onSiguiente} className="gap-1.5">
              {paso.boton ?? "Siguiente"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </motion.div>
      )}
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------------ */
/* 3. Cierre                                                                  */
/* ------------------------------------------------------------------------ */

const CHISPAS = Array.from({ length: 12 }, (_, i) => {
  const angulo = (i / 12) * Math.PI * 2;
  return {
    x: Math.cos(angulo) * 70,
    y: Math.sin(angulo) * 70,
    color: ["bg-primary", "bg-emerald-400", "bg-amber-400", "bg-violet-400"][i % 4],
  };
});

function Final({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const reducir = useReducedMotion();
  return (
    <DialogPrimitive.Root
      open={abierta}
      onOpenChange={(abrir) => {
        if (!abrir) onCerrar();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 outline-none">
          <motion.div
            initial={reducir ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="rounded-2xl border bg-background p-8 text-center shadow-2xl"
          >
            <div className="relative mx-auto mb-6 h-24 w-24">
              {!reducir &&
                CHISPAS.map((chispa, i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className={`absolute left-1/2 top-1/2 h-2 w-2 rounded-full ${chispa.color}`}
                    initial={{ x: -4, y: -4, opacity: 0, scale: 0.4 }}
                    animate={{
                      x: chispa.x - 4,
                      y: chispa.y - 4,
                      opacity: [0, 1, 0],
                      scale: [0.4, 1, 0.6],
                    }}
                    transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
                  />
                ))}
              <motion.div
                className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1f294c] to-[#3e5298] shadow-lg shadow-[#3e5298]/30"
                initial={reducir ? false : { y: 16, scale: 0.85 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14 }}
              >
                <motion.span
                  animate={reducir ? undefined : { y: [0, -5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Rocket className="h-10 w-10 text-white" aria-hidden />
                </motion.span>
              </motion.div>
            </div>
            <DialogPrimitive.Title className="text-2xl font-semibold tracking-tight">
              ¡Listo! Ya sabés usar Mejoras
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 leading-relaxed text-muted-foreground">
              Cada vez que mejoremos algo lo vas a encontrar acá, con lo último
              primero. Gracias por usar el sistema todos los días: lo seguimos
              mejorando pensando en ustedes.
            </DialogPrimitive.Description>
            <Button onClick={onCerrar} className="mt-6 w-full sm:w-auto" autoFocus>
              Empezar a explorar
            </Button>
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
