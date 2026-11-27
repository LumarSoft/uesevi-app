// Boletín de mejoras del sistema (Admin → Mejoras).
//
// CÓMO AGREGAR UNA: sumar un objeto ARRIBA DE TODO (el más nuevo primero) en el
// mismo PR que trae el cambio, con la fecha en que llega a producción. Todas
// las mejoras de un mismo día forman una "entrega" (un número del boletín).
// Textos para quien usa el sistema, no para programadores:
//   - `antes`: qué le pasaba a la persona (omitirlo si es algo nuevo o si no
//     sabemos con certeza cómo era; no inventar).
//   - `ahora`: qué pasa desde este cambio.
// test/mejoras.test.mjs controla el formato y el orden.
//
// Sin imports en tiempo de ejecución: el test importa este .ts directo.

export const AREAS = [
  "Sitio público",
  "Portal de empresas",
  "Panel admin",
  "Todo el sistema",
] as const;
export type AreaMejora = (typeof AREAS)[number];

export const TIPOS = ["Nuevo", "Mejora", "Corrección", "Seguridad"] as const;
export type TipoMejora = (typeof TIPOS)[number];

export interface Mejora {
  /** AAAA-MM-DD: el día en que llegó a producción. */
  fecha: string;
  titulo: string;
  /** Qué pasaba antes, como lo vivía la persona. Sin esto, es algo nuevo. */
  antes?: string;
  /** Qué pasa ahora. */
  ahora: string;
  area: AreaMejora;
  tipo: TipoMejora;
}

export const MEJORAS: Mejora[] = [
  {
    fecha: "2026-11-27",
    titulo: "Un boletín con cada mejora del sistema",
    ahora:
      "Esta página. Cada cambio queda anotado el día que llega, con lo que pasaba antes y lo que pasa ahora. El punto en el menú avisa cuando hay algo que todavía no viste.",
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-11-27",
    titulo: "\"Al día\" sólo si la empresa presentó y pagó",
    antes:
      "En el Panel de Pagos, una empresa que dejó de presentar la declaración jurada aparecía en verde, \"Al día\", igual que una que pagó todo.",
    ahora:
      "Los meses vencidos sin DDJJ se muestran aparte, en amarillo (\"2 sin DDJJ\"), y el filtro suma la opción \"Sin DDJJ\". Se cuentan desde el primer mes que declaró cada empresa activa.",
    area: "Panel admin",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "Las DDJJ aprobadas ya no suman intereses",
    antes:
      "Si una declaración aprobada no tenía fecha de pago cargada, el \"Total a pagar\" seguía subiendo todos los días, en pantalla y en el PDF.",
    ahora:
      "Queda fijo. Si tiene fecha de pago, el interés se calcula hasta esa fecha, como siempre. La fórmula no cambió.",
    area: "Todo el sistema",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "Cuántos días faltan para el vencimiento",
    antes:
      "Una DDJJ recién presentada decía \"Vencida: 0 días\", en rojo, aunque todavía estaba en término.",
    ahora:
      "Dice \"Faltan 12 días\", \"Vence mañana\" o \"Vence hoy\". El rojo queda sólo para las vencidas.",
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "El menú del celular es el de la empresa",
    antes:
      "Desde el celular, el menú del portal mostraba las opciones del panel de UESEVI y, al tocar cualquiera, se cerraba la sesión.",
    ahora:
      "Muestra Declaración jurada, Historial, Mis empleados, Mi cuenta e Instructivo, y se navega sin perder la sesión.",
    area: "Portal de empresas",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "El ingreso explica qué pasó",
    antes:
      "Con la contraseña mal, la pantalla de ingreso se recargaba, borraba el email y no decía nada.",
    ahora:
      "Queda todo escrito y dice \"Contraseña incorrecta\" o \"El correo electrónico no existe\". Si la sesión venció, lo avisa al volver a ingresar.",
    area: "Todo el sistema",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Inicio, Noticias y Escalas aparecen al instante",
    antes:
      "El inicio esperaba a las noticias con un \"Cargando…\" a pantalla completa, y Noticias y Escalas esperaban un segundo y medio de más, a propósito.",
    ahora:
      "Todo aparece enseguida. Las últimas noticias se suman al final del inicio cuando llegan.",
    area: "Sitio público",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Vista previa al compartir por WhatsApp",
    antes: "Al compartir un link del sitio por WhatsApp no aparecía ninguna imagen.",
    ahora:
      "Aparece el logo de UESEVI, y al compartir una noticia, su título y su foto. Cada página tiene su propio título en la pestaña del navegador.",
    area: "Sitio público",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Las contraseñas ya no quedan a la vista",
    antes:
      "Los formularios dejaban registradas en la consola del navegador las contraseñas que se escribían y datos de las declaraciones, como los CUIL.",
    ahora: "Ya no queda nada de eso: sólo se registran los errores.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-26",
    titulo: "Pasar de página en Noticias ya no da error",
    antes:
      "El botón \"Anterior\" de la primera página de Noticias llevaba a una página que no existía.",
    ahora: "\"Anterior\" y \"Siguiente\" aparecen sólo cuando hay adónde ir.",
    area: "Sitio público",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-26",
    titulo: "Los errores ya no muestran detalles internos",
    antes:
      "Cuando algo fallaba, algunas pantallas podían recibir detalles técnicos internos del sistema.",
    ahora:
      "Se muestra un mensaje claro, y el detalle técnico queda guardado sólo para el equipo.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-24",
    titulo: "Listado de afiliados con buscador",
    ahora:
      "Desde la tarjeta de afiliados del dashboard se abre el listado completo, con búsqueda por nombre, DNI o CUIL.",
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-11-17",
    titulo: "La ficha de afiliación se carga desde el panel",
    antes: "La ficha de afiliación era un formulario abierto en el sitio.",
    ahora: "La carga el personal de UESEVI desde el panel.",
    area: "Panel admin",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-15",
    titulo: "Accesos cerrados y aviso del día 15 más confiable",
    antes:
      "Había accesos al sistema abiertos sin necesidad, y el aviso mensual a las empresas salía todo junto, de una vez.",
    ahora:
      "Esos accesos se cerraron. El aviso del día 15 sale de a tandas y vuelve a intentar los correos rechazados.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-06",
    titulo: "\"Salario del mes\" en el inicio",
    ahora:
      "Los afiliados ven cómo se compone el salario vigente, concepto por concepto. El panel suma \"Composición salarial\" para cargarlo cada mes.",
    area: "Sitio público",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-10-13",
    titulo: "\"Mi cuenta\" para las empresas",
    ahora:
      "Cada empresa puede cambiar por su cuenta el email de acceso y la contraseña.",
    area: "Portal de empresas",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-08-18",
    titulo: "El Excel de la DDJJ se revisa antes de enviarlo",
    ahora:
      "Si el archivo tiene errores, el portal dice en qué fila está cada uno y qué corregir, antes de enviarlo.",
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-08-12",
    titulo: "Panel de Pagos por fecha de cobro",
    ahora:
      "Además de la vista por período, el panel muestra lo cobrado según el mes en que entró la plata.",
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-07-31",
    titulo: "El aporte solidario incluye el presentismo",
    ahora:
      "Cada categoría tiene su presentismo, y el aporte solidario lo tiene en cuenta al cargar la DDJJ.",
    area: "Todo el sistema",
    tipo: "Mejora",
  },
  {
    fecha: "2026-07-20",
    titulo: "Una DDJJ por mes",
    antes: "Se podía cargar dos veces la declaración del mismo mes.",
    ahora:
      "El sistema no lo permite. Para corregir una declaración se usa \"Rectificar\".",
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-07-14",
    titulo: "Panel de Pagos",
    ahora:
      "Seguimiento mes a mes de lo que pagó cada empresa, con confirmación de pagos, desglose por concepto y totales del año.",
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-06-24",
    titulo: "Plantilla del Excel para descargar",
    ahora:
      "Las empresas descargan la planilla de la DDJJ con las columnas correctas y un desplegable con las categorías vigentes.",
    area: "Portal de empresas",
    tipo: "Nuevo",
  },
];

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

const partes = (fecha: string) =>
  fecha.split("-").map(Number) as [number, number, number];

/** "2026-11-27" → fecha local (sin corrimiento por zona horaria). */
export const fechaLocal = (fecha: string): Date => {
  const [y, m, d] = partes(fecha);
  return new Date(y, m - 1, d);
};

/** "2026-11-27" → "27/11". */
export const diaYMes = (fecha: string): string => {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}`;
};

/** "2026-11-07" → "7 de noviembre de 2026" (o sin el año). */
export const fechaLarga = (fecha: string, conAnio = true): string => {
  const [y, m, d] = partes(fecha);
  const texto = `${d} de ${MESES[m - 1]}`;
  return conAnio ? `${texto} de ${y}` : texto;
};

/** "2026-06-24" → "junio de 2026". */
export const mesYAnio = (fecha: string): string => {
  const [y, m] = partes(fecha);
  return `${MESES[m - 1]} de ${y}`;
};

/** Nombre del mes: "noviembre". */
export const nombreDelMes = (fecha: string): string => MESES[partes(fecha)[1] - 1];

/** Días entre la fecha y hoy (0 = hoy). */
export const diasDesde = (fecha: string, hoy: Date = new Date()): number => {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round(
    (inicioHoy.getTime() - fechaLocal(fecha).getTime()) / (1000 * 60 * 60 * 24)
  );
};

/** "hoy", "ayer", "hace 3 días", "hace 2 semanas", "hace 4 meses". */
export const haceCuanto = (fecha: string, hoy: Date = new Date()): string => {
  const dias = diasDesde(fecha, hoy);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 14) return `hace ${dias} días`;
  if (dias < 60) return `hace ${Math.round(dias / 7)} semanas`;
  const meses = Math.round(dias / 30);
  if (meses < 12) return `hace ${meses} meses`;
  const anios = Math.round(meses / 12);
  return anios === 1 ? "hace un año" : `hace ${anios} años`;
};

export interface Entrega {
  fecha: string;
  /** N.º de la entrega en el boletín: 1 la primera, sube con cada fecha. */
  numero: number;
  mejoras: Mejora[];
}

/** Fechas de entrega, de la más nueva a la más vieja. */
export const FECHAS_DE_ENTREGA: string[] = Array.from(
  new Set(MEJORAS.map((m) => m.fecha))
);

/** La fecha de la última entrega (la más nueva). */
export const ULTIMA_ENTREGA: string | undefined = FECHAS_DE_ENTREGA[0];

const NUMERO_DE_ENTREGA = new Map(
  FECHAS_DE_ENTREGA.map((fecha, i) => [fecha, FECHAS_DE_ENTREGA.length - i])
);

/**
 * Agrupa por fecha: cada día que llegó algo a producción es una entrega.
 * Mantiene el orden de la lista (la más nueva primero). El número sale de la
 * lista completa, así no cambia al filtrar.
 */
export const agruparPorFecha = (mejoras: Mejora[]): Entrega[] => {
  const entregas: Entrega[] = [];
  for (const mejora of mejoras) {
    const ultima = entregas[entregas.length - 1];
    if (ultima && ultima.fecha === mejora.fecha) ultima.mejoras.push(mejora);
    else
      entregas.push({
        fecha: mejora.fecha,
        numero: NUMERO_DE_ENTREGA.get(mejora.fecha) ?? 0,
        mejoras: [mejora],
      });
  }
  return entregas;
};

/**
 * Desde qué fecha algo es "nuevo para vos": lo posterior a la última entrega
 * que la persona vio. La primera vez (sin registro), sólo la última entrega.
 */
export const fechaDeCorte = (
  ultimaVista: string | null,
  fechas: string[] = FECHAS_DE_ENTREGA
): string => ultimaVista ?? fechas[1] ?? "";

export interface MesDelPulso {
  /** "2026-11" */
  clave: string;
  /** "nov" */
  etiqueta: string;
  /** "noviembre de 2026" */
  nombre: string;
  diasDelMes: number;
  entregas: { fecha: string; dia: number; cantidad: number }[];
  cambios: number;
}

/**
 * Meses desde la primera entrega hasta hoy (incluidos los meses sin
 * entregas), con las entregas de cada uno: lo que dibuja el pulso.
 */
export const pulso = (mejoras: Mejora[], hoy: Date = new Date()): MesDelPulso[] => {
  if (mejoras.length === 0) return [];
  const porFecha = new Map<string, number>();
  for (const m of mejoras) porFecha.set(m.fecha, (porFecha.get(m.fecha) ?? 0) + 1);
  const fechas = Array.from(porFecha.keys()).sort();
  const [y0, m0] = partes(fechas[0]);
  const [yU, mU] = partes(fechas[fechas.length - 1]);
  // Hasta el mes actual (o el de la última entrega, si fuera posterior).
  const indiceFin = Math.max(hoy.getFullYear() * 12 + hoy.getMonth(), yU * 12 + mU - 1);

  const meses: MesDelPulso[] = [];
  for (let indice = y0 * 12 + m0 - 1; indice <= indiceFin; indice++) {
    const y = Math.floor(indice / 12);
    const m = (indice % 12) + 1;
    const clave = `${y}-${String(m).padStart(2, "0")}`;
    const entregas = fechas
      .filter((f) => f.startsWith(clave))
      .map((f) => ({ fecha: f, dia: partes(f)[2], cantidad: porFecha.get(f) ?? 0 }));
    meses.push({
      clave,
      etiqueta: MESES[m - 1].slice(0, 3),
      nombre: `${MESES[m - 1]} de ${y}`,
      diasDelMes: new Date(y, m, 0).getDate(),
      entregas,
      cambios: entregas.reduce((total, e) => total + e.cantidad, 0),
    });
  }
  return meses;
};

/** Minúsculas y sin tildes, letra por letra (mantiene las posiciones). */
const normalizarLetra = (letra: string) =>
  letra.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase() || letra;

export const normalizar = (texto: string): string =>
  Array.from(texto).map(normalizarLetra).join("");

/** ¿La mejora contiene la búsqueda (sin importar tildes ni mayúsculas)? */
export const coincide = (mejora: Mejora, busqueda: string): boolean => {
  const q = normalizar(busqueda.trim());
  if (!q) return true;
  return [mejora.titulo, mejora.antes ?? "", mejora.ahora, mejora.area, mejora.tipo].some(
    (campo) => normalizar(campo).includes(q)
  );
};

/** Parte el texto en tramos, marcando los que coinciden con la búsqueda. */
export const resaltar = (
  texto: string,
  busqueda: string
): { texto: string; resaltado: boolean }[] => {
  const q = normalizar(busqueda.trim());
  if (!q) return [{ texto, resaltado: false }];
  const letras = Array.from(texto);
  const base = letras.map(normalizarLetra);
  const largo = Array.from(q).length;
  const tramos: { texto: string; resaltado: boolean }[] = [];
  let i = 0;
  let desde = 0;
  while (i <= letras.length - largo) {
    if (base.slice(i, i + largo).join("") === q) {
      if (i > desde) tramos.push({ texto: letras.slice(desde, i).join(""), resaltado: false });
      tramos.push({ texto: letras.slice(i, i + largo).join(""), resaltado: true });
      i += largo;
      desde = i;
    } else i++;
  }
  if (desde < letras.length) tramos.push({ texto: letras.slice(desde).join(""), resaltado: false });
  return tramos;
};
