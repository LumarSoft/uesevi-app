import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { resolverDesglose } from "@/shared/utils/desglose";

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

  // Desglose desde la tabla auxiliar (fuente de verdad, igual que el Panel de
  // Pagos); solo se recalcula para declaraciones legacy sin desglose guardado.
  const desglose = resolverDesglose(statement, basicSalary);

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

  // Calcular intereses solo si la declaración está vencida
  if (diffDays > 0) {
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    totalIntereses = (desglose.total * interes) / 100;
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
              {formatCurrency(desglose.fas)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Aporte Solidario
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(desglose.solidario)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sindicato
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(desglose.sindical)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">TOTAL</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(desglose.total)}
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
              {formatCurrency(desglose.total + totalIntereses)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
