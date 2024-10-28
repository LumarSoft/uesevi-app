import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

export function Total({
  statement,
  rate,
  basicSalary,
}: {
  statement: IInfoDeclaracion;
  rate: any;
  basicSalary: any;
}) {
  let totalFas = 0;
  let totalAporteSolidario = 0;
  let totalSindicato = 0;

  const employeeData = statement.empleados;

  employeeData.forEach((employee) => {
    const totalEmployee = employee.sueldo_basico + Number(employee.adicional);
    const fas = basicSalary * 0.01;
    const aporteSolidario =
      employee.afiliado === "No" ? totalEmployee * 0.02 : 0;
    const sindicato = employee.afiliado === "Sí" ? totalEmployee * 0.03 : 0;

    totalFas += fas;
    totalAporteSolidario += aporteSolidario;
    totalSindicato += sindicato;
  });

  const grandTotal = totalFas + totalAporteSolidario + totalSindicato;

  // Cálculo de los intereses
  const vencimiento = new Date(statement.vencimiento);
  const fechaActual = new Date();

  let intereses = 0;

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
            <p className="text-2xl font-bold">$ {totalFas.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Aporte Solidario
            </h3>
            <p className="text-2xl font-bold">
              $ {totalAporteSolidario.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sindicato
            </h3>
            <p className="text-2xl font-bold">$ {totalSindicato.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">TOTAL</h3>
            <p className="text-2xl font-bold text-primary">
              $ {grandTotal.toFixed(2)}
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
