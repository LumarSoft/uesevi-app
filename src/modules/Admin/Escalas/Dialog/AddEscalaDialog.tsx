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
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AddScaleDialog = ({ id }: { id: number }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    
    if (!name) {
      return toast.error("Por favor, ingrese un nombre.");
    } else if (!file) {
      return toast.error("Por favor, seleccione un archivo.");
    }

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", name);
    formData.append("pdf", file);

    try {
      const result = await postData("scales/create", formData);
      if (result.ok) {
        toast.success("Archivo subido correctamente.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Agregar escala</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                type="text"
                id="nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="archivo">Archivo PDF</Label>
              <Input
                type="file"
                id="archivo"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
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
