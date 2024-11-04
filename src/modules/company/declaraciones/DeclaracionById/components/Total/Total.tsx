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
  let intereses = 0;
  const employeeData = statement.empleados;

  const totalFaz = basicSalary * FAS_PERCENTAGE * employeeData.length;

  const { totalAporteSolidario, totalSindicato } = employeeData.reduce(
    (acc, employee) => {
      const totalEmployee = employee.sueldo_basico + Number(employee.adicional);

      const aporteSolidario =
        employee.afiliado === "No"
          ? employee.sueldo_basico * APORTE_SOLIDARIO_PERCENTAGE
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

  const grandTotal = totalFaz + totalAporteSolidario + totalSindicato;

  // Declare and initialize the variable 'fechaActual'
  const fechaActual = new Date();
  const vencimiento = new Date(statement.vencimiento);

  // Solo calculamos intereses si la fecha actual es posterior a la fecha de vencimiento
  if (fechaActual > vencimiento) {
    // Diferencia de días entre la fecha de vencimiento y la fecha actual
    const diffTime = Math.abs(fechaActual.getTime() - vencimiento.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Cálculo de los intereses: total base multiplicado por la tasa de interés y la cantidad de días
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    intereses = (grandTotal * interes) / 1000;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
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
              INTERESES
            </h3>
            <p className="text-2xl font-bold text-primary">
              $ {intereses.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
