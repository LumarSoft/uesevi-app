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

export interface IChatbotRespuesta {
  respuesta: string;
  propuestas: IChatbotPropuesta[];
  herramientas_usadas: IChatbotHerramientaUsada[];
  conversacion: IChatbotItemApi[];
}

// Lo que se dibuja en pantalla (una burbuja por turno visible).
export interface IChatbotBurbuja {
  id: string;
  autor: "usuario" | "asistente";
  texto: string;
  herramientas?: IChatbotHerramientaUsada[];
  propuestas?: IChatbotPropuesta[];
  error?: boolean;
}
