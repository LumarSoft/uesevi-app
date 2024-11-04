import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import React from "react";

export const Info = ({ statement }: { statement: IInfoDeclaracion }) => {
  // Función para formatear las fechas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        <span>
          Fecha de vencimiento: {formatDate(statement.vencimiento)}.
          {new Date(statement.vencimiento) < new Date() && (
            <span className="text-red-500">
              {" "}
              Lleva vencida:{" "}
              {Math.floor(
                (new Date().getTime() - new Date(statement.vencimiento).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              días
            </span>
          )}
        </span>
        <span>
          Fecha de pago:{" "}
          {statement.fecha_pago
            ? formatDate(statement.fecha_pago)
            : "No disponible"}
        </span>
        <span>
          Pago parcial:{" "}
          {statement.pago_parcial ? `$${statement.pago_parcial}` : ""}
        </span>
      </div>
    </div>
  );
};
