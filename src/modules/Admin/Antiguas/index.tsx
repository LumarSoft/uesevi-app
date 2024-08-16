import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

export default function AntiguasModule({
  empleados,
  empresas,
}: {
  empleados: IEmpleado[];
  empresas: IEmpresa[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas Antiguas
          </h2>
        </div>
        <SearchCard empleados={empleados} empresas={empresas} />
      </div>
    </div>
  );
}
