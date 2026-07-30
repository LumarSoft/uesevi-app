import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { calcularAporteSolidarioPorPeriodo } from "@/shared/utils/aportes";

const FAS_PERCENTAGE = 0.01; // 1%
const SINDICATO_PERCENTAGE = 0.03; // 3%

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

export function Total({
  statement,
  rate,
  basicSalary,
}: {
  statement: IInfoDeclaracion;
  rate: any;
  basicSalary: any;
}) {
  const fechaPago = statement.fecha_pago;
  let totalIntereses = 0;
  const employeeData = statement.empleados;

  let totalFaz = basicSalary * FAS_PERCENTAGE * employeeData.length;

  let { totalAporteSolidario, totalSindicato } = employeeData.reduce(
    (acc, employee) => {
      const totalEmployee =
        Number(employee.monto) +
        Number(employee.adicional) +
        Number(employee.suma_no_remunerativa) +
        Number(employee.remunerativo_adicional);

      // Fórmula versionada por período (solo aplica en el fallback legacy sin
      // auxiliar; con snapshot se usan los valores de statement.desglose).
      const aporteSolidario = calcularAporteSolidarioPorPeriodo({
        esAfiliado: employee.afiliado !== "No",
        fechaCarga: statement.fecha_carga,
        sueldoBasicoCategoria: employee.sueldo_basico,
        presentismoCategoria: employee.presentismo,
        monto: employee.monto,
        sumaNoRemunerativa: employee.suma_no_remunerativa,
        remunerativoAdicional: employee.remunerativo_adicional,
      });

      const sindicato =
        employee.afiliado === "Sí" ? totalEmployee * SINDICATO_PERCENTAGE : 0;

      return {
        totalAporteSolidario: acc.totalAporteSolidario + aporteSolidario,
        totalSindicato: acc.totalSindicato + sindicato,
      };
    },
    { totalAporteSolidario: 0, totalSindicato: 0 }
  );

  const vencimiento = new Date(statement.vencimiento);
  let diffDays;

  if (fechaPago) {
    const pagoDate = new Date(fechaPago);
    diffDays = Math.floor(
      (pagoDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else {
    const hoyDate = new Date();
    diffDays = Math.floor(
      (hoyDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // --- Desglose por concepto ---
  // Preferimos el snapshot CONGELADO (statement.desglose, tabla auxiliar): es lo
  // que realmente se declaró al cargar y coincide exactamente con el Panel de
  // Pagos. No se recalcula, así los valores no cambian aunque después cambien
  // los básicos de categoría o la fórmula del aporte. Solo si no existe snapshot
  // (declaración legacy sin auxiliar) recaemos en el recálculo en vivo + ajuste
  // proporcional para cuadrar el total contra el subtotal guardado.
  let totalFazAjustado: number;
  let totalAporteSolidarioAjustado: number;
  let totalSindicatoAjustado: number;

  if (statement.desglose) {
    totalFazAjustado = Number(statement.desglose.fas) || 0;
    totalAporteSolidarioAjustado = Number(statement.desglose.solidario) || 0;
    totalSindicatoAjustado = Number(statement.desglose.sindical) || 0;
  } else {
    const grandTotal = totalFaz + totalAporteSolidario + totalSindicato;
    const importeDeclaracion = Number(statement.subtotal);
    const ajuste = importeDeclaracion - grandTotal;
    const base = grandTotal || 1; // evita división por cero
    totalFazAjustado = totalFaz + ajuste * (totalFaz / base);
    totalAporteSolidarioAjustado =
      totalAporteSolidario + ajuste * (totalAporteSolidario / base);
    totalSindicatoAjustado =
      totalSindicato + ajuste * (totalSindicato / base);
  }

  const grandTotalAjustado =
    totalFazAjustado + totalAporteSolidarioAjustado + totalSindicatoAjustado;

  // Calcular intereses solo si la declaración está vencida
  if (diffDays > 0) {
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    totalIntereses = (grandTotalAjustado * interes) / 100;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid 2xl:grid-cols-6 grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">FAS</h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalFazAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Aporte Solidario
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalAporteSolidarioAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sindicato
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalSindicatoAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">TOTAL</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(grandTotalAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Intereses
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalIntereses)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total a pagar
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(grandTotalAjustado + totalIntereses)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
