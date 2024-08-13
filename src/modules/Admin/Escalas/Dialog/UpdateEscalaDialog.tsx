import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { File } from "lucide-react";
import { postData } from "@/services/mysql/functions";
import { toast } from "react-toastify";
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

export const UploadEscalaDialog = ({ id }: { id: number }) => {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    if (!nombre) {
      return toast.error("Por favor, ingrese un nombre.");
    } else if (!archivo) {
      return toast.error("Por favor, seleccione un archivo.");
    }

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("nombre", nombre);
    formData.append("pdf", archivo);

    try {
      const result = await postData("escalas/create", formData);
      console.log(result);
      if (result.ok) {
        toast.success("Archivo subido correctamente.");
      } else {
        setError("Error al subir el archivo. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error al procesar la solicitud.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Agregar categoria</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="archivo">Archivo PDF</Label>
              <Input
                type="file"
                id="archivo"
                accept=".pdf"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Guardar</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
