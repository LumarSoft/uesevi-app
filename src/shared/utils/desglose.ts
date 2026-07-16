import { Empleado, IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { calcularAporteSolidario } from "@/shared/utils/aportes";

export const FAS_PERCENTAGE = 0.01; // 1%
export const SINDICATO_PERCENTAGE = 0.03; // 3%

export interface Desglose {
  fas: number;
  solidario: number;
  sindical: number;
  total: number;
  /** "auxiliar" = desglose persistido al presentar la DDJJ; "recalculo" = fallback legacy */
  fuente: "auxiliar" | "recalculo";
}

/**
 * Resuelve el desglose (FAS / Aporte Solidario / Sindicato) de una declaración.
 *
 * Fuente de verdad: la tabla `auxiliar`, que guarda el desglose EXACTO calculado
 * al presentar/rectificar la DDJJ (la misma fuente que usa el Panel de Pagos).
 *
 * Solo para declaraciones legacy sin fila en `auxiliar` se recalcula desde los
 * empleados y se reparte proporcionalmente la diferencia contra el subtotal.
 * Ese recálculo usa datos que pueden derivar (afiliación, categorías), por eso
 * dejó de ser el camino principal.
 */
export function resolverDesglose(
  statement: IInfoDeclaracion,
  basicSalary: number | string
): Desglose {
  const auxFas = statement.desglose_fas;
  const auxSolidario = statement.desglose_solidario;
  const auxSindical = statement.desglose_sindical;

  if (auxFas != null || auxSolidario != null || auxSindical != null) {
    const fas = Number(auxFas) || 0;
    const solidario = Number(auxSolidario) || 0;
    const sindical = Number(auxSindical) || 0;
    return {
      fas,
      solidario,
      sindical,
      total: fas + solidario + sindical,
      fuente: "auxiliar",
    };
  }

  return recalcularDesglose(statement, basicSalary);
}

function recalcularDesglose(
  statement: IInfoDeclaracion,
  basicSalary: number | string
): Desglose {
  const empleados: Empleado[] = statement.empleados || [];

  const totalFaz = Number(basicSalary) * FAS_PERCENTAGE * empleados.length;

  const { totalAporteSolidario, totalSindicato } = empleados.reduce(
    (acc, employee) => {
      const totalEmployee =
        Number(employee.monto) +
        Number(employee.adicional) +
        Number(employee.suma_no_remunerativa || 0) +
        Number(employee.remunerativo_adicional);

      // Aporte solidario: 2% del sueldo básico de la categoría (no del sueldo real).
      const aporteSolidario = calcularAporteSolidario(
        employee.afiliado !== "No",
        employee.sueldo_basico
      );

      const sindicato =
        employee.afiliado === "Sí" ? totalEmployee * SINDICATO_PERCENTAGE : 0;

      return {
        totalAporteSolidario: acc.totalAporteSolidario + aporteSolidario,
        totalSindicato: acc.totalSindicato + sindicato,
      };
    },
    { totalAporteSolidario: 0, totalSindicato: 0 }
  );

  const grandTotal = totalFaz + totalAporteSolidario + totalSindicato;

  // Repartimos la diferencia contra el subtotal guardado para que el desglose
  // cierre con lo que la DDJJ registró como total.
  const ajuste = Number(statement.subtotal) - grandTotal;
  const factor = grandTotal > 0 ? 1 + ajuste / grandTotal : 1;

  const fas = totalFaz * factor;
  const solidario = totalAporteSolidario * factor;
  const sindical = totalSindicato * factor;

  return {
    fas,
    solidario,
    sindical,
    total: fas + solidario + sindical,
    fuente: "recalculo",
  };
}
