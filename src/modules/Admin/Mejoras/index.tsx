"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AREAS,
  AreaMejora,
  Entrega,
  MEJORAS,
  Mejora,
  TipoMejora,
  agruparPorFecha,
  diasDesde,
  entregasPorMes,
  fechaLarga,
  mesYAnio,
} from "./mejoras";

// Un ícono y un color por tipo, en lugar de una fila de etiquetas por ítem.
const TIPO: Record<TipoMejora, { icono: LucideIcon; clase: string }> = {
  Nuevo: {
    icono: Sparkles,
    clase: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  Mejora: {
    icono: TrendingUp,
    clase: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  Corrección: {
    icono: Wrench,
    clase: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  Seguridad: {
    icono: ShieldCheck,
    clase: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};

type Filtro = "Todas" | AreaMejora;

const cambios = (n: number) => `${n} ${n === 1 ? "cambio" : "cambios"}`;

export default function MejorasModule() {
  const [filtro, setFiltro] = useState<Filtro>("Todas");

  const visibles = useMemo(
    () =>
      filtro === "Todas" ? MEJORAS : MEJORAS.filter((m) => m.area === filtro),
    [filtro]
  );

  // Sólo la última entrega del sistema va destacada. Si el filtro la deja
  // afuera, no se destaca ninguna: lo de más arriba ya no sería "lo último".
  const { destacada, meses } = useMemo(() => {
    const entregas = agruparPorFecha(visibles);
    const primera = entregas[0];
    const esLaUltima = primera && primera.fecha === MEJORAS[0]?.fecha;
    return {
      destacada: esLaUltima ? primera : null,
      meses: entregasPorMes(esLaUltima ? entregas.slice(1) : entregas),
    };
  }, [visibles]);

  const ultimos30 = MEJORAS.filter((m) => diasDesde(m.fecha) <= 30).length;
  const desde = MEJORAS[MEJORAS.length - 1]?.fecha;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Sparkles className="h-6 w-6 text-amber-500" aria-hidden />
          Mejoras del sistema
        </h2>
        <p className="text-muted-foreground">
          Lo que fuimos sumando y corrigiendo en el sitio, el portal de empresas
          y este panel.
        </p>
        {desde && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {cambios(MEJORAS.length)}
            </span>{" "}
            desde {mesYAnio(desde)} ·{" "}
            <span className="font-semibold text-foreground">{ultimos30}</span>{" "}
            en los últimos 30 días
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-8">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar por área"
        >
          {(["Todas", ...AREAS] as Filtro[]).map((opcion) => {
            const cantidad =
              opcion === "Todas"
                ? MEJORAS.length
                : MEJORAS.filter((m) => m.area === opcion).length;
            const activo = filtro === opcion;
            return (
              <button
                key={opcion}
                type="button"
                onClick={() => setFiltro(opcion)}
                aria-pressed={activo}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors",
                  activo
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {opcion}
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    activo ? "opacity-80" : "text-muted-foreground"
                  )}
                >
                  {cantidad}
                </span>
              </button>
            );
          })}
        </div>

        {destacada && <UltimaEntrega entrega={destacada} />}

        {meses.map((grupo) => (
          <section key={grupo.mes} aria-label={grupo.mes} className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {grupo.mes}
            </h3>
            <ol className="space-y-6 border-l pl-6">
              {grupo.entregas.map((entrega) => (
                <li key={entrega.fecha} className="relative space-y-3">
                  <span
                    aria-hidden
                    className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full border-2 border-background bg-muted-foreground/50"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    {fechaLarga(entrega.fecha, false)}
                  </p>
                  <ul className="space-y-4">
                    {entrega.mejoras.map((mejora) => (
                      <ItemMejora
                        key={`${mejora.fecha}-${mejora.titulo}`}
                        mejora={mejora}
                      />
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        ))}

        {visibles.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Todavía no hay mejoras registradas para esta área.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/** La entrega más reciente, en una tarjeta con borde: lo primero que se ve. */
function UltimaEntrega({ entrega }: { entrega: Entrega }) {
  return (
    <section
      aria-label="Lo último"
      className="rounded-xl border-2 border-primary/40 bg-primary/5 p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          Lo último
        </span>
        <h3 className="text-lg font-semibold">{fechaLarga(entrega.fecha)}</h3>
        <span className="text-sm text-muted-foreground">
          {cambios(entrega.mejoras.length)}
        </span>
      </div>
      <ul className="grid gap-x-10 gap-y-5 xl:grid-cols-2">
        {entrega.mejoras.map((mejora) => (
          <ItemMejora key={`${mejora.fecha}-${mejora.titulo}`} mejora={mejora} />
        ))}
      </ul>
    </section>
  );
}

function ItemMejora({ mejora }: { mejora: Mejora }) {
  const { icono: Icono, clase } = TIPO[mejora.tipo];
  return (
    <li className="flex gap-3">
      <span
        className={cn(
          "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          clase
        )}
        aria-hidden
      >
        <Icono className="h-4 w-4" />
      </span>
      <div className="min-w-0 space-y-1">
        <p className="font-semibold leading-snug">{mejora.titulo}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {mejora.detalle}
        </p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">{mejora.tipo}</span> · {mejora.area}
        </p>
      </div>
    </li>
  );
}
