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

// Un paso de Nacho: una herramienta que corrió contra la base. Es lo que se
// muestra en la línea de tiempo mientras responde y queda como "fuentes".
export interface IChatbotPaso {
  id: string;
  nombre: string;
  etiqueta: string;
  input?: Record<string, unknown>;
  estado: "en_curso" | "ok" | "error";
  resumen?: string;
  ms?: number;
  error?: string | null;
}

export interface IChatbotAnalisisArchivo {
  archivo: string;
  legible: boolean;
  es_valido: boolean;
  filas_leidas: number;
  cantidad_errores: number;
}

// Cupo del período: lo que se dibuja en la barra del panel. La unidad que se
// cobra es la consulta, no el token — el bloque `costos` sólo viaja para el
// proveedor del sistema (ver CHATBOT_EMAILS_PROVEEDOR en la API).
export interface IChatbotCostos {
  costo_usd: number;
  costo_promedio_usd: number;
  tope_usd: number;
  tokens_entrada: number;
  tokens_cacheados: number;
  tokens_salida: number;
  tokens_razonamiento: number;
  cache_hit: number;
  duracion_promedio_ms: number;
  con_error: number;
  precios_configurados: boolean;
}

export interface IChatbotCupo {
  periodo: string;
  modo: "prueba" | "plan";
  consultas_usadas: number;
  consultas_incluidas: number;
  consultas_restantes: number;
  porcentaje: number;
  nivel: "ok" | "aviso" | "critico" | "agotado";
  bloqueado: boolean;
  motivo_bloqueo: "cupo" | "tope" | null;
  prueba: { inicio: string; dias: number; dia: number; fin: string; activa: boolean } | null;
  costos?: IChatbotCostos;
  proveedor?: boolean;
}

// GET /chatbot/reporte — sólo para el proveedor: costos reales, proyección y
// margen contra un precio de referencia.
export interface IChatbotReporte {
  periodo: string;
  plan: {
    modo: "prueba" | "plan";
    consultas_incluidas: number;
    tope_usd: number;
    prueba_inicio: string | null;
    prueba_dias: number;
  };
  analisis: {
    dias_con_uso: number;
    consultas: number;
    consultas_por_dia: number;
    costo_usd: number;
    costo_promedio_usd: number;
    costo_por_dia_usd: number;
    proyeccion_mensual_usd: number;
    proyeccion_mensual_consultas: number;
    cupo_sugerido: number;
    markup: number;
    piso_usd: number;
    precio_sugerido_usd: number;
    cache_hit: number;
    precios_configurados: boolean;
  };
  por_dia: { dia: string; consultas: number; costo_usd: number; tokens: number }[];
  por_usuario: { usuario_id: number; nombre: string; consultas: number; costo_usd: number }[];
  por_periodo: { periodo: string; consultas: number; costo_usd: number }[];
}

export interface IChatbotRespuesta {
  respuesta: string;
  analisis_archivo: IChatbotAnalisisArchivo | null;
  propuestas: IChatbotPropuesta[];
  herramientas_usadas: IChatbotPaso[];
  conversacion: IChatbotItemApi[];
  duracion_ms?: number;
  // Cupo ya actualizado con esta consulta: evita un GET extra por pregunta.
  cupo?: IChatbotCupo;
}

// Eventos que manda la API por el stream (POST /chatbot con Accept: text/event-stream).
export type IChatbotEvento =
  | { tipo: "turno"; numero: number }
  | { tipo: "estado"; etapa: string; texto: string }
  | {
      tipo: "herramienta";
      estado: "inicio" | "fin";
      id: string;
      nombre: string;
      etiqueta?: string;
      input?: Record<string, unknown>;
      resumen?: string;
      ms?: number;
      error?: string | null;
    }
  | { tipo: "texto"; delta: string }
  | ({ tipo: "archivo" } & IChatbotAnalisisArchivo)
  | { tipo: "final"; data: IChatbotRespuesta }
  | { tipo: "error"; statusCode: number; message: string; detalle?: string | null };

// Lo que se dibuja en pantalla (una burbuja por turno visible).
export interface IChatbotBurbuja {
  id: string;
  autor: "usuario" | "asistente";
  texto: string;
  // Nombre del Excel que se mandó junto al mensaje, si hubo uno.
  adjunto?: string;
  analisis?: IChatbotAnalisisArchivo | null;
  pasos?: IChatbotPaso[];
  propuestas?: IChatbotPropuesta[];
  // Mientras Nacho responde: en qué etapa está y si el texto sigue llegando.
  enCurso?: boolean;
  estado?: { etapa: string; texto: string } | null;
  duracionMs?: number;
  error?: boolean;
  detenida?: boolean;
  // Pregunta original, para poder reintentar desde una burbuja de error.
  reintentar?: { texto: string };
}
