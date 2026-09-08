"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, FileClock, FileSpreadsheet, Paperclip, SquarePen, Users } from "lucide-react";
import { postData } from "@/services/mysql/functions";
import {
  IChatbotBurbuja,
  IChatbotItemApi,
} from "@/shared/types/Querys/IChatbot";
import type { LucideIcon } from "lucide-react";
import Composer from "./components/Composer";
import OrbPensando from "./components/OrbPensando";
import Markdown from "./components/Markdown";
import PropuestaCard from "./components/PropuestaCard";

// Nombres legibles para el detalle plegado de "qué consultó".
const ETIQUETAS_HERRAMIENTAS: Record<string, string> = {
  buscar_empresa: "Búsqueda de empresas",
  detalle_empresa: "Datos de la empresa",
  ultima_declaracion_empresa: "Última declaración jurada",
  listar_declaraciones_empresa: "Declaraciones de la empresa",
  buscar_empleado: "Búsqueda de empleados",
  listar_empleados_empresa: "Empleados de la empresa",
  empresas_deudoras: "Empresas deudoras",
  listar_categorias: "Escala de categorías",
  tasa_interes: "Tasa de interés",
  estadisticas_generales: "Estadísticas generales",
  consulta_sql: "Consulta a la base",
  proponer_actualizar_empresa: "Propuesta: modificar empresa",
  proponer_actualizar_categoria: "Propuesta: modificar categoría",
  proponer_actualizar_tasa: "Propuesta: modificar tasa",
  proponer_actualizar_empleado: "Propuesta: modificar empleado",
};

const ATAJOS: { icono: LucideIcon; texto: string; adjunta?: boolean }[] = [
  { icono: FileClock, texto: "Última declaración de una empresa" },
  { icono: Users, texto: "En qué empresa está un empleado" },
  { icono: Building2, texto: "Datos de contacto de una empresa" },
  { icono: FileSpreadsheet, texto: "Revisar un Excel que la empresa no pudo subir", adjunta: true },
];

const nuevoId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

const ChatbotModule = () => {
  const [burbujas, setBurbujas] = useState<IChatbotBurbuja[]>([]);
  // Historial crudo de la API: incluye los bloques de razonamiento y de
  // llamadas a herramientas, y se reenvía
  // entero en cada consulta para que el modelo no pierda el contexto.
  const [conversacion, setConversacion] = useState<IChatbotItemApi[]>([]);
  const [entrada, setEntrada] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);
  // Si el orbe no puede dibujarse (sin WebGPU, o el usuario pidió menos
  // movimiento) se cae a los puntitos y no se reintenta en toda la sesión.
  const [orbeDisponible, setOrbeDisponible] = useState(true);
  const archivoAtajoRef = useRef<HTMLInputElement>(null);

  const finRef = useRef<HTMLDivElement>(null);
  const vacio = burbujas.length === 0;

  useEffect(() => {
    if (!vacio) finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [burbujas, cargando, vacio]);

  const enviar = async (texto: string) => {
    const pregunta = texto.trim();
    const adjunto = archivo;
    // Con un archivo adjunto no hace falta escribir nada.
    if ((!pregunta && !adjunto) || cargando) return;

    setEntrada("");
    setArchivo(null);
    setCargando(true);
    setBurbujas((previas) => [
      ...previas,
      {
        id: nuevoId(),
        autor: "usuario",
        texto: pregunta || "Revisá este Excel de declaración jurada.",
        adjunto: adjunto?.name,
      },
    ]);

    const formData = new FormData();
    formData.append("mensaje", pregunta);
    formData.append("conversacion", JSON.stringify(conversacion));
    if (adjunto) formData.append("archivo", adjunto);

    const resultado = await postData("chatbot", formData);
    setCargando(false);

    if (!resultado.ok) {
      setBurbujas((previas) => [
        ...previas,
        {
          id: nuevoId(),
          autor: "asistente",
          texto: resultado.message || "No pude procesar la consulta.",
          error: true,
        },
      ]);
      return;
    }

    setConversacion(resultado.data.conversacion ?? []);
    setBurbujas((previas) => [
      ...previas,
      {
        id: nuevoId(),
        autor: "asistente",
        texto: resultado.data.respuesta,
        herramientas: resultado.data.herramientas_usadas,
        propuestas: resultado.data.propuestas,
      },
    ]);
  };

  const reiniciar = () => {
    setBurbujas([]);
    setConversacion([]);
    setEntrada("");
    setArchivo(null);
  };

  // ---------------------------------------------------------------------
  // Estado inicial: todo centrado, el input al medio de la pantalla.
  // ---------------------------------------------------------------------
  if (vacio) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <div className="w-full max-w-2xl -translate-y-8">
          <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight">
            ¿Qué querés consultar?
          </h1>

          <Composer
            valor={entrada}
            onCambio={setEntrada}
            onEnviar={() => enviar(entrada)}
            cargando={cargando}
            archivo={archivo}
            onArchivo={setArchivo}
            autoFocus
          />

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

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {ATAJOS.map(({ icono: Icono, texto, adjunta }) => (
              <button
                key={texto}
                type="button"
                onClick={() =>
                  adjunta ? archivoAtajoRef.current?.click() : setEntrada(`${texto}: `)
                }
                className="flex items-center gap-2.5 rounded-xl border bg-background px-3.5 py-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icono className="h-4 w-4 shrink-0 opacity-70" />
                {texto}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------
  // Conversación: hilo a pantalla completa, input anclado abajo.
  // ---------------------------------------------------------------------
  return (
    <div className="relative flex h-full flex-col">
      <button
        type="button"
        onClick={reiniciar}
        aria-label="Nueva conversación"
        className="absolute right-4 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        <SquarePen className="h-[18px] w-[18px]" />
      </button>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-6 px-4 pb-8 pt-12">
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
              <div
                key={burbuja.id}
                className={
                  burbuja.error
                    ? "rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm"
                    : ""
                }
              >
                <Markdown texto={burbuja.texto} />

                {burbuja.propuestas?.map((propuesta) => (
                  <PropuestaCard key={propuesta.id} propuesta={propuesta} />
                ))}

                {!!burbuja.herramientas?.length && (
                  <details
                    className="animacion-respuesta mt-3 text-xs text-muted-foreground"
                    style={{ animationDelay: "240ms" }}
                  >
                    <summary className="cursor-pointer select-none list-none opacity-60 transition-opacity hover:opacity-100">
                      {burbuja.herramientas.length}{" "}
                      {burbuja.herramientas.length === 1
                        ? "consulta a la base"
                        : "consultas a la base"}
                    </summary>
                    <ul className="mt-2 space-y-1 border-l pl-3">
                      {burbuja.herramientas.map((herramienta, indice) => (
                        <li key={indice}>
                          {ETIQUETAS_HERRAMIENTAS[herramienta.nombre] ?? herramienta.nombre}
                          {herramienta.nombre === "consulta_sql" &&
                            typeof herramienta.input?.explicacion === "string" && (
                              <span className="opacity-70">
                                {" "}
                                — {herramienta.input.explicacion}
                              </span>
                            )}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )
          )}

          {cargando &&
            (orbeDisponible ? (
              <OrbPensando onFallback={() => setOrbeDisponible(false)} />
            ) : (
              <div className="flex gap-1.5 py-1" aria-label="Consultando">
                {[0, 150, 300].map((retraso) => (
                  <span
                    key={retraso}
                    className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"
                    style={{ animationDelay: `${retraso}ms` }}
                  />
                ))}
              </div>
            ))}

          <div ref={finRef} />
        </div>
      </div>

      <div className="bg-gradient-to-t from-background via-background to-transparent pb-4 pt-2">
        <div className="mx-auto w-full max-w-3xl px-4">
          <Composer
            valor={entrada}
            onCambio={setEntrada}
            onEnviar={() => enviar(entrada)}
            cargando={cargando}
            archivo={archivo}
            onArchivo={setArchivo}
          />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Los cambios en la base requieren tu confirmación.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModule;
