"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { useState } from "react";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";

export const EmpresaAltaModule = () => {
  const [cuit, setCuit] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cuit", cuit);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("contactName", contactName);
    formData.append("contactLastName", contactLastName);
    formData.append("contactPhone", contactPhone);
    formData.append("contactEmail", contactEmail);
    formData.append("username", username);
    formData.append("password", password);

    try {
      const result = await postData("companies/create", formData);

      if (result.data.message === "Empresa creada") {
        return toast.success("Usuario registrado correctamente");
      }
    } catch (error) {
      console.error(error);
      return toast.error("Ocurrio un error al intentar enviar la solicitud");
    }
  };

  return (
    <FramerComponent
      style="container mx-auto px-4 py-20"
      animationInitial={{ opacity: 0 }}
      animationAnimate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Alta de empresa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Formulario de alta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h4 className="text-center text-2xl font-semibold">
              Datos de la empresa
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Cuit</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el cuit de la empresa"
                  required
                  onChange={(e) => setCuit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Ingrese el nombre de la empresa"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="domicilio">Domicilio</Label>
                <Input
                  id="email"
                  placeholder="Ingrese el domicilio de la empresa"
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telefono</Label>
                <Input
                  id="tel"
                  placeholder="Ingrese el telefono de la empresa"
                  required
                  type="tel"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad</Label>
              <Input
                placeholder="Localidad de la empresa"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <h4 className="text-center text-2xl font-semibold">
              Persona de contacto
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del contacto"
                  required
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input
                  placeholder="Ingrese el apellido del contacto"
                  required
                  onChange={(e) => setContactLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Telefono</Label>
                <Input
                  placeholder="Ingrese el telefono del contacto"
                  required
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Correo electronico</Label>
                <Input
                  placeholder="Ingrese el email del contacto"
                  required
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>

            <h4 className="text-center text-2xl font-semibold">
              Creedenciales del sistema
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Usuario</Label>
                <Input
                  placeholder="Ingrese el usuario del sistema"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  placeholder="Ingrese la contraseña del sistema"
                  required
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Enviar Solicitud
            </Button>
          </form>
        </CardContent>
      </Card>
    </FramerComponent>
  );
};
