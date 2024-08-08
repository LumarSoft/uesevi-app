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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { RefreshCcw } from "lucide-react";
import { ComboboxEmpresas } from "./ComboBox";
import { useState } from "react";

export const ToggleEmpresa = ({
  data,
  empresas,
  onDataUpdate,
}: {
  data: IFormulario;
  empresas: IEmpresa[];
  onDataUpdate: (updateItem: IFormulario) => void;
}) => {

  const [nuevaEmpresa, setNuevaEmpresa] = useState(setNuevaEmpresa)

  const handleChange = () => {
    updateData("formularios", data.numero_socio, { empresa_provisoria_nombre: nuevaEmpresa });
    onDataUpdate({ ...data, empresa: 1 });
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
          <ComboboxEmpresas empresas={empresas} onChange={setNuevaEmpresa}/>
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
