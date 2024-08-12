import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
              INFORMACION del socio
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="w-full flex gap-6">
          <div className="w-full flex flex-col gap-4">
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="name">Nombre</Label>
              <Input type="text" id="name" disabled value={data.nombre} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input type="text" id="apellido" disabled value={data.apellido} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="cuil">CUIL</Label>
              <Input type="text" id="cuil" disabled value={data.cuil} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="nacionalidad">Email</Label>
              <Input type="text" id="email" disabled value={data.email} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="provincia">Numero de socio (DNI)</Label>
              <Input type="text" id="dni" disabled value={data.numero_socio} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="estado">Estado</Label>
              <Input type="text" id="estado" disabled value={data.estado} />
            </div>
          </div>

          <div className="w-full flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-4">
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    type="text"
                    id="empresa"
                    disabled
                    value={data.empresa_provisoria_nombre}
                  />
                </div>
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="nacionalidad">Nacionalidad</Label>
                  <Input
                    type="text"
                    id="nacionalidad"
                    disabled
                    value={data.nacionalidad}
                  />
                </div>
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="codigopostal">Código postal</Label>
                  <Input
                    type="text"
                    id="codigopostal"
                    disabled
                    value={data.codigo_postal}
                  />
                </div>
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="domicilio">Domicilio</Label>
                  <Input
                    type="text"
                    id="domicilio"
                    disabled
                    value={data.domicilio}
                  />
                </div>
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    type="text"
                    id="telefono"
                    disabled
                    value={data.telefono}
                  />
                </div>
                <div className="grid w-full  items-center gap-0.5">
                  <Label htmlFor="fechanac">Fecha de nacimiento</Label>
                  <Input
                    type="text"
                    id="fechanac"
                    disabled
                    value={data.fecha_nacimiento}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
