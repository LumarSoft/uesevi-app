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
import { deleteData } from "@/services/mysql/functions";
import { IEscalas } from "@/shared/types/Querys/IEscalas";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export const Delete = ({
  data,
  onDataDelete,
}: {
  data: IEscalas;
  onDataDelete: (deleteItem: IEscalas) => void;
}) => {
  const handleDelete = async () => {
    const result = await deleteData("scales/:id", data.id);

    if (result.ok) {
      onDataDelete(data);
      toast.success("Archivo eliminado");
    } else {
      toast.error("Error al eliminar el archivo");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white flex gap-2">
          Eliminar <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Estas seguro que desea eliminar?</AlertDialogTitle>
          <AlertDialogDescription>
            Estas a punto de eliminar el archivo <b>{data.nombre}</b> de forma
            permanente. Esta accion no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
