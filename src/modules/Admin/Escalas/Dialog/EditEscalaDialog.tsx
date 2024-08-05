import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IEscalas } from "@/shared/types/IEscalas";
import { Label } from "@radix-ui/react-label";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { updateData } from "@/services/mysql/functions";

export const EditEscalaDialog = ({
  data,
  onDataUpdate,
}: {
  data: IEscalas;
  onDataUpdate: (updatedItem: IEscalas) => void;
}) => {
  const [editedEscala, setEditedEscala] = useState(data);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedEscala({ ...editedEscala, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result = await updateData(
        "escalas/update-escala",
        editedEscala.id,
        {
          ...editedEscala,
        }
      );
      if (result) {
        onDataUpdate(editedEscala);
      } else {
        console.error(
          "Failed to update escala: No result returned from updateData"
        );
      }
    } catch (error) {
      console.error("Error updating escala:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          Editar <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Editar Escala
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                value={editedEscala.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="created">Fecha de creación</Label>
              <Input
                type="text"
                id="created"
                name="created"
                value={editedEscala.created}
                disabled
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
