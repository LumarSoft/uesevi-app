import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import React from "react";

export const Info = ({ declaracion }: { declaracion: IDeclaracion }) => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col w-full gap-3">
        <span>Empresa: {declaracion.nombre_empresa}</span>
        <span>Empleados: </span>
        <span>Afiliados: </span>
        <span>Fecha: {declaracion.fecha.toString()}</span>
      </div>
      <div className="flex flex-col w-full gap-3">
        <span>Rectificada: {declaracion.rectificada}</span>
        <span>Fecha de vencimiento: {declaracion.vencimiento}</span>
        <span>Fecha de pago: {declaracion.fecha_pago}</span>
      </div>
    </div>
  );
};
