import type { IChatbotBurbuja } from "@/shared/types/Querys/IChatbot";
import type { EstadoNacho } from "./motor";

/**
 * Traduce la etapa que manda la API por el stream al estado de Nacho.
 *
 * Las etapas las emite `chatbotController.js`: "pensando" y "analizando" en
 * cada vuelta del modelo, "consultando" antes de una herramienta, "archivo"
 * al leer un Excel y "redactando" cuando empieza a salir el texto final.
 * "conectando" la pone el front antes del primer evento.
 *
 * La distinción que importa acá es leyendo vs. pensando: son los dos momentos
 * largos y hoy se ven idénticos desde afuera. Que uno barra renglones y el
 * otro mire fijo le dice al administrativo si Nacho está esperando a la base
 * o al modelo, sin leer una palabra.
 */
export const estadoDeEtapa = (etapa?: string | null): EstadoNacho => {
  switch (etapa) {
    case "consultando":
    case "archivo":
      return "leyendo";
    case "redactando":
      return "redactando";
    case "conectando":
    case "pensando":
    case "analizando":
    default:
      return "pensando";
  }
};

/** Estado de Nacho para una burbuja del hilo. */
export const estadoDeBurbuja = (burbuja: IChatbotBurbuja): EstadoNacho => {
  if (burbuja.error) return "falla";
  if (burbuja.enCurso) {
    // Si ya está llegando texto, redacta — aunque el último "estado" que haya
    // mandado la API sea otro. El texto es la señal más confiable de las dos.
    if (burbuja.texto) return "redactando";
    return estadoDeEtapa(burbuja.estado?.etapa);
  }
  if (burbuja.detenida) return "reposo";
  // Terminó bien: el motor sostiene "encontrado" 1,2 s y vuelve solo a reposo.
  return "encontrado";
};

/**
 * Texto para el live region. Sólo estados terminales: mientras Nacho trabaja
 * ya lo anuncia la línea de pasos, y dos regiones diciendo lo mismo hacen que
 * el lector de pantalla repita todo.
 */
export const anuncioDeBurbuja = (burbuja: IChatbotBurbuja): string => {
  if (burbuja.enCurso) return "";
  if (burbuja.error) return "Nacho no pudo completar la consulta.";
  if (burbuja.detenida) return "Respuesta detenida.";
  return "Respuesta lista.";
};
