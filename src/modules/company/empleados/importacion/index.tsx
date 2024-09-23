import { ChargeAlert } from "./components/ChargeAlert";
import { InputFile } from "./components/InputFile";

export default function ImportacionEmpleadosModule() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Importacion masiva
          </h2>
        </div>
        <InputFile />
        <ChargeAlert />
      </div>
    </div>
  );
}
