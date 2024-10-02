"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";

export const Form = () => {
  const [formData, setFormData] = useState({
    cuit: "",
    name: "",
    address: "",
    phone: "",
    location: "",
    contactName: "",
    contactLastName: "",
    contactPhone: "",
    contactEmail: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación de datos
    if (
      !formData.cuit ||
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.contactName ||
      !formData.contactLastName ||
      !formData.username ||
      !formData.password
    ) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSend.append(key, value)
    );

    try {
      const result = await postData("companies", formDataToSend);
      console.log(result);

      if (result.ok) {
        toast.success("Usuario registrado correctamente");
        setFormData({
          cuit: "",
          name: "",
          address: "",
          phone: "",
          location: "",
          contactName: "",
          contactLastName: "",
          contactPhone: "",
          contactEmail: "",
          username: "",
          password: "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al intentar enviar la solicitud");
    }
  };

  return (
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
              <Label htmlFor="cuit">Cuit</Label>
              <Input
                id="cuit"
                name="cuit"
                placeholder="Ingrese el cuit de la empresa"
                required
                onChange={handleChange}
                value={formData.cuit}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ingrese el nombre de la empresa"
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Domicilio</Label>
              <Input
                id="address"
                name="address"
                placeholder="Ingrese el domicilio de la empresa"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Ingrese el teléfono de la empresa"
                required
                type="tel"
                onChange={handleChange}
                value={formData.phone}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localidad</Label>
            <Input
              id="location"
              name="location"
              placeholder="Localidad de la empresa"
              onChange={handleChange}
              value={formData.location}
            />
          </div>

          <h4 className="text-center text-2xl font-semibold">
            Persona de contacto
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre</Label>
              <Input
                id="contactName"
                name="contactName"
                placeholder="Ingrese el nombre del contacto"
                required
                onChange={handleChange}
                value={formData.contactName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactLastName">Apellido</Label>
              <Input
                id="contactLastName"
                name="contactLastName"
                placeholder="Ingrese el apellido del contacto"
                required
                onChange={handleChange}
                value={formData.contactLastName}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                placeholder="Ingrese el teléfono del contacto"
                required
                onChange={handleChange}
                value={formData.contactPhone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Correo electrónico</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                placeholder="Ingrese el email del contacto"
                required
                onChange={handleChange}
                value={formData.contactEmail}
              />
            </div>
          </div>

          <h4 className="text-center text-2xl font-semibold">
            Credenciales del sistema
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                name="username"
                placeholder="Ingrese el usuario del sistema"
                required
                onChange={handleChange}
                value={formData.username}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                placeholder="Ingrese la contraseña del sistema"
                required
                type="password"
                onChange={handleChange}
                value={formData.password}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enviar Solicitud
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
