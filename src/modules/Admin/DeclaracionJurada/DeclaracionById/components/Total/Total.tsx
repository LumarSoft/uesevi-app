import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

export function Total({ statement }: { statement: IInfoDeclaracion }) {

  let totalFas = 0;
  let totalAporteSolidario = 0;
  let totalSindicato = 0;

  const employeeData = statement.empleados;

  employeeData.forEach((employee) => {
    const totalEmployee = employee.sueldo_basico + Number(employee.adicional);
    const fas = totalEmployee * 0.01;
    const aporteSolidario =
      employee.afiliado === "No" ? totalEmployee * 0.02 : 0;
    const sindicato = employee.afiliado === "Sí" ? totalEmployee * 0.03 : 0;

    totalFas += fas;
    totalAporteSolidario += aporteSolidario;
    totalSindicato += sindicato;
  });

  const grandTotal = totalFas + totalAporteSolidario + totalSindicato;
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
