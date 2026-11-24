"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IAfiliado } from "@/shared/types/Querys/IAfiliado";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import {
  buscarAfiliados,
  indexarAfiliados,
  interpretarBusqueda,
} from "./helpers";

const enMiles = (cantidad: number) => cantidad.toLocaleString("es-AR");

const AdminAfiliadosModule = ({ afiliados }: { afiliados: IAfiliado[] }) => {
  const [texto, setTexto] = useState("");
  // El input se actualiza en el acto; el filtrado corre con el valor diferido,
  // así escribir nunca se traba aunque el padrón crezca.
  const textoDiferido = useDeferredValue(texto);

  const columns = useMemo(() => createColumns(), []);
  // El índice se arma una sola vez por carga; cada tecla sólo filtra.
  const indice = useMemo(() => indexarAfiliados(afiliados), [afiliados]);
  const resultados = useMemo(
    () => buscarAfiliados(indice, textoDiferido),
    [indice, textoDiferido]
  );

  const busqueda = interpretarBusqueda(textoDiferido);
  const hayBusqueda = busqueda.palabras.length > 0 || busqueda.numero !== "";
  const limpiar = () => setTexto("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Afiliados</h2>
          <p className="text-sm text-muted-foreground">
            Empleados afiliados al día de la fecha.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") limpiar();
              }}
              placeholder="Apellido, nombre, DNI o CUIL"
              aria-label="Buscar afiliados por apellido, nombre, DNI o CUIL"
              autoComplete="off"
              spellCheck={false}
              className="pl-9 pr-10"
            />
            {texto !== "" && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={limpiar}
                aria-label="Limpiar búsqueda"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground" aria-live="polite">
            {hayBusqueda ? (
              <>
                <span className="font-semibold text-foreground">
                  {enMiles(resultados.length)}
                </span>{" "}
                {resultados.length === 1 ? "resultado" : "resultados"} de{" "}
                {enMiles(afiliados.length)} afiliados
              </>
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  {enMiles(afiliados.length)}
                </span>{" "}
                {afiliados.length === 1 ? "afiliado" : "afiliados"}
              </>
            )}
          </p>
        </div>

        <DataTable
          columns={columns}
          data={resultados}
          vacio={
            hayBusqueda ? (
              <div className="space-y-2">
                <p className="font-medium">
                  Ningún afiliado coincide con «{textoDiferido.trim()}».
                </p>
                <p className="text-sm text-muted-foreground">
                  Probá con el apellido solo, o con el número de documento.
                </p>
                <Button variant="outline" size="sm" onClick={limpiar}>
                  Limpiar búsqueda
                </Button>
              </div>
            ) : (
              "No hay afiliados para mostrar."
            )
          }
        />
      </div>
    </div>
  );
};

export default AdminAfiliadosModule;
