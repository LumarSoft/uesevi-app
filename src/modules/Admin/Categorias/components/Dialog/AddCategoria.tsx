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

export const AddCategoria = () => {
  const [nombre, setNombre] = useState("");
  const [sueldo, setSueldo] = useState(0);

  const handleSubmit = async () => {
    if (!nombre || !sueldo) {
      return toast.error("Por favor, llene todos los campos");
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("sueldo", sueldo.toString());

    const result = await postData("categorias/add-categoria", formData);

    if (result.ok === true){
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
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid w-full  items-center gap-1.5">
              <Label>Sueldo basico</Label>
              <Input
                placeholder="Sueldo"
                type="number"
                onChange={(e) => setSueldo(Number(e.target.value))}
              />
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};