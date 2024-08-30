import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import React from "react";

export const Info = ({ declaracion }: { declaracion: IInfoDeclaracion }) => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col w-full gap-3">
        <span>Empresa: {declaracion.nombre_empresa}</span>
        <span>Empleados: {declaracion.cantidad_empleados_declaracion}</span>
        <span>Afiliados: {declaracion.cantidad_afiliados_declaracion}</span>
        <span>
          Fecha: {declaracion.mes}/{declaracion.year}
        </span>
      </div>
      <div className="flex flex-col w-full gap-3">
        <span>Rectificada: {declaracion.rectificada}</span>
        <span>Fecha de vencimiento: {declaracion.vencimiento}</span>
        <span>Fecha de pago: {declaracion.fecha_pago}</span>
      </div>
    </div>
  );
};
