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
import { Trash } from "lucide-react";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { deleteData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

export const DeleteDialog = ({
  statement,
  deleteStatement,
}: {
  statement: IDeclaracion;
  deleteStatement: (id: number) => void;
}) => {
  const handleDelete = async () => {
    console.log(statement.id);
    try {
      const result = await deleteData("statements/:id", statement.id);
      if (result.ok) {
        toast.success("Declaración jurada eliminada");
        deleteStatement(statement.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro que quieres eliminar la declaración jurada
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y eliminará la declaración jurada
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
