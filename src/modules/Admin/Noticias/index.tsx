import { INoticias } from "@/shared/types/Querys/INoticias";
import { columns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";

export const AdminNoticiasModule = ({ data }: { data: INoticias[] }) => {
  console.log(data);
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Noticias</h2>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default AdminNoticiasModule;
