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
import { toast } from "react-toastify";

export const ToggleEmpresa = ({
  data,
  companies,
  onDataUpdate,
}: {
  data: IFormulario;
  companies: IEmpresa[];
  onDataUpdate: (updateItem: IFormulario) => void;
}) => {
  const [newCompany, setNewCompany] = useState(data.empresa);

  const handleChange = async () => {
    const formData = new FormData();
    formData.append("company", newCompany);

    const result = await updateData("forms/:id/company", data.id, formData);
    console.log(result);

    if (!result.ok) {
      console.error("Failed to update company");
      return;
    }

    onDataUpdate({
      ...data,
      empresa: newCompany,
    });
    toast.success("Actualizado correctamente");
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
            empresas={companies}
            onChangeEmpresa={setNewCompany}
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
