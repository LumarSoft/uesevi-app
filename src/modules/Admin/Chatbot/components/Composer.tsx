"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";

// Mismos formatos que acepta la API en POST /chatbot.
const FORMATOS_ACEPTADOS = ".xlsx,.xls,.xlsm,.csv";
const TAMANO_MAXIMO_MB = 5;
const ALTO_MAXIMO = 200; // px que puede crecer el textarea antes de hacer scroll

interface ComposerProps {
  valor: string;
  onCambio: (valor: string) => void;
  onEnviar: () => void;
  cargando: boolean;
  // Corta la consulta en curso (el stream se aborta y el modelo deja de correr).
  onDetener?: () => void;
  archivo: File | null;
  onArchivo: (archivo: File | null) => void;
  autoFocus?: boolean;
}

const formatearPeso = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/**
 * Caja de escritura. Se usa igual en el estado vacío (centrada) y en la
 * conversación (anclada abajo), así el input no "salta" de aspecto.
 */
const Composer = ({
  valor,
  onCambio,
  onEnviar,
  cargando,
  onDetener,
  archivo,
  onArchivo,
  autoFocus,
}: ComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  // Crece con el contenido hasta un tope, en vez de tener scroll interno.
  // Se mide dentro de un rAF: en el primer render el efecto corre antes de que
  // estén aplicadas las clases de Tailwind y scrollHeight devuelve cualquier
  // cosa (se clavaba en el máximo de 200px con el campo vacío).
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cuadro = requestAnimationFrame(() => {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, ALTO_MAXIMO)}px`;
    });
    return () => cancelAnimationFrame(cuadro);
  }, [valor, archivo]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const manejarTecla = (evento: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      onEnviar();
    }
  };

  const elegirArchivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const seleccionado = evento.target.files?.[0] ?? null;
    onArchivo(seleccionado);
    // Se limpia el input para poder volver a elegir el mismo archivo.
    evento.target.value = "";
  };

  // Con un archivo adjunto alcanza para enviar: si no escribe nada, la API
  // asume que lo que quiere es que lo revisemos. Mientras Nacho responde se
  // puede seguir escribiendo, pero no enviar.
  const puedeEnviar = !cargando && (valor.trim().length > 0 || Boolean(archivo));

  return (
    <div className="rounded-3xl border bg-background shadow-sm transition-shadow focus-within:shadow-md">
      {archivo && (
        <div className="flex items-center gap-2 border-b px-4 py-2.5">
          <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm">{archivo.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatearPeso(archivo.size)}
          </span>
          <button
            type="button"
            onClick={() => onArchivo(null)}
            aria-label="Quitar archivo"
            className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={valor}
          onChange={(evento) => onCambio(evento.target.value)}
          onKeyDown={manejarTecla}
          rows={1}
          placeholder={
            archivo ? "Contame qué querés que revise…" : "Preguntale a Nacho…"
          }
          className="max-h-[200px] w-full resize-none bg-transparent py-4 pl-14 pr-14 text-[15px] leading-6 placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
        />

        <input
          ref={archivoRef}
          type="file"
          accept={FORMATOS_ACEPTADOS}
          onChange={elegirArchivo}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => archivoRef.current?.click()}
          disabled={cargando}
          aria-label={`Adjuntar Excel (máximo ${TAMANO_MAXIMO_MB} MB)`}
          title={`Adjuntar el Excel de una declaración jurada (máximo ${TAMANO_MAXIMO_MB} MB)`}
          className="absolute bottom-2.5 left-2.5 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
        >
          <Paperclip className="h-[18px] w-[18px]" />
        </button>

        {cargando && onDetener ? (
          <button
            type="button"
            onClick={onDetener}
            aria-label="Detener"
            title="Detener la respuesta"
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-opacity hover:opacity-80"
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnviar}
            disabled={!puedeEnviar}
            aria-label="Enviar"
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-25"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Composer;
