// Contratos TypeScript del Panel de Pagos de Empresas.
// Alineados con los endpoints /payments-panel del backend.
// Ver docs/Uesevi_Evolutivo_Panel_de_Pagos_PLAN_TECNICO.md (Secciones 3 y 4).

export type EstadoMes = "Pagado" | "Pendiente" | "Sin DDJJ";

/** Desglose por concepto usado en tarjetas y celdas. */
export interface Desglose {
  fas: number;
  solidario: number;
  sindical: number;
  total: number;
}

/** Una celda de mes dentro de la grilla multi-mes. */
export interface MesCelda {
  mes: number; // 1-12
  monto: number;
  fecha_pago: string | null; // ISO / editable manual
  estado: EstadoMes;
  declaracion_jurada_id: number | null;
  // Desglose para el colapsable por celda.
  fas: number;
  solidario: number;
  sindical: number;
  intereses: number;
}

/** Una fila (empresa) de la grilla principal. */
export interface GridRow {
  empresa_id: number;
  nombre: string;
  cuit: string;
  estado_empresa: "Activo" | "Inactivo" | "Pendiente";
  meses: MesCelda[];
  total_anio: number;
  meses_pendientes: number; // 0 => "Al día"; N => "+N"
}

/** GET /payments-panel/summary — tarjetas de resumen (doble total). */
export interface SummaryResponse {
  cobrado_mes: Desglose; // se reinicia al cambiar de mes
  acumulado_anio: Desglose; // fijo, acumulado del año
  empresas_pendientes: { pendientes: number; total: number }; // "X de Y"
}

/** Fila del historial en el detalle de empresa. */
export interface HistorialRow {
  mes: number;
  importe_total: number;
  fas: number;
  solidario: number;
  sindical: number;
  intereses: number;
  fecha_pago: string | null;
  estado: EstadoMes;
  declaracion_jurada_id: number | null;
}

/** GET /payments-panel/company/:idCompany — detalle. */
export interface CompanyDetailResponse {
  header: {
    nombre: string;
    cuit: string;
    total_pagado_anio: number;
    totales: { fas: number; solidario: number; sindical: number; intereses: number };
    meses_pendientes: number;
  };
  historial: HistorialRow[];
}

/** GET /payments-panel/proposal/... — datos para confirmar pago. */
export interface ProposalResponse {
  declaracion_jurada_id: number | null;
  fas: number;
  solidario: number;
  sindical: number;
  subtotal: number;
  estado: EstadoMes;
}

/** POST /payments-panel/interest/preview. */
export interface InterestPreview {
  diasAtraso: number;
  interes: number;
  importe: number;
}

/** Fila del modal de gestión de empresas (activar/desactivar). */
export interface CompanyManagementRow {
  id: number;
  nombre: string;
  cuit: string;
  estado: "Activo" | "Inactivo" | "Pendiente";
  adeudadas: number; // declaraciones adeudadas en los últimos 12 meses
}

/** Payload de PUT /payments-panel/payment (upsert override). */
export interface UpsertPaymentPayload {
  declaracion_jurada_id: number;
  fecha_pago: string;
  importe_fas?: number;
  importe_solidario?: number;
  importe_sindical?: number;
  importe_intereses?: number;
  observaciones?: string;
  usuario_carga: number;
}
