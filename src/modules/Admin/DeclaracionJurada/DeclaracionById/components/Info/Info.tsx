import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import React from "react";

export const Info = ({ statement }: { statement: IInfoDeclaracion }) => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col w-full gap-3">
        <span>Empresa: {statement.nombre_empresa}</span>
        <span>Empleados: {statement.cantidad_empleados_declaracion}</span>
        <span>Afiliados: {statement.cantidad_afiliados_declaracion}</span>
        <span>
          Fecha: {statement.mes}/{statement.year}
        </span>
      </div>
      <div className="flex flex-col w-full gap-3">
        <span>Rectificada: {statement.rectificada}</span>
        <span>Fecha de vencimiento: {statement.vencimiento}</span>
        <span>Fecha de pago: {statement.fecha_pago}</span>
      </div>
    </div>
  );
};
