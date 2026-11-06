import { IConceptoSalarial } from "@/shared/types/Querys/IComposicionSalarial";

export const MESES = [
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

export const nombrePeriodo = (mes: number, year: number) =>
  `${MESES[mes - 1] ?? mes} ${year}`;

export const formatearMonto = (monto: number | null | undefined) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Number(monto) || 0);

export const formatearPorcentaje = (parte: number, total: number) =>
  total > 0
    ? `${new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format((parte / total) * 100)}%`
    : "0%";

export const calcularTotal = (conceptos: IConceptoSalarial[]) =>
  conceptos.reduce((acc, c) => acc + (Number(c.monto) || 0), 0);

// Colores por posición del concepto (el 1º siempre es azul, el 2º naranja, etc.),
// validados para daltonismo y contraste. `ink` es el color del texto cuando se
// escribe DENTRO del bloque de color.
export const PALETA_CONCEPTOS: { fill: string; ink: string }[] = [
  { fill: "#2a78d6", ink: "#ffffff" },
  { fill: "#eb6834", ink: "#ffffff" },
  { fill: "#1baf7a", ink: "#ffffff" },
  { fill: "#eda100", ink: "#0b0b0b" },
  { fill: "#e87ba4", ink: "#ffffff" },
  { fill: "#008300", ink: "#ffffff" },
  { fill: "#6250d6", ink: "#ffffff" },
  { fill: "#e34948", ink: "#ffffff" },
];

export const colorConcepto = (indice: number) =>
  PALETA_CONCEPTOS[indice % PALETA_CONCEPTOS.length];

export const MAX_CONCEPTOS = PALETA_CONCEPTOS.length;

// Lo que precarga el formulario del admin al crear un período nuevo.
export const CONCEPTOS_POR_DEFECTO: IConceptoSalarial[] = [
  { nombre: "Básico", monto: 0 },
  { nombre: "Presentismo", monto: 0 },
  { nombre: "Viáticos", monto: 0 },
  { nombre: "Suma no remunerativa", monto: 0 },
];
