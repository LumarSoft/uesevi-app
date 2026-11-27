// Registro de mejoras del sistema que ve el personal de UESEVI en el panel
// (Admin → Mejoras).
//
// CÓMO AGREGAR UNA: sumar un objeto ARRIBA DE TODO (el más nuevo primero) en el
// mismo PR que trae el cambio, con la fecha en que llega a producción. Textos
// para quien usa el sistema, no para programadores: qué cambia para la persona,
// sin nombres de archivos ni de tablas. `detalle` se muestra bajo "Qué cambia";
// `dondeVerlo` (opcional) son los pasos para encontrarlo, bajo "Dónde verlo":
// poner sólo los que se sepa con certeza. test/mejoras.test.mjs controla el
// formato y el orden.
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
  detalle: string;
  /** Pasos para encontrar el cambio en el sistema. */
  dondeVerlo?: string[];
  area: AreaMejora;
  tipo: TipoMejora;
}

export const MEJORAS: Mejora[] = [
  {
    fecha: "2026-11-27",
    titulo: "Nueva sección \"Mejoras\" en el panel",
    detalle:
      "Esta misma página: reúne todo lo que vamos sumando y corrigiendo en el sistema, de lo más nuevo a lo más viejo. La primera vez que se entra al panel, una presentación corta la muestra y explica cómo leerla.",
    dondeVerlo: [
      "Menú del panel → Mejoras (el cohete), la última opción.",
      "\"Filtrar\" deja ver un área o un tipo de cambio; los filtros aplicados quedan a la vista y se quitan de a uno.",
      "Para volver a ver la presentación: \"Ver presentación\", arriba a la derecha de la página.",
    ],
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-11-27",
    titulo: "Propuestas: contanos qué te gustaría mejorar",
    detalle:
      "En Mejoras, la pestaña \"Propuestas\" permite sugerir cambios para el sistema. Todas quedan a la vista del equipo, con su estado (Recibida, En curso, Hecha) y la respuesta del equipo de desarrollo.",
    dondeVerlo: [
      "Mejoras → pestaña Propuestas: escribí un título y contanos tu idea.",
      "Debajo están todas las propuestas, con su estado y nuestra respuesta.",
    ],
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-11-27",
    titulo: "Panel de Pagos: \"Al día\" sólo si la empresa presentó y pagó",
    detalle:
      "Una empresa que dejó de presentar la declaración jurada aparecía \"Al día\". Ahora se muestran aparte los meses vencidos sin DDJJ (por ejemplo, \"2 sin DDJJ\" en amarillo), y el filtro suma la opción \"Sin DDJJ\". Se cuentan desde el primer mes que la empresa declaró.",
    dondeVerlo: [
      "Panel de Pagos → columna \"Pend.\": el cartel amarillo \"N sin DDJJ\".",
      "En el filtro de estado, la opción \"Sin DDJJ\" deja sólo esas empresas.",
      "En el detalle de cada empresa, la tarjeta \"Meses pendientes\".",
    ],
    area: "Panel admin",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "Las DDJJ aprobadas ya no suman intereses día a día",
    detalle:
      "Si una declaración aprobada no tenía fecha de pago cargada, el \"Total a pagar\" seguía creciendo todos los días, en pantalla y en el PDF. Ahora queda fijo. Con fecha de pago, el interés se calcula hasta esa fecha, igual que siempre.",
    dondeVerlo: [
      "Declaraciones juradas → una aprobada sin fecha de pago: \"Intereses\" queda en $ 0.",
      "El PDF de la declaración muestra el mismo total.",
    ],
    area: "Todo el sistema",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "Cuántos días faltan para el vencimiento",
    detalle:
      "Una DDJJ recién presentada mostraba \"Vencida: 0 días\" en rojo. Ahora dice \"Faltan 12 días\", \"Vence mañana\" o \"Vence hoy\", y el rojo queda sólo para las vencidas.",
    dondeVerlo: [
      "Al abrir una declaración que todavía no venció, al lado de la fecha de vencimiento. Se ve igual en el panel y en el portal de empresas.",
    ],
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "El menú del celular del portal muestra las opciones de la empresa",
    detalle:
      "Desde el celular, el menú del portal mostraba las opciones del panel de UESEVI y al tocar cualquiera se cerraba la sesión. Ahora muestra Declaración jurada, Historial, Mis empleados, Mi cuenta e Instructivo.",
    dondeVerlo: [
      "Portal de empresas desde el celular → botón de menú, arriba a la izquierda.",
    ],
    area: "Portal de empresas",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-27",
    titulo: "El ingreso explica qué pasó",
    detalle:
      "Con la contraseña mal, la pantalla de ingreso se recargaba y borraba el email. Ahora queda todo escrito y dice \"Contraseña incorrecta\" o \"El correo electrónico no existe\". Si la sesión venció, lo avisa al volver a ingresar.",
    dondeVerlo: [
      "Ingreso de empresas o del panel, escribiendo mal la contraseña.",
      "Al volver a entrar después de que la sesión venció (dura una hora).",
    ],
    area: "Todo el sistema",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Inicio, Noticias y Escalas cargan más rápido",
    detalle:
      "La página de inicio ya no espera a las noticias para mostrarse, y Noticias y Escalas dejaron de esperar un segundo y medio de más.",
    dondeVerlo: [
      "uesevi.org.ar → Inicio, Noticias y Escalas salariales.",
    ],
    area: "Sitio público",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Vista previa al compartir por WhatsApp",
    detalle:
      "Al compartir el sitio aparece el logo de UESEVI, y al compartir una noticia, su título y su foto. Cada página tiene además su propio título en la pestaña del navegador.",
    dondeVerlo: [
      "Compartí uesevi.org.ar o una noticia por WhatsApp y mirá la vista previa antes de enviar.",
    ],
    area: "Sitio público",
    tipo: "Mejora",
  },
  {
    fecha: "2026-11-27",
    titulo: "Las contraseñas dejaron de quedar a la vista en el navegador",
    detalle:
      "Los formularios dejaban registradas en la consola del navegador las contraseñas que se escribían y datos de las declaraciones, como los CUIL. Ya no queda nada de eso.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-26",
    titulo: "Pasar de página en Noticias ya no da error",
    detalle:
      "El botón \"Anterior\" de la primera página llevaba a una página inexistente. Ahora \"Anterior\" y \"Siguiente\" aparecen sólo cuando hay adónde ir.",
    area: "Sitio público",
    tipo: "Corrección",
  },
  {
    fecha: "2026-11-26",
    titulo: "Los errores ya no muestran detalles internos",
    detalle:
      "Cuando algo falla, el sistema muestra un mensaje claro y guarda el detalle técnico sólo para nosotros.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-24",
    titulo: "Listado de afiliados con buscador",
    detalle:
      "Desde la tarjeta de afiliados del dashboard se abre el listado completo, con búsqueda por nombre, DNI o CUIL.",
    dondeVerlo: [
      "Dashboard → tarjeta \"Afiliados al día de la fecha\".",
    ],
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-11-17",
    titulo: "La ficha de afiliación se carga desde el panel",
    detalle:
      "Dejó de ser un formulario abierto en el sitio: ahora la carga el personal de UESEVI desde el panel.",
    dondeVerlo: [
      "Menú del panel → Usuarios → Fichas de afiliación.",
    ],
    area: "Panel admin",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-15",
    titulo: "Accesos públicos cerrados y aviso del día 15 más confiable",
    detalle:
      "Se cerraron accesos al sistema que no necesitaban estar abiertos. El aviso mensual a las empresas se envía de a tandas y reintenta los correos rechazados.",
    area: "Todo el sistema",
    tipo: "Seguridad",
  },
  {
    fecha: "2026-11-06",
    titulo: "\"Salario del mes\" en la página de inicio",
    detalle:
      "Los afiliados ven cómo se compone el salario vigente. El panel suma la sección \"Composición salarial\" para cargarlo cada mes.",
    dondeVerlo: [
      "uesevi.org.ar → sección \"Salario del mes\" en el inicio.",
      "Para cargarlo: menú del panel → Composición salarial.",
    ],
    area: "Sitio público",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-10-13",
    titulo: "\"Mi cuenta\" para las empresas",
    detalle:
      "Cada empresa puede cambiar por su cuenta el email de acceso y la contraseña.",
    dondeVerlo: [
      "Portal de empresas → Mi cuenta.",
    ],
    area: "Portal de empresas",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-08-18",
    titulo: "El Excel de la DDJJ se revisa antes de cargarlo",
    detalle:
      "Si el archivo tiene errores, el portal dice en qué fila está cada uno y qué corregir, antes de enviarlo.",
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-08-12",
    titulo: "Panel de Pagos: vista por fecha de cobro",
    detalle:
      "Además de la vista por período, el panel puede mostrar lo cobrado según el mes en que entró la plata.",
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-07-31",
    titulo: "El aporte solidario incluye el presentismo",
    detalle:
      "Cada categoría tiene su presentismo, y el aporte solidario lo tiene en cuenta al cargar la DDJJ.",
    area: "Todo el sistema",
    tipo: "Mejora",
  },
  {
    fecha: "2026-07-20",
    titulo: "Una DDJJ por mes",
    detalle:
      "El sistema no deja cargar dos veces la declaración del mismo mes. Para corregirla se usa \"Rectificar\".",
    area: "Portal de empresas",
    tipo: "Mejora",
  },
  {
    fecha: "2026-07-14",
    titulo: "Panel de Pagos",
    detalle:
      "Seguimiento mes a mes de lo que pagó cada empresa, con confirmación de pagos, desglose por concepto y totales del año.",
    dondeVerlo: [
      "Menú del panel → Panel de Pagos.",
    ],
    area: "Panel admin",
    tipo: "Nuevo",
  },
  {
    fecha: "2026-06-24",
    titulo: "Plantilla del Excel para descargar",
    detalle:
      "Las empresas descargan la planilla de la DDJJ con las columnas correctas y un desplegable con las categorías vigentes.",
    area: "Portal de empresas",
    tipo: "Nuevo",
  },
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** "2026-11-27" → fecha local (sin corrimiento por zona horaria). */
export const fechaLocal = (fecha: string): Date => {
  const [y, m, d] = fecha.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** "2026-11-27" → "27/11". */
export const diaYMes = (fecha: string): string => {
  const [, m, d] = fecha.split("-");
  return `${d}/${m}`;
};

/** Días entre la fecha de la mejora y hoy (0 = hoy). */
export const diasDesde = (fecha: string, hoy: Date = new Date()): number => {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  return Math.round(
    (inicioHoy.getTime() - fechaLocal(fecha).getTime()) / (1000 * 60 * 60 * 24)
  );
};

/** "2026-11-27" → "27 de noviembre de 2026" (o sin el año). */
export const fechaLarga = (fecha: string, conAnio = true): string => {
  const [y, m, d] = fecha.split("-").map(Number);
  const texto = `${d} de ${MESES[m - 1].toLowerCase()}`;
  return conAnio ? `${texto} de ${y}` : texto;
};

/** "2026-06-24" → "junio de 2026". */
export const mesYAnio = (fecha: string): string => {
  const [y, m] = fecha.split("-").map(Number);
  return `${MESES[m - 1].toLowerCase()} de ${y}`;
};

export interface Entrega {
  fecha: string;
  mejoras: Mejora[];
}

/**
 * Agrupa por fecha: cada día que llegó algo a producción es una "entrega".
 * Mantiene el orden de la lista (la más nueva primero).
 */
export const agruparPorFecha = (mejoras: Mejora[]): Entrega[] => {
  const entregas: Entrega[] = [];
  for (const mejora of mejoras) {
    const ultima = entregas[entregas.length - 1];
    if (ultima && ultima.fecha === mejora.fecha) ultima.mejoras.push(mejora);
    else entregas.push({ fecha: mejora.fecha, mejoras: [mejora] });
  }
  return entregas;
};

const MESES_CORTOS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

/** "2026-11-27" → "27 nov 2026". */
export const fechaCorta = (fecha: string): string => {
  const [y, m, d] = fecha.split("-").map(Number);
  return `${d} ${MESES_CORTOS[m - 1]} ${y}`;
};
