import { IOldDeclaracion } from "@/shared/types/Querys/IOldDeclaracion";
import React from "react";

export const Info = ({ declaracion }: { declaracion: IOldDeclaracion }) => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col w-full gap-3">
      <span>
          Fecha: {declaracion.mes}/{declaracion.year}
        </span>
      </div>
    </div>
  );
};
