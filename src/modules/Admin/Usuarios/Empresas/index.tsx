"use client";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/Columns";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const AdminEmpresasModule = ({ data }: { data: IEmpresa[] }) => {
  const [companies, setCompanies] = useState(data);
  const [searchName, setSearchName] = useState("");
  const [searchCUIT, setSearchCUIT] = useState("");

  const handleUpdate = (updatedItem: IEmpresa) => {
    const newData = companies.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCompanies(newData);
  };

  const handleDelete = (deleteItem: IEmpresa) => {
    const newData = companies.filter((item) => item.id !== deleteItem.id);
    setCompanies(newData);
  };

  const filteredCompanies = companies.filter((company) => {
    const normalizedSearchName = searchName.trim().toLowerCase();
    const normalizedSearchCUIT = searchCUIT.trim();

    const nameMatch = company.nombre
      .toLowerCase()
      .includes(normalizedSearchName);
    const cuitMatch = company.cuit?.toString().includes(normalizedSearchCUIT);
    return nameMatch && cuitMatch;
  });

  const columns = createColumns(handleUpdate, handleDelete);

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Empresas</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Input para buscar por nombre */}
          <Input
            type="text"
            placeholder="Buscar por nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full md:w-auto"
          />

          {/* Input para buscar por CUIT */}
          <Input
            type="text"
            placeholder="Buscar por CUIT"
            value={searchCUIT}
            onChange={(e) => setSearchCUIT(e.target.value)}
            className="w-full md:w-auto"
          />
        </div>
        <DataTable
          columns={columns}
          data={filteredCompanies}
          filterColumn="nombre"
        />
      </div>
    </div>
  );
};

export default AdminEmpresasModule;
