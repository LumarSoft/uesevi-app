"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { useComposicionSalarial } from "@/shared/hooks/useComposicionSalarial";
import { IComposicionSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import {
  colorConcepto,
  formatearMonto,
  formatearPorcentaje,
  nombrePeriodo,
} from "@/shared/utils/composicionSalarial";
import { BarraComposicion } from "./BarraComposicion";

const clavePeriodo = (c: { year: number; mes: number }) =>
  `${c.year}-${String(c.mes).padStart(2, "0")}`;

// Sección pública "Salario del mes": el salario de referencia vigente y cómo se
// compone, con navegación a los meses anteriores que estén publicados.
const SalarioDelMes = () => {
  const { composiciones, loading } = useComposicionSalarial();
  const [indicePeriodo, setIndicePeriodo] = useState(0);
  const [categoriaElegida, setCategoriaElegida] = useState<string | null>(null);
  const [activo, setActivo] = useState<number | null>(null);

  // Períodos únicos, del más reciente al más viejo (la API ya ordena así).
  const periodos = useMemo(() => {
    const vistos = new Map<string, { year: number; mes: number }>();
    composiciones.forEach((c) => {
      const clave = clavePeriodo(c);
      if (!vistos.has(clave)) vistos.set(clave, { year: c.year, mes: c.mes });
    });
    return Array.from(vistos.values());
  }, [composiciones]);

  const periodo = periodos[indicePeriodo] ?? periodos[0];

  const categoriasDelPeriodo = useMemo(
    () =>
      periodo
        ? composiciones.filter(
            (c) => c.year === periodo.year && c.mes === periodo.mes
          )
        : [],
    [composiciones, periodo]
  );

  const composicion: IComposicionSalarial | undefined =
    categoriasDelPeriodo.find((c) => c.categoria === categoriaElegida) ??
    categoriasDelPeriodo[0];

  if (loading) {
    return (
      <section className="w-full px-4 md:px-28 2xl:px-80 py-20">
        <Skeleton className="h-72 w-full rounded-xl" />
      </section>
    );
  }

  // Hasta que el gremio cargue el primer período, la sección no se muestra.
  if (!composicion || !periodo) return null;

  const conceptos = composicion.conceptos.filter((c) => Number(c.monto) > 0);
  const total = composicion.total;
  const hayAnterior = indicePeriodo < periodos.length - 1;
  const haySiguiente = indicePeriodo > 0;
  const esElUltimo = indicePeriodo === 0;

  const cambiarPeriodo = (delta: number) => {
    setIndicePeriodo((i) => Math.min(periodos.length - 1, Math.max(0, i + delta)));
    setActivo(null);
  };

  return (
    <section id="salario-del-mes" className="w-full bg-muted/50 scroll-mt-20">
      <FramerComponent
        style="w-full px-4 md:px-28 2xl:px-80 mx-auto py-20"
        animationInitial={{ opacity: 0, y: 50 }}
        animationWhileInView={{ opacity: 1, y: 0 }}
        animationTransition={{ duration: 0.4, delay: 0.1 }}
        animationViewPort={{ once: true, offset: 0.3 }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-primary">
              <Wallet className="h-4 w-4" />
              Salario del mes
            </p>
            <h2 className="mt-1 text-3xl font-bold text-primary">
              ¿Cómo se compone tu salario?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Salario de referencia que publica el gremio cada mes, detallado
              concepto por concepto.
            </p>
          </div>

          {/* Navegación entre meses publicados */}
          <div className="flex items-center gap-1 self-start md:self-auto">
            <Button
              variant="outline"
              size="icon"
              aria-label="Mes anterior"
              disabled={!hayAnterior}
              onClick={() => cambiarPeriodo(1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[10rem] text-center font-semibold">
              {nombrePeriodo(periodo.mes, periodo.year)}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Mes siguiente"
              disabled={!haySiguiente}
              onClick={() => cambiarPeriodo(-1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1.4fr_1fr]">
            {/* Columna principal: total + barra */}
            <div className="flex flex-col justify-center gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>Total de referencia</span>
                  <span aria-hidden>·</span>
                  <span>{nombrePeriodo(composicion.mes, composicion.year)}</span>
                  {esElUltimo && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      Vigente
                    </span>
                  )}
                </div>
                <p className="mt-1 text-5xl font-semibold leading-none tracking-tight md:text-6xl">
                  {formatearMonto(total)}
                </p>

                {categoriasDelPeriodo.length > 1 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categoriasDelPeriodo.map((c) => {
                      const elegida = c.id === composicion.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCategoriaElegida(c.categoria);
                            setActivo(null);
                          }}
                          className={`rounded-full border px-3 py-1 text-sm transition ${
                            elegida
                              ? "border-primary bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          {c.categoria}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {composicion.categoria}
                  </p>
                )}
              </div>

              <BarraComposicion
                conceptos={conceptos}
                total={total}
                activo={activo}
                onActivo={setActivo}
              />

              {composicion.nota && (
                <p className="text-sm text-muted-foreground">{composicion.nota}</p>
              )}
            </div>

            {/* Referencias: nombre, monto y porcentaje de cada concepto */}
            <div className="flex flex-col justify-center">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Referencias
              </h3>
              <ul className="divide-y">
                {conceptos.map((concepto, i) => {
                  const { fill } = colorConcepto(i);
                  const resaltado = activo === i;
                  const atenuado = activo !== null && !resaltado;
                  return (
                    <li
                      key={`${concepto.nombre}-${i}`}
                      onMouseEnter={() => setActivo(i)}
                      onMouseLeave={() => setActivo(null)}
                      className={`flex items-center gap-3 py-3 transition-opacity ${
                        atenuado ? "opacity-50" : "opacity-100"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="h-3.5 w-3.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: fill }}
                      />
                      <span className="flex-1 font-medium">{concepto.nombre}</span>
                      <span className="text-right">
                        <span className="block font-semibold tabular-nums">
                          {formatearMonto(concepto.monto)}
                        </span>
                        <span className="block text-xs text-muted-foreground tabular-nums">
                          {formatearPorcentaje(concepto.monto, total)}
                        </span>
                      </span>
                    </li>
                  );
                })}
                <li className="flex items-center gap-3 py-3 font-bold">
                  <span className="flex-1">Total</span>
                  <span className="tabular-nums">{formatearMonto(total)}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
            <span>Valores brutos de referencia, antes de descuentos.</span>
            <Button asChild variant="link" className="h-auto justify-start p-0 md:justify-end">
              <Link href="/escalas">
                Ver escalas salariales completas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </FramerComponent>
    </section>
  );
};

export default SalarioDelMes;
