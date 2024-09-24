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
import { ICategoria } from "@/shared/types/Querys/ICategory";
import { toast } from "react-toastify";

export const DeleteCategoria = ({
  data,
  onDataDelete,
}: {
  data: ICategoria;
  onDataDelete: (deleteItem: ICategoria) => void;
}) => {
  const handleDelete = async () => {
    const result = await deleteData("category/delete-category", data.id);

    if (result && result.warningStatus > 0) {
      return toast.error("Error al eliminar datos:", result);
    }

    onDataDelete(data);

    toast.success("Categoria eliminada correctamente");
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Eliminar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro de eliminar la categoria: {data.nombre}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Estas a punto de eliminar la categoria {data.nombre} de forma
            permanente. Esta accion no se puede deshacer.
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
