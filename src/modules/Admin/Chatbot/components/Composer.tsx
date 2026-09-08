"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface ComposerProps {
  valor: string;
  onCambio: (valor: string) => void;
  onEnviar: () => void;
  cargando: boolean;
  autoFocus?: boolean;
}

/**
 * Caja de escritura. Se usa igual en el estado vacío (centrada) y en la
 * conversación (anclada abajo), así el input no "salta" de aspecto.
 */
const Composer = ({ valor, onCambio, onEnviar, cargando, autoFocus }: ComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Crece con el contenido hasta un tope, en vez de tener scroll interno.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [valor]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const manejarTecla = (evento: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evento.key === "Enter" && !evento.shiftKey) {
      evento.preventDefault();
      onEnviar();
    }
  };

  const puedeEnviar = !cargando && valor.trim().length > 0;

  return (
    <div className="relative rounded-3xl border bg-background shadow-sm transition-shadow focus-within:shadow-md">
      <textarea
        ref={textareaRef}
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        onKeyDown={manejarTecla}
        rows={1}
        placeholder="Preguntá algo sobre la base…"
        disabled={cargando}
        className="max-h-[200px] w-full resize-none bg-transparent py-4 pl-5 pr-14 text-[15px] leading-6 placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onEnviar}
        disabled={!puedeEnviar}
        aria-label="Enviar"
        className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-25"
      >
        {cargando ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowUp className="h-4 w-4" />
        )}
      </button>
    </div>
  );
};

export default Composer;
