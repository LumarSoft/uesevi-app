"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { postData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

export const AddCategory = () => {
  const [name, setName] = useState("");
  const [salary, setSalary] = useState(0);
  const [presentismo, setPresentismo] = useState("");

  const handleSubmit = async () => {
    if (!name || !salary) {
      return toast.error("Por favor, llene todos los campos");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("salary", salary.toString());
    // Opcional: si queda vacío la categoría se crea sin presentismo y el
    // aporte solidario se calcula sólo sobre el sueldo básico.
    formData.append("presentismo", presentismo);

    const result = await postData("category", formData);

    if (result.ok === true) {
      toast.success("Categoria agregada correctamente");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Agregar categoria</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl">
              Agregar categoria
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Se agregara una nueva categoria a la base de datos
            </AlertDialogDescription>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Nombre de la categoria</Label>
              <Input
                placeholder="Nombre"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                onChange={(e) => setSalary(Number(e.target.value))}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Presentismo (opcional)</Label>
              <Input
                placeholder="Presentismo"
                type="number"
                value={presentismo}
                onChange={(e) => setPresentismo(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                El aporte solidario es el 2% de (sueldo básico + presentismo).
              </p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
