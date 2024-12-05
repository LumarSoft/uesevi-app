import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

const FAS_PERCENTAGE = 0.01; // 1%
const APORTE_SOLIDARIO_PERCENTAGE = 0.02; // 2%
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
      const totalEmployee = Number(employee.monto) + Number(employee.adicional);

      const aporteSolidario =
        employee.afiliado === "No"
          ? Number(employee.monto) * APORTE_SOLIDARIO_PERCENTAGE
          : 0;

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

  if (statement.ajuste) {
    let divisorAjuste = statement.ajuste / 3;

    totalFaz = totalFaz + divisorAjuste;

    totalAporteSolidario = totalAporteSolidario + divisorAjuste;

    totalSindicato = totalSindicato + divisorAjuste;
  }

  const grandTotal = totalFaz + totalAporteSolidario + totalSindicato;
  // Calcular intereses solo si la declaración está vencida
  if (diffDays > 0) {
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    totalIntereses = (grandTotal * interes) / 100;
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
            <p className="text-2xl font-bold">{formatCurrency(totalFaz)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Aporte Solidario
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalAporteSolidario)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sindicato
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalSindicato)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">TOTAL</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(grandTotal)}
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
              {formatCurrency(grandTotal + totalIntereses)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
