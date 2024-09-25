import { IInquiry } from "@/shared/types/Querys/IInquiry";
import { columns } from "./components/Table/Columns";
import { DataTable } from "./components/Table/Data-Table";

export default function ConsultasModule({
  inquiries,
}: {
  inquiries: IInquiry[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Consultas</h2>
        </div>

        <DataTable columns={columns} data={inquiries} />
      </div>
    </div>
  );
}
