"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITasas } from "@/shared/types/ITasas";
import { updateData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

const TasasModule = ({ data }: { data: ITasas[] }) => {
  const [tasas, setTasas] = useState(data);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const updatedTasas = tasas.map((item) =>
      item.id === tasas[0].id ? { ...item, porcentaje: value } : item
    );
    setTasas(updatedTasas);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tasaActualizada = tasas[0];

    const formData = new FormData();
    formData.append("porcentaje", tasaActualizada.porcentaje);

    try {
      console.log("Sending request with formData:", formData); 
      await updateData("tasas/update-tasa", tasaActualizada.id, formData);
      toast.success("Tasa actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la tasa");
      console.error("Error al actualizar la tasa:", error);
    }
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
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tasa de interés</h2>
          <Button onClick={handleOpenAfip}>Ver tasas de AFIP</Button>
        </div>
        <div>
          <span>
            <i>Por favor, ingresar 6 decimales.</i>
          </span>
        </div>
        <div>
          <div className="flex h-full flex-col justify-center">
            <div className="space-y-4 max-w-2xl w-full p-2">
              <form
                className="w-full flex gap-3 items-center h-24"
                onSubmit={handleUpdate}
              >
                <div className="flex-grow">
                  <label htmlFor="tasa" className="font-extralight">
                    Tasa diaria
                  </label>
                  <Input
                    id="tasa"
                    name="tasa"
                    value={tasas[0].porcentaje}
                    required
                    className="w-full mt-2"
                    onChange={handleInputChange}
                  />
                </div>
                <span className="mt-8">%</span>
                <Button className="mt-8 ml-4" type="submit">
                  Actualizar
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasasModule;