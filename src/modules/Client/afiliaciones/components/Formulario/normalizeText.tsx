// Función para normalizar texto
export function normalizeText(text: string): string {
  // Primero, normalizamos para descomponer caracteres con acentos
  const normalized = text
    .normalize("NFD")
    // Luego, eliminamos los caracteres de combinación (los acentos)
    .replace(/[\u0300-\u036f]/g, "")
    // Convertimos a minúsculas para mayor consistencia (opcional)
    .toLowerCase();

  return normalized;
}
