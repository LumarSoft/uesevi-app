// Helpers del Panel de Pagos.

export const formatCurrency = (amount: number | null | undefined): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export const MESES_CORTOS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const MESES_LARGOS = [
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

export const mesCorto = (mes: number) => MESES_CORTOS[mes - 1] ?? String(mes);
export const mesLargo = (mes: number) => MESES_LARGOS[mes - 1] ?? String(mes);

// Mes anterior (mes vencido). Enero (1) -> Diciembre (12).
export const mesAnterior = (mes: number) => (mes === 1 ? 12 : mes - 1);

// Etiqueta "mes vencido" para el select: "Julio (Junio)".
export const mesConVencido = (mes: number) =>
  `${mesLargo(mes)} (${mesLargo(mesAnterior(mes))})`;

// Fecha ISO -> dd/mm/aa
export const formatFecha = (fecha: string | null | undefined): string => {
  if (!fecha) return "—";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export const AÑOS_DISPONIBLES = (() => {
  const actual = new Date().getFullYear();
  const arr: number[] = [];
  for (let y = actual; y >= actual - 5; y--) arr.push(y);
  return arr;
})();
