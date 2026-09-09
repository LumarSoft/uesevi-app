"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Building2,
  FileCheck2,
  FileClock,
  FileSpreadsheet,
  FileX2,
  Paperclip,
  RotateCcw,
  ShieldCheck,
  SquarePen,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { fetchData, postStream } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import {
  IChatbotAnalisisArchivo,
  IChatbotBurbuja,
  IChatbotCupo,
  IChatbotEvento,
  IChatbotItemApi,
  IChatbotPaso,
} from "@/shared/types/Querys/IChatbot";
import {
  anuncioDeBurbuja,
  estadoDeBurbuja,
  type EstadoNacho,
} from "@/shared/components/Nacho";
import AvatarNacho from "./components/AvatarNacho";
import Composer from "./components/Composer";
import CupoNacho from "./components/CupoNacho";
import Markdown from "./components/Markdown";
import PasosNacho from "./components/PasosNacho";
import PropuestaCard from "./components/PropuestaCard";

const ATAJOS: { icono: LucideIcon; texto: string; adjunta?: boolean }[] = [
  { icono: FileClock, texto: "Última declaración de una empresa" },
  { icono: Wallet, texto: "Cuánto debe hoy una empresa" },
  { icono: Users, texto: "En qué empresa está un empleado" },
  { icono: Building2, texto: "Datos de contacto de una empresa" },
  { icono: FileSpreadsheet, texto: "Revisar un Excel que la empresa no pudo subir", adjunta: true },
];

const MENSAJE_ARCHIVO = "Revisá este Excel de declaración jurada.";

const nuevoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

const saludo = () => {
  const hora = new Date().getHours();
  if (hora < 12) return "Buen día";
  if (hora < 20) return "Buenas tardes";
  return "Buenas noches";
};

const ChipArchivo = ({ analisis }: { analisis: IChatbotAnalisisArchivo }) => {
  const valido = analisis.legible && analisis.es_valido;
  const Icono = valido ? FileCheck2 : FileX2;
  return (
    <div
      className={`mb-2 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
        valido
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
          : "border-destructive/30 bg-destructive/5 text-destructive"
      }`}
    >
      <Icono className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate font-medium">{analisis.archivo}</span>
      <span className="opacity-80">
        {!analisis.legible
          ? "no se pudo leer"
          : valido
            ? `${analisis.filas_leidas} filas · pasa la validación`
            : `${analisis.filas_leidas} filas · ${analisis.cantidad_errores} ${
                analisis.cantidad_errores === 1 ? "error" : "errores"
              }`}
      </span>
    </div>
  );
};

const ChatbotModule = () => {
  const [burbujas, setBurbujas] = useState<IChatbotBurbuja[]>([]);
  // Historial crudo de la API: incluye los bloques de razonamiento y de
  // llamadas a herramientas, y se reenvía entero en cada consulta para que
  // el modelo no pierda el contexto.
  const [conversacion, setConversacion] = useState<IChatbotItemApi[]>([]);
  const [entrada, setEntrada] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  // Los atajos arrancan plegados: al entrar sólo se ven Nacho y el input. Se
  // despliegan al enfocar el campo y ya no se vuelven a cerrar — cerrarlos al
  // perder el foco haría que se plieguen justo al ir a clickear uno.
  const [atajosAbiertos, setAtajosAbiertos] = useState(false);
  // Consultas usadas del cupo del mes. La API lo devuelve pegado a cada
  // respuesta, así que sólo se pide aparte al entrar y cuando una consulta
  // falla (por ejemplo, al agotarse el cupo, que llega como error).
  const [cupo, setCupo] = useState<IChatbotCupo | null>(null);
  const archivoAtajoRef = useRef<HTMLInputElement>(null);
  const bloqueEntradaRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textoPendienteRef = useRef("");
  const flushRef = useRef<number | null>(null);
  const descartarTextoPendiente = () => {
    textoPendienteRef.current = "";
    if (flushRef.current !== null) {
      cancelAnimationFrame(flushRef.current);
      flushRef.current = null;
    }
  };
  const contenedorRef = useRef<HTMLDivElement>(null);
  const finRef = useRef<HTMLDivElement>(null);
  const usuario = userStore((estado) => estado.user);

  const vacio = burbujas.length === 0;

  const refrescarCupo = useCallback(async () => {
    const respuesta = await fetchData("chatbot/uso");
    if (respuesta?.ok) setCupo(respuesta.data as IChatbotCupo);
  }, []);

  useEffect(() => {
    void refrescarCupo();
  }, [refrescarCupo]);

  // Sigue el final del hilo mientras llega texto, salvo que el admin haya
  // scrolleado hacia arriba para leer algo: ahí no se lo molesta.
  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor || vacio) return;
    const distanciaAlFinal =
      contenedor.scrollHeight - contenedor.scrollTop - contenedor.clientHeight;
    if (distanciaAlFinal < 160) {
      finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [burbujas, vacio]);

  // Cortar la consulta si el admin se va de la pantalla.
  useEffect(() => () => abortRef.current?.abort(), []);

  // Las sugerencias se repliegan al clickear fuera del bloque del input. Va en
  // `pointerdown` y no en `click`: si el textarea pierde el foco por un click
  // que empieza afuera, el pliegue tiene que salir con el mismo gesto.
  useEffect(() => {
    if (!atajosAbiertos) return;
    const alApuntar = (evento: PointerEvent) => {
      const bloque = bloqueEntradaRef.current;
      if (bloque && !bloque.contains(evento.target as Node)) setAtajosAbiertos(false);
    };
    document.addEventListener("pointerdown", alApuntar);
    return () => document.removeEventListener("pointerdown", alApuntar);
  }, [atajosAbiertos]);

  const actualizarBurbuja = useCallback(
    (id: string, cambio: (burbuja: IChatbotBurbuja) => IChatbotBurbuja) => {
      setBurbujas((previas) => previas.map((b) => (b.id === id ? cambio(b) : b)));
    },
    []
  );

  const aplicarEvento = useCallback(
    (id: string, evento: IChatbotEvento) => {
      switch (evento.tipo) {
        case "turno":
          // Cada vuelta del modelo empieza de cero: si escribió algo antes de
          // llamar a una herramienta, la respuesta definitiva viene después.
          descartarTextoPendiente();
          actualizarBurbuja(id, (b) => ({ ...b, texto: "" }));
          break;
        case "estado":
          actualizarBurbuja(id, (b) => ({
            ...b,
            estado: { etapa: evento.etapa, texto: evento.texto },
          }));
          break;
        case "herramienta":
          actualizarBurbuja(id, (b) => {
            const pasos = [...(b.pasos ?? [])];
            if (evento.estado === "inicio") {
              const paso: IChatbotPaso = {
                id: evento.id,
                nombre: evento.nombre,
                etiqueta: evento.etiqueta || "Consultando la base",
                input: evento.input,
                estado: "en_curso",
              };
              pasos.push(paso);
              return { ...b, pasos, estado: { etapa: "consultando", texto: "Consultando la base" } };
            }
            const indice = pasos.findIndex((p) => p.id === evento.id);
            if (indice >= 0) {
              pasos[indice] = {
                ...pasos[indice],
                estado: evento.error ? "error" : "ok",
                resumen: evento.resumen,
                ms: evento.ms,
                error: evento.error,
              };
            }
            return { ...b, pasos };
          });
          break;
        case "texto":
          // Los deltas llegan de a varios por segundo: se juntan y se vuelca
          // uno por frame, así el hilo no se re-renderiza por cada token.
          textoPendienteRef.current += evento.delta;
          if (flushRef.current === null) {
            flushRef.current = requestAnimationFrame(() => {
              flushRef.current = null;
              const pendiente = textoPendienteRef.current;
              textoPendienteRef.current = "";
              if (pendiente) actualizarBurbuja(id, (b) => ({ ...b, texto: b.texto + pendiente }));
            });
          }
          break;
        case "archivo": {
          const { tipo: _tipo, ...analisis } = evento;
          actualizarBurbuja(id, (b) => ({ ...b, analisis }));
          break;
        }
        default:
          break;
      }
    },
    [actualizarBurbuja]
  );

  const enviar = async (texto: string, adjuntoForzado?: File | null) => {
    const pregunta = texto.trim();
    const adjunto = adjuntoForzado === undefined ? archivo : adjuntoForzado;
    // Con un archivo adjunto no hace falta escribir nada.
    if ((!pregunta && !adjunto) || cargando) return;

    setEntrada("");
    setArchivo(null);
    setCargando(true);

    const idRespuesta = nuevoId();
    setBurbujas((previas) => [
      ...previas,
      {
        id: nuevoId(),
        autor: "usuario",
        texto: pregunta || MENSAJE_ARCHIVO,
        adjunto: adjunto?.name,
      },
      {
        id: idRespuesta,
        autor: "asistente",
        texto: "",
        pasos: [],
        enCurso: true,
        estado: { etapa: "conectando", texto: "Conectando" },
      },
    ]);

    const formData = new FormData();
    formData.append("mensaje", pregunta);
    formData.append("conversacion", JSON.stringify(conversacion));
    if (adjunto) formData.append("archivo", adjunto);

    const abortador = new AbortController();
    abortRef.current = abortador;

    const resultado = await postStream(
      "chatbot",
      formData,
      (evento) => aplicarEvento(idRespuesta, evento),
      abortador.signal
    );

    abortRef.current = null;
    descartarTextoPendiente();
    setCargando(false);

    // El cupo cambia igual cuando la consulta falla o se corta: los tokens que
    // alcanzó a consumir ya se pagaron.
    if (resultado.data?.cupo) setCupo(resultado.data.cupo as IChatbotCupo);
    else void refrescarCupo();

    if (!resultado.ok) {
      if (resultado.cancelada) {
        actualizarBurbuja(idRespuesta, (b) => ({
          ...b,
          enCurso: false,
          estado: null,
          detenida: true,
          pasos: (b.pasos ?? []).filter((p) => p.estado !== "en_curso"),
        }));
        return;
      }
      actualizarBurbuja(idRespuesta, (b) => ({
        ...b,
        enCurso: false,
        estado: null,
        error: true,
        texto: resultado.message || "No pude procesar la consulta.",
        pasos: (b.pasos ?? []).map((p) =>
          p.estado === "en_curso" ? { ...p, estado: "error", error: "interrumpida" } : p
        ),
        reintentar: adjunto ? undefined : { texto: pregunta },
      }));
      return;
    }

    const data = resultado.data;
    setConversacion(data.conversacion ?? []);
    actualizarBurbuja(idRespuesta, (b) => ({
      ...b,
      enCurso: false,
      estado: null,
      texto: data.respuesta,
      propuestas: data.propuestas,
      analisis: data.analisis_archivo ?? b.analisis,
      duracionMs: data.duracion_ms,
      // Los pasos ya llegaron por el stream; se completan con lo definitivo
      // por si algún evento se perdió.
      pasos: (data.herramientas_usadas ?? []).length
        ? (data.herramientas_usadas as IChatbotPaso[]).map((h) => ({
            ...h,
            estado: h.error ? "error" : "ok",
          }))
        : b.pasos,
    }));
  };

  const detener = () => {
    abortRef.current?.abort();
  };

  const reintentar = (burbuja: IChatbotBurbuja) => {
    if (!burbuja.reintentar || cargando) return;
    // Se saca el par pregunta/error y se vuelve a mandar la misma pregunta.
    setBurbujas((previas) => {
      const indice = previas.findIndex((b) => b.id === burbuja.id);
      if (indice <= 0) return previas;
      return [...previas.slice(0, indice - 1), ...previas.slice(indice + 1)];
    });
    void enviar(burbuja.reintentar.texto, null);
  };

  const reiniciar = () => {
    abortRef.current?.abort();
    setBurbujas([]);
    setConversacion([]);
    setEntrada("");
    setArchivo(null);
  };

  const nombreAdmin: string | undefined =
    usuario?.name || usuario?.nombre || usuario?.email?.split("@")[0];

  // Nacho reacciona a lo que está pasando de verdad: mientras hay una consulta
  // en curso muestra la etapa que manda la API por el stream; si no, mira al
  // composer cuando el admin está escribiendo.
  const escribiendo = Boolean(entrada.trim() || archivo);
  const burbujaEnCurso = [...burbujas]
    .reverse()
    .find((b) => b.autor === "asistente" && b.enCurso);
  const estadoNacho: EstadoNacho = burbujaEnCurso
    ? estadoDeBurbuja(burbujaEnCurso)
    : escribiendo
      ? "escuchando"
      : "reposo";

  // Los estados intermedios ya los canta la línea de pasos; acá sólo van los
  // terminales, para no hacer que el lector de pantalla repita todo dos veces.
  const ultima = burbujas[burbujas.length - 1];
  const anuncio = ultima?.autor === "asistente" ? anuncioDeBurbuja(ultima) : "";

  // ---------------------------------------------------------------------
  // Estado inicial: todo centrado, el input al medio de la pantalla.
  // ---------------------------------------------------------------------
  if (vacio) {
    return (
      <div className="relative flex h-full items-center justify-center px-4">
        <div className="absolute right-4 top-2.5">
          <CupoNacho cupo={cupo} />
        </div>
        <div className="w-full max-w-2xl -translate-y-6">
          <div className="mb-8 flex flex-col items-center text-center">
            <AvatarNacho tamano={132} estado={estadoNacho} sigueCursor />
            <h1 className="mt-6 text-3xl font-semibold tracking-tight">
              {saludo()}
              {nombreAdmin ? `, ${nombreAdmin}` : ""}.
            </h1>
          </div>

          {/* onFocus burbujea (React lo implementa sobre focusin), así que
              alcanza con escucharlo en el contenedor. */}
          <div ref={bloqueEntradaRef} onFocus={() => setAtajosAbiertos(true)}>
            <Composer
              valor={entrada}
              onCambio={setEntrada}
              onEnviar={() => enviar(entrada)}
              cargando={cargando}
              onDetener={detener}
              archivo={archivo}
              onArchivo={setArchivo}
            />

            <div
              className="atajos-nacho"
              data-abierto={atajosAbiertos}
              aria-hidden={!atajosAbiertos}
            >
              <div>
                <p className="mt-4 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Sugerencias
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ATAJOS.map(({ icono: Icono, texto, adjunta }, indice) => (
                    <button
                      key={texto}
                      type="button"
                      tabIndex={atajosAbiertos ? undefined : -1}
                      onClick={() =>
                        adjunta ? archivoAtajoRef.current?.click() : setEntrada(`${texto}: `)
                      }
                      style={{ animationDelay: `${indice * 45}ms` }}
                      className={`flex items-center gap-2.5 rounded-xl border bg-background px-3.5 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground ${
                        atajosAbiertos ? "animacion-respuesta" : ""
                      }`}
                    >
                      <Icono className="h-4 w-4 shrink-0 opacity-70" />
                      {texto}
                    </button>
                  ))}
                </div>

                <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Nacho nunca modifica la base por su cuenta: cada cambio lo confirmás vos.
                </p>
              </div>
            </div>
          </div>

          <input
            ref={archivoAtajoRef}
            type="file"
            accept=".xlsx,.xls,.xlsm,.csv"
            onChange={(evento) => {
              setArchivo(evento.target.files?.[0] ?? null);
              evento.target.value = "";
            }}
            className="hidden"
          />

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Conversación: hilo a pantalla completa, input anclado abajo.
  // ---------------------------------------------------------------------
  return (
    <div className="relative flex h-full flex-col">
      <p className="sr-only" role="status" aria-live="polite">
        {anuncio}
      </p>
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-2.5">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
          <AvatarNacho tamano={20} estado={estadoNacho} />
          <span className="font-medium text-foreground">Nacho</span>
          <span>· asistente de UESEVI</span>
          <span className="rounded-full border px-1.5 py-px text-[10px] font-medium uppercase tracking-wider">
            Beta
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CupoNacho cupo={cupo} />
          <button
            type="button"
            onClick={reiniciar}
            aria-label="Nueva conversación"
            title="Nueva conversación"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <SquarePen className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <div ref={contenedorRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-7 px-4 pb-8 pt-16">
          {burbujas.map((burbuja) =>
            burbuja.autor === "usuario" ? (
              <div key={burbuja.id} className="flex flex-col items-end gap-1.5">
                {burbuja.adjunto && (
                  <span className="flex max-w-[80%] items-center gap-1.5 rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground">
                    <Paperclip className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{burbuja.adjunto}</span>
                  </span>
                )}
                <p className="animacion-respuesta max-w-[80%] whitespace-pre-wrap rounded-2xl bg-muted px-4 py-2.5 text-[15px]">
                  {burbuja.texto}
                </p>
              </div>
            ) : (
              <div key={burbuja.id} className="flex gap-3">
                <div className="pt-0.5">
                  <AvatarNacho estado={estadoDeBurbuja(burbuja)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Nacho</p>

                  {burbuja.analisis && <ChipArchivo analisis={burbuja.analisis} />}

                  <PasosNacho
                    pasos={burbuja.pasos ?? []}
                    enCurso={Boolean(burbuja.enCurso)}
                    estado={burbuja.estado}
                    duracionMs={burbuja.duracionMs}
                  />

                  {burbuja.error ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm">
                      <p className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span>{burbuja.texto}</span>
                      </p>
                      {burbuja.reintentar && (
                        <button
                          type="button"
                          onClick={() => reintentar(burbuja)}
                          disabled={cargando}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reintentar
                        </button>
                      )}
                    </div>
                  ) : (
                    burbuja.texto && (
                      <div className={burbuja.enCurso ? "cursor-nacho" : ""}>
                        <Markdown texto={burbuja.texto} animar={false} />
                      </div>
                    )
                  )}

                  {burbuja.detenida && (
                    <p className="mt-2 text-xs italic text-muted-foreground">
                      Respuesta detenida. Esta pregunta no queda en el hilo: volvé a
                      hacerla si la necesitás.
                    </p>
                  )}

                  {burbuja.propuestas?.map((propuesta) => (
                    <PropuestaCard key={propuesta.id} propuesta={propuesta} />
                  ))}
                </div>
              </div>
            )
          )}

          <div ref={finRef} />
        </div>
      </div>

      <div className="bg-gradient-to-t from-background via-background to-transparent pb-4 pt-2">
        <div className="mx-auto w-full max-w-3xl px-4">
          <p className="mb-2 text-center text-[11px] text-muted-foreground">
            Nacho es una IA, puede cometer errores. Considerá verificar la información
            importante.
          </p>
          <Composer
            valor={entrada}
            onCambio={setEntrada}
            onEnviar={() => enviar(entrada)}
            cargando={cargando}
            onDetener={detener}
            archivo={archivo}
            onArchivo={setArchivo}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotModule;
