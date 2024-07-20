import { Button } from "@/components/ui/button";
import { DataTable } from "./components/Table/Data-Table";
import { columns } from "./components/Table/Columns";

const AdminEmpresasModule = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
        </div>

        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default AdminEmpresasModule;
