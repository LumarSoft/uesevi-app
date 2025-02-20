import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/services/mysql/functions";
import { DebtorCompany } from "@/shared/types/DebtorCompany";
import { SearchX } from "lucide-react"; // Importamos el ícono

export default function DeudorasSection() {
  const [debtorCompanies, setDebtorCompanies] = useState<DebtorCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<DebtorCompany[]>(
    []
  );
  const [nameFilter, setNameFilter] = useState("");

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  useEffect(() => {
    const fetchDebtorCompanies = async () => {
      try {
        const result = await fetchData("statements/deudoras-company");
        console.log("Result from fetchData:", result);

        if (!result.ok) {
          throw new Error(result.message || "Error fetching debtor companies");
        }

        if (Array.isArray(result.data)) {
          setDebtorCompanies(result.data);
          setFilteredCompanies(result.data);
        } else {
          console.error("Expected an array but got:", result.data);
          setDebtorCompanies([]);
          setFilteredCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching debtor companies:", error);
      }
    };

    fetchDebtorCompanies();
  }, []);

  useEffect(() => {
    if (nameFilter === "") {
      setFilteredCompanies(debtorCompanies);
    } else {
      const filtered = debtorCompanies.filter((company) =>
        company.nombre.toLowerCase().includes(nameFilter.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [nameFilter, debtorCompanies]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Empresas Deudoras</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar por nombre"
            value={nameFilter}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">CUIT</TableHead>
              <TableHead className="font-bold">Deuda Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>{company.nombre}</TableCell>
                  <TableCell>{company.cuit}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(company.total_deuda)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <SearchX className="h-12 w-12 mb-2 text-gray-400" />
                    <p className="text-lg font-medium">Sin resultados</p>
                    <p className="text-sm">
                      No se encontraron empresas que coincidan con tu búsqueda
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
