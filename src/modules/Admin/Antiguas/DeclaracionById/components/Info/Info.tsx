import { IOldInfoDeclaracion } from "@/shared/types/Querys/IOldInfoDeclaracion";
import React from "react";

export const Info = ({ statement }: { statement: IOldInfoDeclaracion }) => {
  return (
    <div className="w-full flex">
      <div className="flex flex-col w-full gap-3">
      <span>
          Fecha: {statement.mes}/{statement.year}
        </span>
      </div>
    </div>
  );
};
