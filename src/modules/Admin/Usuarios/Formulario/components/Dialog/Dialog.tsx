import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IFormulario } from "@/shared/types/Querys/IFormulario";
import { Label } from "@radix-ui/react-label";
import { Eye } from "lucide-react";
import React from "react";

export const DialogComponent = ({ data }: { data: IFormulario }) => {
  // Función para formatear la fecha en dd/mm/yy
  const formatFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Los meses empiezan desde 0
    const anio = String(fecha.getFullYear()).slice(2); // Tomar los últimos 2 dígitos del año
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          Ver <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <div>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              INFORMACIÓN DEL EMPLEADO
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Nombre</Label>
            <Input value={data.nombre} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Apellido</Label>
            <Input value={data.apellido} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">DNI</Label>
            <Input value={data.dni} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Correo Electrónico</Label>
            <Input value={data.correo_electronico} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Fecha de Nacimiento</Label>
            <Input value={formatFecha(data.fecha_nacimiento)} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">CUIL</Label>
            <Input value={data.cuil} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Fecha de Ingreso</Label>
            <Input value={formatFecha(data.fecha_ingreso)} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Estado Civil</Label>
            <Input value={data.estado_civil} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Nacionalidad</Label>
            <Input value={data.nacionalidad} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Domicilio</Label>
            <Input value={data.domicilio} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Localidad</Label>
            <Input value={data.localidad} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Provincia</Label>
            <Input value={data.provincia} disabled />
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-semibold">Teléfono</Label>
            <Input value={data.telefono} disabled />
          </div>
          <div className="space-y-1">
            <Label className="text-sm font-semibold">Empresa</Label>
            <Input value={data.empresa} disabled />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
