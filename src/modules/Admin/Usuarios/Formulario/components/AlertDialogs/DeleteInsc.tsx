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
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteData } from "@/services/mysql/functions";
import { toast } from "react-toastify";

export const DeleteInsc = ({
  data,
  onDelete,
}: {
  data: IFormulario;
  onDelete?: (id: number) => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteData("forms/:id", data.id);
      if (!result.ok) {
        console.error("Failed to delete form");
        toast.error("No se pudo eliminar el formulario");
        return;
      }

      onDelete?.(data.id);

      toast.success("Formulario eliminado correctamente");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar el formulario");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="w-[100px]"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el formulario de {data.nombre}{" "}
            {data.apellido}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
