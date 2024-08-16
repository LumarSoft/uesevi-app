import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { DataTable } from "../Categorias/components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";

export default function AntiguasModule({
  empleados,
  empresas,
}: {
  empleados: IEmpleado[];
  empresas: IEmpresa[];
}) {

  const handleView = (empresa: IEmpresa) => {
    console.log("Ver detalles de la empresa:", empresa);
    // Implementa la lógica para mostrar detalles aquí, como abrir un modal
  };

  const columns = createColumns(handleView);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas Antiguas
          </h2>
        </div>
        <p>
          Desde aquí, se podrán acceder a todas las antiguas DDJJ generadas
          previamente a la fecha: <b>28/10/2021</b>
        </p>
        <SearchCard empleados={empleados} empresas={empresas} />
        <DataTable columns={columns} data={empresas} />
      </div>
    </div>
  );
}
