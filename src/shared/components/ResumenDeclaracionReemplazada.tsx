import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

const moneda = (importe: number | null) =>
  importe === null
    ? "Sin dato guardado"
    : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(importe));

export function ResumenDeclaracionReemplazada({ statement }: { statement: IInfoDeclaracion }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Importes de esta versión</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Esta declaración fue reemplazada. Los importes que siguen son los guardados al presentarla, no un saldo a pagar hoy.
          La nómina conserva los importes declarados y la afiliación registrada cuando consta. Nombres, CUIL y etiquetas de categoría se consultan del padrón actual y pueden reflejar cambios posteriores.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><p className="text-sm text-muted-foreground">Subtotal</p><p className="text-xl font-bold">{moneda(statement.subtotal)}</p></div>
          <div><p className="text-sm text-muted-foreground">Interés registrado</p><p className="text-xl font-bold">{moneda(statement.interes)}</p></div>
          <div><p className="text-sm text-muted-foreground">Importe registrado</p><p className="text-xl font-bold">{moneda(statement.importe)}</p></div>
        </div>
        {statement.desglose ? (
          <div className="mt-6">
            <h3 className="mb-3 font-semibold">Desglose guardado en auxiliar</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div><p className="text-sm text-muted-foreground">FAS</p><p className="text-lg font-semibold">{moneda(statement.desglose.fas)}</p></div>
              <div><p className="text-sm text-muted-foreground">Aporte solidario</p><p className="text-lg font-semibold">{moneda(statement.desglose.solidario)}</p></div>
              <div><p className="text-sm text-muted-foreground">Aporte sindical</p><p className="text-lg font-semibold">{moneda(statement.desglose.sindical)}</p></div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">El desglose está redondeado; el subtotal de la declaración conserva el valor con centavos.</p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            Esta versión no tiene desglose guardado en auxiliar. Se muestran los datos individuales disponibles y los importes registrados; no se reconstruyen aportes históricos que no quedaron almacenados.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
