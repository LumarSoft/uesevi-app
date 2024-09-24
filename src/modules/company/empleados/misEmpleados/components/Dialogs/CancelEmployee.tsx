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
import { updateData } from "@/services/mysql/functions";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { toast } from "react-toastify";

export const CancelEmployee = ({
  employee,
  cancelEmployee,
}: {
  employee: IEmpleado;
  cancelEmployee: (employee: IEmpleado) => void;
}) => {
  const handleCancel = async () => {
    const formData = new FormData();
    try {
      const result = await updateData(
        "employees/deleteEmployee",
        employee.id,
        formData
      );
      console.log(result);
      if (result.message === "Employee deleted") {
        cancelEmployee(employee);
        return toast.success("Empleado dado de baja");
      }
    } catch (error) {}
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Dar de baja</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Cambiara el estado de {employee.nombre} {employee.apellido} a
            `Inactivo`
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancel}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
