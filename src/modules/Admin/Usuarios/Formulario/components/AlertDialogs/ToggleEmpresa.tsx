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
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { RefreshCcw } from "lucide-react";



export const ToggleEmpresa = ({
  data,
  onDataUpdate,
}: {
  data: IFormulario;
  onDataUpdate: (updateItem: IFormulario) => void;
}) => {
  const handleChange = async () => {
    const result = await updateData(
      "empresas/change-empresa",
      data.numero_socio,
      {
        empresa_provisoria_nombre: select.empresa_seleccionada,
      }
    );

    if (result !== undefined && result !== null) {
      onDataUpdate({
        ...data,
        empresa_provisoria_nombre: data.empresa_provisoria_nombre,
      });
    } else {
      console.error("Failed to update empresa");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2">
          Empresa <RefreshCcw />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Seleccione la empresa a la que pertenece el socio
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          <select
            value={selectedEmpresa}
            onChange={(e) => setSelectedEmpresa(e.target.value)}
          >
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.nombre}>
                {empresa.nombre}
              </option>
            ))}
          </select>
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleChange}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
