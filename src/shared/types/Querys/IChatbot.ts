// Items del historial de la Responses API de OpenAI: mensajes, pero también
// bloques de razonamiento, function_call y function_call_output. El front no
// los interpreta — los guarda tal cual y los reenvía en el próximo mensaje
// para que el modelo conserve el contexto de sus herramientas.
export type IChatbotItemApi = Record<string, unknown>;

export interface IChatbotPropuesta {
  id: string;
  resumen: string;
  valores_actuales: Record<string, string | number | null>;
  valores_nuevos: Record<string, string | number | null>;
}

export interface IChatbotHerramientaUsada {
  nombre: string;
  input: Record<string, unknown>;
}

export interface IChatbotAnalisisArchivo {
  archivo: string;
  legible: boolean;
  es_valido: boolean;
  filas_leidas: number;
  cantidad_errores: number;
}

export interface IChatbotRespuesta {
  respuesta: string;
  analisis_archivo: IChatbotAnalisisArchivo | null;
  propuestas: IChatbotPropuesta[];
  herramientas_usadas: IChatbotHerramientaUsada[];
  conversacion: IChatbotItemApi[];
}

// Lo que se dibuja en pantalla (una burbuja por turno visible).
export interface IChatbotBurbuja {
  id: string;
  autor: "usuario" | "asistente";
  texto: string;
  // Nombre del Excel que se mandó junto al mensaje, si hubo uno.
  adjunto?: string;
  herramientas?: IChatbotHerramientaUsada[];
  propuestas?: IChatbotPropuesta[];
  error?: boolean;
}
