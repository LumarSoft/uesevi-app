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
          La nómina conserva los valores declarados; los nombres de personas y categorías pueden reflejar cambios posteriores en sus registros.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><p className="text-sm text-muted-foreground">Subtotal</p><p className="text-xl font-bold">{moneda(statement.subtotal)}</p></div>
          <div><p className="text-sm text-muted-foreground">Interés registrado</p><p className="text-xl font-bold">{moneda(statement.interes)}</p></div>
          <div><p className="text-sm text-muted-foreground">Importe registrado</p><p className="text-xl font-bold">{moneda(statement.importe)}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}
