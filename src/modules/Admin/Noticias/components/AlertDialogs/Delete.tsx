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
import { INoticias } from "@/shared/types/Querys/INoticias";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export const Delete = ({
  data,
  onDataDelete,
}: {
  data: INoticias;
  onDataDelete: (deleteItem: INoticias) => void;
}) => {
  const handleDelete = async () => {
    const result = await deleteData("noticias/delete-noticia", data.id);

    if (result && result.warningStatus > 0) {
      return toast.error("Error al eliminar datos:", result);
    }

    onDataDelete(data);

    toast.success("Noticia eliminada correctamente");
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
            Estas a punto de eliminar la noticia con el titulo: {data.titulo} de
            forma permanente. Esta accion no se puede deshacer.
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
