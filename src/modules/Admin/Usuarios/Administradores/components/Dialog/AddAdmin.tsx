"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postData } from "@/services/mysql/functions";

// Define the type for the form data
interface FormData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono: string;
  created: string;
}

export const AddAdmin = ({ onAdminAdded }: { onAdminAdded: (newUser: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    created: new Date().toISOString(),
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Crear una nueva instancia de FormData
    const formDataObj = new FormData();
    for (const key in formData) {
      formDataObj.append(key, formData[key as keyof FormData]);
    }
    formDataObj.append("rol", "admin");

    try {
      const result = await postData("administradores/add-admin", formDataObj);
      if (result.ok) {
        onAdminAdded(result.data.newUser); 
        setIsOpen(false);
        setFormData({
          email: "",
          password: "",
          nombre: "",
          apellido: "",
          telefono: "",
          created: new Date().toISOString(),
        });
      } else {
        if (result.error) {
          setError(
            "Error al añadir administrador. El correo electrónico ya está en uso."
          );
        }
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Agregar Administrador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Administrador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              type="number"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit">Agregar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
