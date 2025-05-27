"use client";

import SearchCard from "./components/Search/SearchCard";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { DataTable } from "./components/Table/Data-Table";
import { createColumns } from "./components/Table/columns";
import { IDeclaracion } from "@/shared/types/Querys/IDeclaracion";
import { IContratos } from "@/shared/types/Querys/IContratos";
import { useEffect, useState } from "react";
import { fetchData } from "@/services/mysql/functions";
import { Loader2 } from "lucide-react";

export default function DeclaracionesModule({
  companies,
  statements,
}: {
  companies: IEmpresa[];
  statements: IDeclaracion[];
}) {
  const [statementsState, setStatementsState] =
    useState<IDeclaracion[]>(statements);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Recuperar estado desde sessionStorage si existe
    const savedState = sessionStorage.getItem("searchState");
    if (savedState) {
      const { filteredStatements } = JSON.parse(savedState);
      setStatementsState(filteredStatements);
    }
  }, []);

  const changeState = (updatedItem: IDeclaracion) => {
    const newData = statementsState.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setStatementsState(newData);

    // Actualizar el estado guardado en sessionStorage si existe
    const savedState = sessionStorage.getItem("searchState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Actualizar la declaración en las declaraciones filtradas guardadas en sessionStorage
      const updatedFilteredStatements = parsedState.filteredStatements.map(
        (item: IDeclaracion) => (item.id === updatedItem.id ? updatedItem : item)
      );
      
      // Guardar el estado actualizado
      sessionStorage.setItem(
        "searchState",
        JSON.stringify({
          ...parsedState,
          filteredStatements: updatedFilteredStatements,
        })
      );
    }
  };

  const deleteStatement = (id: number) => {
    const newData = statementsState.filter((item) => item.id !== id);
    setStatementsState(newData);
    
    // Actualizar el estado guardado en sessionStorage si existe
    const savedState = sessionStorage.getItem("searchState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Filtrar también las declaraciones guardadas en sessionStorage
      const updatedFilteredStatements = parsedState.filteredStatements.filter(
        (item: IDeclaracion) => item.id !== id
      );
      
      // Guardar el estado actualizado
      sessionStorage.setItem(
        "searchState",
        JSON.stringify({
          ...parsedState,
          filteredStatements: updatedFilteredStatements,
        })
      );
    }
  };

  // Función para recargar los datos desde el servidor
  const reloadData = async () => {
    setIsLoading(true);
    try {
      // Asumiendo que tienes un endpoint para obtener todas las declaraciones
      const result = await fetchData('statements');
      if (result && result.data) {
        setStatementsState(result.data);
      }
    } catch (error) {
      console.error("Error al recargar las declaraciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = createColumns(changeState, deleteStatement);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Declaraciones Juradas
          </h2>
          {isLoading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Cargando datos...</span>
            </div>
          )}
        </div>
        <SearchCard
          companies={companies}
          statements={statements}
          setStatementsState={setStatementsState}
          reloadData={reloadData}
        />
        <DataTable 
          columns={columns} 
          data={statementsState || []} 
        />
      </div>
    </div>
  );
}
