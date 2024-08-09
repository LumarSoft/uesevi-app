"use client";

import { useState } from "react";
import { createColumns } from "@/modules/Admin/Escalas/Table/Columns";
import { DataTable } from "@/modules/Admin/Usuarios/Empresas/components/Table/Data-Table";
import { ITasas } from "@/shared/types/ITasas";
import { Button } from "@/components/ui/button";
import { File, UserPlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const TasasModule = ({ data }: { data: ITasas[] }) => {
  const [tasas, setTasas] = useState(data);
  const handleUpdate = (updatedItem: ITasas) => {
    const newData = tasas.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setTasas(newData);
  };

  const handleOpenAfip = () => {
    window.open(
      "https://serviciosweb.afip.gob.ar/genericos/CalculoInteres/punitorios.aspx#tasasEvolucion",
      "_blank"
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tasa de interés</h2>
          <Button onClick={handleOpenAfip}>Ver tasas de AFIP</Button>
        </div>
        <div>
          <span>
            <i>Por favor, ingresar 6 decimales.</i>
          </span>
        </div>
        <div>
          {/* <form onSubmit={handleUpdate} className="flex gap-3 items-center h-24"> */}
          <form className="w-full flex gap-3 items-center h-24">
            <div>
              <label htmlFor="tasa" className="font-extralight">Tasa diaria</label>
              <Input
                id="tasa"
                name="tasa"
                value={tasas[0].porcentaje}
                required
                className="w-full"
              ></Input>
            </div>
            <Button className="mt-6" type="submit">Actualizar</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TasasModule;
