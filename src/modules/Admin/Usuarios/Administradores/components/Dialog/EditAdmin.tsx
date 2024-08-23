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
import { IAdmin } from "@/shared/types/IAdmin";
import { Label } from "@radix-ui/react-label";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { updateData } from "@/services/mysql/functions";
export const EditAdminDialog = ({
  data,
  onDataUpdate,
}: {
  data: IAdmin;
  onDataUpdate: (updatedItem: IAdmin) => void;
}) => {
  const [editedUser, setEditedUser] = useState(data);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const result = await updateData(
        "administradores/update-admin",
        editedUser.id,
        {
          ...editedUser,
        }
      );
      if (result) {
        onDataUpdate(editedUser);
      } else {
        console.error(
          "Failed to update user: No result returned from updateData"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
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
            Editar a{" "}
            <span className="bg-yellow-100 text-yellow-800 text-lg font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              {" "}
              {data.nombre} {data.apellido}
            </span>
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
                value={editedUser.nombre}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                type="text"
                id="apellido"
                name="apellido"
                value={editedUser.apellido}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                type="tel"
                id="telefono"
                name="telefono"
                value={editedUser.telefono}
                onChange={handleInputChange}
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
