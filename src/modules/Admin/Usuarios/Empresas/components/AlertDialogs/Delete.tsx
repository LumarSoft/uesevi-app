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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export const Delete = ({
  data,
  onDataDelete,
}: {
  data: IEmpresa;
  onDataDelete: (updateItem: IEmpresa) => void;
}) => {
  const handleDelete = async () => {
    try {
      const result = await deleteData("companies/delete", data.id);
      console.log(result);
      if (result.message === "Empresa eliminada") {
        toast.success("Empresa eliminada con exito");
      }
    } catch (error) {
      console.error("Failed to delete data", error);
    }

    onDataDelete(data);
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
            Estas a punto de eliminar {data.nombre} de forma permanente. Esta
            accion no se puede deshacer.
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
