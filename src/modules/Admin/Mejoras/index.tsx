"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AREAS,
  AreaMejora,
  DIAS_RECIENTE,
  MEJORAS,
  TipoMejora,
  agruparPorMes,
  diaYMes,
  diasDesde,
} from "./mejoras";

const COLOR_TIPO: Record<TipoMejora, string> = {
  Nuevo:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  Mejora: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  Corrección:
    "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  Seguridad:
    "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
};

type Filtro = "Todas" | AreaMejora;

export default function MejorasModule() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");

  const visibles = useMemo(
    () =>
      filtro === "Todas" ? MEJORAS : MEJORAS.filter((m) => m.area === filtro),
    [filtro]
  );
  const grupos = useMemo(() => agruparPorMes(visibles), [visibles]);

  const ultimos30 = MEJORAS.filter((m) => diasDesde(m.fecha) <= 30).length;
  const ultima = MEJORAS[0]?.fecha;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Mejoras del sistema
        </CardTitle>
        <CardDescription>
          Lo que fuimos sumando y corrigiendo en el sitio, el portal de empresas
          y este panel, de lo más nuevo a lo más viejo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Resumen valor={ultimos30} texto="en los últimos 30 días" />
          <Resumen valor={MEJORAS.length} texto="en total" />
          <Resumen valor={ultima ? diaYMes(ultima) : "—"} texto="la más reciente" />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
          {(["Todas", ...AREAS] as Filtro[]).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setFiltro(opcion)}
              aria-pressed={filtro === opcion}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                filtro === opcion
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              {opcion}
            </button>
          ))}
        </div>

        {grupos.map((grupo) => (
          <section key={grupo.mes} aria-label={grupo.mes}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {grupo.mes}
            </h3>
            <ol className="relative space-y-4 border-l pl-6">
              {grupo.mejoras.map((mejora) => (
                <li key={`${mejora.fecha}-${mejora.titulo}`} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {diaYMes(mejora.fecha)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        COLOR_TIPO[mejora.tipo]
                      )}
                    >
                      {mejora.tipo}
                    </span>
                    <Badge variant="outline" className="font-normal">
                      {mejora.area}
                    </Badge>
                    {diasDesde(mejora.fecha) <= DIAS_RECIENTE && (
                      <Badge className="bg-primary">Reciente</Badge>
                    )}
                  </div>
                  <p className="mt-1 font-semibold">{mejora.titulo}</p>
                  <p className="text-sm text-muted-foreground">{mejora.detalle}</p>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {grupos.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay mejoras registradas para esta área.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Resumen({ valor, texto }: { valor: number | string; texto: string }) {
  return (
    <div className="rounded-lg border p-3 sm:p-4">
      <p className="text-2xl font-bold tabular-nums sm:text-3xl">{valor}</p>
      <p className="text-xs text-muted-foreground sm:text-sm">{texto}</p>
    </div>
  );
}
