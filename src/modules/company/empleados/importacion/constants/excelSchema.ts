export const EXCEL_SCHEMA_VERSION = "2025-06-12"; // Fecha de la última actualización del formato

export const REQUIRED_COLUMNS = [
  "nombre",
  "apellido",
  "cuil",
  "adherido_a_sindicato",
  "categora",
  "sueldo_bsico",
  "adicionales",
  "ad_remunerativo",
];

export const CATEGORIAS_PERMITIDAS = [
  "Vigilador General",
  "Vigilador Bombero",
  "Administrativo",
  "Vigilador Principal",
  "Verificador Evento",
  "Operador de monitoreo",
  "Guía Técnico",
  "Instalador de elementos de seguridad electrónica",
  "Controlador de admisión y permanencia en gral.",
];

// Función para verificar si el usuario necesita ver la notificación de actualización
export const shouldShowUpdateNotification = (): boolean => {
  const lastSeenVersion = localStorage.getItem("excelSchemaVersionSeen");
  return lastSeenVersion !== EXCEL_SCHEMA_VERSION;
};

// Función para marcar la versión actual como vista
export const markVersionAsSeen = (): void => {
  localStorage.setItem("excelSchemaVersionSeen", EXCEL_SCHEMA_VERSION);
};
