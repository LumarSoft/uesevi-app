"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { useState } from "react";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/services/mysql/functions";
import { NuevaFicha } from "./components/Dialog/NuevaFicha";

const AdminFormularioModule = ({
  forms,
  companies,
}: {
  forms: IFormulario[];
  companies: IEmpresa[];
}) => {
  const [formulario, setFormulario] = useState(forms);

  const handleUpdate = (updatedItem: IFormulario) => {
    const newData = formulario.map((item) =>
      item.cuil === updatedItem.cuil ? updatedItem : item
    );
    setFormulario(newData);
  };

  // Función para eliminar un elemento
  const handleDelete = (id: number) => {
    setFormulario((prevData) => prevData.filter((item) => item.id !== id));
  };

  // Tras cargar una ficha se relee el listado: la API devuelve las fichas ya
  // formateadas (fechas, `created`) y la nueva queda primera.
  const recargarFichas = async () => {
    const result = await fetchData("forms");
    if (result.ok) setFormulario(result.data);
  };

  const columns = createColumns(handleUpdate, companies, handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Fichas de afiliación
          </h2>
          <div className="flex flex-wrap gap-2">
            <NuevaFicha companies={companies} onCreated={recargarFichas} />
            <Button variant="outline">
              <a href="/ficha-uesevi-1.pdf" download>
                Descargar ficha vacía
              </a>
            </Button>
          </div>
        </div>
        <DataTable columns={columns} data={formulario} filterColumn="nombre" />
      </div>
    </div>
  );
};

export default AdminFormularioModule;
