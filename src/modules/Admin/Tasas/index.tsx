"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ITasas } from "@/shared/types/Querys/ITasas";
import { updateData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

const TasasModule = ({ data }: { data: ITasas[] }) => {
  const [percentage, setPercentage] = useState(data[0].porcentaje);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const tasaActualizada = data[0]; // Toma la primera tasa (puedes ajustar según lo necesario)
    console.log("Tasa actualizada para enviar:", tasaActualizada); // Log de la tasa a enviar

    const formData = new FormData();
    formData.append("percentage", percentage);

    const result = await updateData("rates/update-rate", data[0].id, formData);

    if (result) {
      toast.success("Tasa actualizada");
    } else {
      toast.error("Error al actualizar la tasa");
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
                    value={percentage}
                    required
                    className="w-full mt-2"
                    onChange={(e) => setPercentage(e.target.value)}
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
