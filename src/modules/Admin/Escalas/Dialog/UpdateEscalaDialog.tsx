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

export const UploadEscalaDialog = ({
  onUploadSuccess,
}: {
  onUploadSuccess: (result: any) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      toast.error("Por favor, ingrese un nombre.");
      return;
    } else if (!archivo) {
      toast.error("Por favor, seleccione un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("archivo", archivo);

    try {
      const result = await postData("escalas/create", formData);
      if (result.ok) {
        onUploadSuccess(result.data.escala);
        setIsOpen(false);
        setNombre("");
        setArchivo(null);
      } else {
        setError("Error al subir el archivo. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error al procesar la solicitud.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full text-lg">
          <File className="w-5 h-5 mr-3" />
          Nuevo archivo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Subir Nueva Escala
          </DialogTitle>
        </DialogHeader>

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
          <DialogFooter>
            <Button type="submit">Subir archivo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
