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
import { DownloadIcon, RefreshCcw } from "lucide-react";

const handleDownload = () => {
  console.log("Download");
};

export const PrintFicha = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2 bg-green-400 hover:bg-green-500">
          Ficha de afiliación <DownloadIcon/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Desea descargar y generar la ficha de afiliación?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDownload}>
            Descargar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};