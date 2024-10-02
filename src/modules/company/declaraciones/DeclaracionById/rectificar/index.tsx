import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";
import { InputFile } from "./components/InputFile";
import { ChargeAlert } from "./components/ChargeAlert";

export const RectificarModule = ({
  statement,
}: {
  statement: IInfoDeclaracion;
}) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Rectificar</h2>
        </div>
        <InputFile statement={statement}/>
        <ChargeAlert />
      </div>
    </div>
  );
};
