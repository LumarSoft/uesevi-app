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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { RefreshCcw } from "lucide-react";
import { ComboboxEmpresas } from "./ComboBox";
import { useState } from "react";
import { updateData } from "@/services/mysql/functions";

export const ToggleEmpresa = ({
  data,
  empresas,
  onDataUpdate,
}: {
  data: IFormulario;
  empresas: IEmpresa[];
  onDataUpdate: (updateItem: IFormulario) => void;
}) => {
  const [nuevaEmpresa, setNuevaEmpresa] = useState(
    data.empresa_provisoria_nombre
  );

  const handleChange = () => {
    const formData = new FormData();
    formData.append("empresa_provisoria_nombre", nuevaEmpresa);

    updateData("formulario/change-empresa", data.numero_socio, formData);
    onDataUpdate({
      ...data,
      empresa_provisoria_nombre: nuevaEmpresa,
    });
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
          <ComboboxEmpresas
            empresas={empresas}
            onChangeEmpresa={setNuevaEmpresa}
          />
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
