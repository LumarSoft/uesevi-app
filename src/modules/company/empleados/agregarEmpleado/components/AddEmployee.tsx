"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";

export const AddEmployee = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cuil, setCuil] = useState("");
  const [category, setCategory] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [unionAdhesion, setUnionAdhesion] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { user } = userStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validamos que haya un valor
    if (
      !firstName ||
      !lastName ||
      !cuil ||
      !category ||
      !employmentStatus ||
      !unionAdhesion ||
      !email
    ) {
      return toast.error("Todos los campos son obligatorios");
    }

    // Validamos que el CUIL tenga 11 caracteres
    if (cuil.length !== 11) {
      return toast.error("El CUIL debe tener 11 caracteres");
    }

    // Validamos que el CUIL sea un numero
    if (isNaN(Number(cuil))) {
      return toast.error("El CUIL debe ser un número");
    }

    // Validamos que el CUIL no tenga guiones ni puntos
    if (cuil.includes(".") || cuil.includes("-")) {
      return toast.error("El CUIL no debe contener guiones ni puntos");
    }

    // Validamos que la categoria sea un numero
    if (isNaN(Number(category))) {
      return toast.error("La categoria debe ser un número");
    }

    // Validamos que el estado de empleo sea un numero
    if (isNaN(Number(employmentStatus))) {
      return toast.error("El estado de empleo debe ser un número");
    }

    // Validamos que la adhesion al sindicato sea un numero
    if (isNaN(Number(unionAdhesion))) {
      return toast.error("La adhesion al sindicato debe ser un número");
    }


    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("cuil", cuil);
    formData.append("category", category);
    formData.append("employmentStatus", employmentStatus);
    formData.append("unionAdhesion", unionAdhesion);
    formData.append("email", email);
    formData.append("companyId", user.empresa.id);

    try {
      const result = await postData("employees", formData);

      if (result.ok) {
        toast.success("Empleado agregado correctamente");
      }
    } catch (error) {
      toast.error("Error al agregar el empleado");
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <Label>
        Nombre
        <Input onChange={(e) => setfirstName(e.target.value)} />
      </Label>
      <Label>
        Apellido
        <Input onChange={(e) => setLastName(e.target.value)} />
      </Label>
      <Label>
        Email
        <Input onChange={(e) => setEmail(e.target.value)} />
      </Label>
      <Label>
        CUIL{" "}
        <span className="text-muted-foreground">
          (no debe contener guiones ni puntos)
        </span>
        <Input onChange={(e) => setCuil(e.target.value)} />
      </Label>
      <Label>
        Categoria
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una categoria..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Vigilador General</SelectItem>
            <SelectItem value="2">Vigilador Bombero</SelectItem>
            <SelectItem value="3">Administrativo</SelectItem>
            <SelectItem value="4">Vigilador Principal</SelectItem>
            <SelectItem value="5">Verificador Evento</SelectItem>
            <SelectItem value="6">Operador de monitoreo</SelectItem>
            <SelectItem value="7">Guia Tecnico</SelectItem>
            <SelectItem value="8">
              Instalador de elementos de seguridad electrónica
            </SelectItem>
            <SelectItem value="9">
              Controlador de admisión y permanencia en gral.
            </SelectItem>
          </SelectContent>
        </Select>
      </Label>
      <Label>
        Estado empleo
        <Select onValueChange={setEmploymentStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un estado..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Activo</SelectItem>
            <SelectItem value="2">Inactivo</SelectItem>
            <SelectItem value="3">Suspendido</SelectItem>
            <SelectItem value="4">Licencia</SelectItem>
          </SelectContent>
        </Select>
      </Label>
      <Label>
        Adhesion Sindicato
        <Select onValueChange={setUnionAdhesion}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Si</SelectItem>
            <SelectItem value="0">No</SelectItem>
          </SelectContent>
        </Select>
      </Label>
      <Button type="submit">Agregar empleado</Button>
    </form>
  );
};
