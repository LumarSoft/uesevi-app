import {
  AlertDialog,
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
import { IComposicionSalarial } from "@/shared/types/Querys/IComposicionSalarial";
import { nombrePeriodo } from "@/shared/utils/composicionSalarial";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export const Delete = ({
  data,
  onDataDelete,
}: {
  data: IComposicionSalarial;
  onDataDelete: (item: IComposicionSalarial) => void;
}) => {
  const handleDelete = async () => {
    const result = await deleteData("salary-composition/:id", data.id);

    if (result.ok) {
      onDataDelete(data);
      toast.success("Período eliminado");
    } else {
      toast.error(result.message || "Error al eliminar el período");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="flex gap-2">
          Eliminar <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar este período?</AlertDialogTitle>
          <AlertDialogDescription>
            Se va a eliminar la composición de{" "}
            <b>
              {nombrePeriodo(data.mes, data.year)} · {data.categoria}
            </b>{" "}
            de forma permanente. Si estaba publicada, deja de verse en la web.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
