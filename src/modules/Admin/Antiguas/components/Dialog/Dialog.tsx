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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { Label } from "@radix-ui/react-label";
import { Eye } from "lucide-react";

import React from "react";

export const DialogComponent = ({ data }: { data: IEmpresa }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          Ver <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex">
        <div className="w-full">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              INFORMACION
            </DialogTitle>
          
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="name">Nombre de la empresa</Label>
              <Input type="text" id="name" disabled value={data.nombre} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="cuit">CUIT</Label>
              <Input type="text" id="cuit" disabled value={data.cuit} />
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
              <Input type="text" id="telefono" disabled value={data.telefono} />
            </div>
            <div className="grid w-full  items-center gap-0.5">
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input
                type="text"
                id="ciudad"
                disabled
                value={data.ciudad}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-between">
          <div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold">
                CONTACTO
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="grid w-full  items-center gap-0.5">
                <Label htmlFor="nombre-contacto">Nombre</Label>
                <Input type="text" id="nombre-contacto" disabled value={data.nombre_usuario}/>
              </div>
              <div className="grid w-full  items-center gap-0.5">
                <Label htmlFor="apellido-contacto">Apellido</Label>
                <Input type="text" id="apellido-contacto" disabled value={data.apellido}/>
              </div>
              <div className="grid w-full  items-center gap-0.5">
                <Label htmlFor="apellido-contacto">Telefono</Label>
                <Input type="text" id="apellido-contacto" disabled value={data.telefono_usuario}/>
              </div>
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold">
              Datos para acceder
            </DialogTitle>
          </DialogHeader>

          <div className="grid w-full  items-center gap-0.5">
            <Label htmlFor="nombre-contacto">Email</Label>
            <Input
              type="text"
              id="nombre-contacto"
              disabled
              value={data.email_contacto}
            />
          </div>
          <div className="grid w-full  items-center gap-0.5">
            <Label htmlFor="nombre-contacto">Estado</Label>
            <Input
              type="text"
              id="nombre-contacto"
              disabled
              value={data.estado}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
