import { IOldInfoDeclaracion } from "@/shared/types/Querys/IOldInfoDeclaracion";
import React from "react";

export const Info = ({ declaracion }: { declaracion: IOldInfoDeclaracion }) => {
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
