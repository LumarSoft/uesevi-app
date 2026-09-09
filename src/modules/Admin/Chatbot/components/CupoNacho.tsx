"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, Gauge, Gift, Loader2 } from "lucide-react";
import { fetchData } from "@/services/mysql/functions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { IChatbotCupo, IChatbotReporte } from "@/shared/types/Querys/IChatbot";

// Cada consulta a Nacho consume tokens del modelo, que se pagan. Esta pastilla
// le muestra al personal cuánto le queda del cupo del mes, en consultas: los
// tokens son una unidad que no le dice nada a quien usa el panel.
//
// Mientras `modo` es "prueba" el cupo no corta nada: se muestra igual para que
// el consumo sea visible desde el día uno y para dejar dicho que esas consultas
// son un regalo con fecha de vencimiento, no una función incluida para siempre.
//
// Si el usuario es el proveedor del sistema (CHATBOT_EMAILS_PROVEEDOR en la
// API), la API le manda además los costos en dólares y el detalle aparece en el
// popover. Para UESEVI esos campos ni siquiera llegan al navegador.

const COLORES = {
  ok: {
    barra: "bg-emerald-500",
    texto: "text-emerald-700 dark:text-emerald-400",
    borde: "border-emerald-500/30",
    fondo: "bg-emerald-500/5",
  },
  aviso: {
    barra: "bg-amber-500",
    texto: "text-amber-700 dark:text-amber-400",
    borde: "border-amber-500/30",
    fondo: "bg-amber-500/5",
  },
  critico: {
    barra: "bg-destructive",
    texto: "text-destructive",
    borde: "border-destructive/30",
    fondo: "bg-destructive/5",
  },
  agotado: {
    barra: "bg-destructive",
    texto: "text-destructive",
    borde: "border-destructive/40",
    fondo: "bg-destructive/10",
  },
} as const;

const numero = (valor: number) => valor.toLocaleString("es-AR");

const dolares = (valor: number, decimales = 2) =>
  `US$ ${valor.toLocaleString("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  })}`;

const fechaCorta = (iso: string) => iso.split("-").reverse().join("/");

const NOMBRE_MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const nombreDePeriodo = (periodo: string) => {
  const [anio, mes] = periodo.split("-");
  const indice = Number(mes) - 1;
  return NOMBRE_MES[indice] ? `${NOMBRE_MES[indice]} de ${anio}` : periodo;
};

const Fila = ({ etiqueta, valor }: { etiqueta: string; valor: string }) => (
  <div className="flex items-baseline justify-between gap-3 text-xs">
    <span className="text-muted-foreground">{etiqueta}</span>
    <span className="font-medium tabular-nums">{valor}</span>
  </div>
);

const CupoNacho = ({ cupo }: { cupo: IChatbotCupo | null }) => {
  const [abierto, setAbierto] = useState(false);
  const [reporte, setReporte] = useState<IChatbotReporte | null>(null);
  const [cargandoReporte, setCargandoReporte] = useState(false);

  if (!cupo || !cupo.consultas_incluidas) return null;

  const color = COLORES[cupo.nivel] ?? COLORES.ok;
  // Con una sola consulta el porcentaje redondea a 0 y la barra se ve vacía:
  // se le deja un mínimo visible mientras haya consumo.
  const ancho = cupo.consultas_usadas > 0 ? Math.max(3, cupo.porcentaje) : 0;

  // El reporte de costos se pide recién al abrir el detalle, y una sola vez.
  const abrir = (valor: boolean) => {
    setAbierto(valor);
    if (!valor || reporte || cargandoReporte || !cupo.proveedor) return;
    setCargandoReporte(true);
    void fetchData("chatbot/reporte").then((respuesta) => {
      if (respuesta?.ok) setReporte(respuesta.data as IChatbotReporte);
      setCargandoReporte(false);
    });
  };

  const analisis = reporte?.analisis;

  return (
    <Popover open={abierto} onOpenChange={abrir}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={`${cupo.consultas_usadas} de ${cupo.consultas_incluidas} consultas usadas en ${nombreDePeriodo(cupo.periodo)}`}
          className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/80 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Gauge className={`h-3.5 w-3.5 shrink-0 ${color.texto}`} />
          <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-muted sm:block">
            <span
              className={`block h-full rounded-full transition-all ${color.barra}`}
              style={{ width: `${ancho}%` }}
            />
          </span>
          <span className="font-medium tabular-nums text-foreground">
            {numero(cupo.consultas_usadas)}
            <span className="font-normal text-muted-foreground">/{numero(cupo.consultas_incluidas)}</span>
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="space-y-3 p-4">
          <div>
            <p className="text-sm font-semibold">Consultas de {nombreDePeriodo(cupo.periodo)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {cupo.modo === "prueba"
                ? "Prueba gratuita: el consumo se mide, pero no se corta ni se cobra."
                : `${numero(cupo.consultas_restantes)} disponibles hasta fin de mes.`}
            </p>
          </div>

          <div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all ${color.barra}`}
                style={{ width: `${ancho}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-baseline justify-between text-xs">
              <span className={`font-semibold ${color.texto}`}>{cupo.porcentaje}% usado</span>
              <span className="tabular-nums text-muted-foreground">
                {numero(cupo.consultas_usadas)} de {numero(cupo.consultas_incluidas)}
              </span>
            </div>
          </div>

          {cupo.prueba && (
            <div className="space-y-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2.5">
              <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                <Gift className="mt-px h-3.5 w-3.5 shrink-0" />
                <span>
                  {cupo.prueba.activa ? (
                    <>
                      <span className="font-semibold">Prueba gratuita sin cargo.</span> Estas
                      consultas son una cortesía de Lumarsoft mientras dura la prueba.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">La prueba gratuita terminó.</span> Nacho
                      sigue disponible mientras definimos cómo continúa.
                    </>
                  )}
                </span>
              </p>
              {cupo.prueba.activa && (
                <Fila
                  etiqueta="Día de la prueba"
                  valor={`${cupo.prueba.dia} de ${cupo.prueba.dias}`}
                />
              )}
              <Fila
                etiqueta={cupo.prueba.activa ? "Hasta el" : "Terminó el"}
                valor={fechaCorta(cupo.prueba.fin)}
              />
            </div>
          )}

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Nacho está en versión beta: puede equivocarse y sus funciones todavía
            cambian de una semana a la otra.
          </p>

          {(cupo.nivel === "aviso" || cupo.nivel === "critico" || cupo.nivel === "agotado") && (
            <p
              className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 text-xs ${color.borde} ${color.fondo} ${color.texto}`}
            >
              <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0" />
              <span>
                {cupo.nivel === "agotado"
                  ? "El cupo del mes se agotó. Escribinos para ampliarlo."
                  : "Estás cerca del límite del mes. Si lo necesitás, se puede ampliar."}
              </span>
            </p>
          )}

          {/* Sólo el proveedor del sistema ve la parte de plata. */}
          {cupo.proveedor && cupo.costos && (
            <div className="space-y-2 border-t pt-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Consumo (sólo proveedor)
              </p>

              {!cupo.costos.precios_configurados && (
                <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-2.5 py-2 text-xs text-amber-700 dark:text-amber-400">
                  Faltan las tarifas del modelo: configurá OPENAI_PRECIO_ENTRADA,
                  OPENAI_PRECIO_ENTRADA_CACHEADA y OPENAI_PRECIO_SALIDA. Los tokens se
                  siguen midiendo y el costo se recalcula después.
                </p>
              )}

              <Fila etiqueta="Costo del período" valor={dolares(cupo.costos.costo_usd, 2)} />
              <Fila etiqueta="Costo por consulta" valor={dolares(cupo.costos.costo_promedio_usd, 4)} />
              <Fila etiqueta="Tope del mes" valor={dolares(cupo.costos.tope_usd, 2)} />
              <Fila etiqueta="Entrada desde caché" valor={`${cupo.costos.cache_hit}%`} />
              <Fila
                etiqueta="Tokens"
                valor={`${numero(cupo.costos.tokens_entrada)} in · ${numero(cupo.costos.tokens_salida)} out`}
              />

              {cargandoReporte && (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Calculando proyección
                </p>
              )}

              {analisis && (
                <div className="space-y-2 border-t pt-2">
                  <Fila
                    etiqueta="Ritmo"
                    valor={`${analisis.consultas_por_dia} consultas/día · ${dolares(analisis.costo_por_dia_usd, 3)}/día`}
                  />
                  <Fila
                    etiqueta="Proyección a 30 días"
                    valor={`${numero(analisis.proyeccion_mensual_consultas)} consultas · ${dolares(analisis.proyeccion_mensual_usd)}`}
                  />
                  <Fila etiqueta="Cupo sugerido" valor={`${numero(analisis.cupo_sugerido)} consultas`} />
                  {/* El costo de tokens es de centavos: un markup puro daría un
                      precio irrisorio, así que el sugerido nunca baja del piso. */}
                  <Fila
                    etiqueta={`Precio sugerido (mín. ${dolares(analisis.piso_usd, 0)})`}
                    valor={`${dolares(analisis.precio_sugerido_usd)}/mes`}
                  />
                  {reporte?.por_usuario?.length ? (
                    <div className="pt-1">
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                        Por usuario
                      </p>
                      {reporte.por_usuario.map((fila) => (
                        <Fila
                          key={fila.usuario_id}
                          etiqueta={fila.nombre}
                          valor={`${numero(fila.consultas)} · ${dolares(fila.costo_usd, 3)}`}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CupoNacho;
