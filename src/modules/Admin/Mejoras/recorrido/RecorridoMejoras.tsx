"use client";

// Presentación de la sección Mejoras, sólo en el panel admin (la monta
// app/admin/(sidebar)/layout.tsx). Tres momentos:
//   1. Bienvenida: una tarjeta corta que cuenta la novedad y que trabajamos
//      todos los días para acompañarlos. "Mostrame cómo" o "Entendido"
//      (o la cruz); cualquiera la da por vista.
//   2. Recorrido: oscurece la pantalla e ilumina, paso a paso, el ítem del
//      menú, cómo se lee un cambio y los filtros (PASOS en ./recorrido.ts).
//   3. Cierre: un despegue y a explorar.
// Se puede repetir desde el botón "Ver recorrido" de la página de Mejoras.

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, Rocket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userStore } from "@/shared/stores/userStore";
import { useRecorridoMejoras } from "./estado";
import {
  PASOS,
  anuncioVisto,
  marcarAnuncioVisto,
  posicionTarjeta,
  type PasoRecorrido,
  type Rect,
} from "./recorrido";

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
/* Tarjeta de anuncio: la base de la bienvenida y del cierre                  */
/* ------------------------------------------------------------------------ */

// Fondo: un resplandor azul suave arriba que se funde con el fondo de la
// tarjeta (más presente en modo oscuro, donde el azul tenue no se ve).
const FONDO_TARJETA =
  "[background:radial-gradient(120%_75%_at_50%_0%,hsl(var(--primary)/0.16),transparent_70%),hsl(var(--background))] dark:[background:radial-gradient(120%_75%_at_50%_0%,hsl(var(--primary)/0.24),transparent_70%),hsl(var(--background))]";

function TarjetaAnuncio({
  abierta,
  onCerrar,
  children,
}: {
  abierta: boolean;
  onCerrar: () => void;
  children: React.ReactNode;
}) {
  const reducir = useReducedMotion();
  return (
    <DialogPrimitive.Root
      open={abierta}
      onOpenChange={(abrir) => {
        if (!abrir) onCerrar(); // Esc o la cruz
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          // Un clic afuera por accidente no la descarta.
          onPointerDownOutside={(e) => e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 outline-none"
        >
          <motion.div
            initial={reducir ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={`relative max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border px-6 pb-6 pt-10 text-center shadow-2xl sm:px-10 sm:pb-8 ${FONDO_TARJETA}`}
          >
            <DialogPrimitive.Close
              aria-label="Cerrar"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-5 w-5" aria-hidden />
            </DialogPrimitive.Close>
            {children}
          </motion.div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** El cohete de Mejoras en un recuadro azul, flotando apenas. */
function IconoCohete({ grande = false }: { grande?: boolean }) {
  const reducir = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={`mx-auto flex items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ${
        grande ? "h-20 w-20 rounded-3xl" : "h-16 w-16"
      }`}
      initial={reducir ? false : { scale: 0.6, rotate: -12, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
    >
      <motion.span
        animate={reducir ? undefined : { y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Rocket className={grande ? "h-9 w-9" : "h-8 w-8"} />
      </motion.span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------------ */
/* 1. Bienvenida                                                              */
/* ------------------------------------------------------------------------ */

function Bienvenida({
  abierta,
  onEmpezar,
  onSaltear,
}: {
  abierta: boolean;
  onEmpezar: () => void;
  onSaltear: () => void;
}) {
  return (
    <TarjetaAnuncio abierta={abierta} onCerrar={onSaltear}>
      <IconoCohete />
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        Novedad en el panel
      </p>
      <DialogPrimitive.Title className="mt-3 text-2xl font-semibold leading-tight tracking-tight [text-wrap:balance]">
        Seguimos mejorando, cerca de ustedes
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="mt-3 text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
        Queremos darles la mejor experiencia posible, y día a día trabajamos
        para lograrlo. Por eso sumamos <strong className="font-semibold text-foreground">Mejoras</strong> al
        menú: ahí les contamos cada cambio que hacemos en el sistema y, si se
        les ocurre algo, pueden proponérnoslo. Lo leemos y les respondemos.
      </DialogPrimitive.Description>
      <div className="mt-8 space-y-2">
        <Button
          onClick={onEmpezar}
          className="h-12 w-full gap-2 rounded-xl text-base"
          autoFocus
        >
          <Play className="h-4 w-4 fill-current" aria-hidden />
          Mostrame cómo
          <span className="font-normal opacity-75">· {PASOS.length} pasos</span>
        </Button>
        <Button variant="ghost" onClick={onSaltear} className="h-11 w-full rounded-xl">
          Entendido
        </Button>
      </div>
    </TarjetaAnuncio>
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
    <TarjetaAnuncio abierta={abierta} onCerrar={onCerrar}>
      <div className="relative mx-auto h-20 w-20">
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
              transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
            />
          ))}
        <IconoCohete grande />
      </div>
      <DialogPrimitive.Title className="mt-7 text-2xl font-semibold leading-tight tracking-tight [text-wrap:balance]">
        ¡Listo! Ya saben dónde encontrarnos
      </DialogPrimitive.Title>
      <DialogPrimitive.Description className="mt-3 text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
        Cada vez que mejoremos algo, va a estar en Mejoras. Y cuando se les
        ocurra algo, propónganlo ahí: lo leemos y les respondemos. Gracias por
        acompañarnos todos los días.
      </DialogPrimitive.Description>
      <Button
        onClick={onCerrar}
        className="mt-8 h-12 w-full gap-2 rounded-xl text-base"
        autoFocus
      >
        Empezar a explorar
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </TarjetaAnuncio>
  );
}
