"use client";
import { useEffect, useState } from "react";
import { fetchData } from "@/services/mysql/functions";
import { IComposicionSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import { createColumns } from "./Table/Columns";
import { DataTable } from "./Table/Data-Table";
import { ComposicionDialog } from "./Dialog/ComposicionDialog";

// ABM de la composición salarial mensual que se muestra en la home
// (sección "Salario del mes").
const ComposicionSalarialModule = () => {
  const [composiciones, setComposiciones] = useState<IComposicionSalarial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const result = await fetchData("salary-composition");
        setComposiciones(result.data || []);
      } catch (error) {
        console.error("Error al obtener la composición salarial:", error);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const ordenar = (lista: IComposicionSalarial[]) =>
    [...lista].sort(
      (a, b) =>
        b.year - a.year ||
        b.mes - a.mes ||
        a.categoria.localeCompare(b.categoria)
    );

  const handleCreate = (nueva: IComposicionSalarial) =>
    setComposiciones((prev) => ordenar([...prev, nueva]));

  const handleUpdate = (actualizada: IComposicionSalarial) =>
    setComposiciones((prev) =>
      ordenar(prev.map((c) => (c.id === actualizada.id ? actualizada : c)))
    );

  const handleDelete = (eliminada: IComposicionSalarial) =>
    setComposiciones((prev) => prev.filter((c) => c.id !== eliminada.id));

  const columns = createColumns(handleUpdate, handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Composición salarial
            </h2>
            <p className="text-sm text-muted-foreground">
              Salario de referencia que ven los afiliados en la home, mes a mes.
            </p>
          </div>
          <ComposicionDialog
            existentes={composiciones}
            onSaved={handleCreate}
          />
        </div>
        <DataTable
          columns={columns}
          data={composiciones}
          filterColumn="periodo"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ComposicionSalarialModule;
