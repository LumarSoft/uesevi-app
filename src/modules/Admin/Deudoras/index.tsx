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
import { SearchX, ArrowUpDown } from "lucide-react"; // Added ArrowUpDown icon
import { Button } from "@/components/ui/button"; // Added Button import

export default function DeudorasSection() {
  const [debtorCompanies, setDebtorCompanies] = useState<DebtorCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<DebtorCompany[]>(
    []
  );
  const [nameFilter, setNameFilter] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Added sort direction state

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Function to sort companies
  const sortCompanies = (
    companies: DebtorCompany[],
    direction: "asc" | "desc"
  ) => {
    return [...companies].sort((a, b) => {
      // Eliminar espacios en blanco al principio y final antes de comparar
      const nameA = a.nombre.trim();
      const nameB = b.nombre.trim();
      const comparison = nameA.localeCompare(nameB, "es", {
        sensitivity: "base",
      });
      return direction === "asc" ? comparison : -comparison;
    });
  };

  // Toggle sort direction
  const toggleSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setFilteredCompanies(sortCompanies(filteredCompanies, newDirection));
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
          // Sort companies when they are first loaded
          const sortedCompanies = sortCompanies(result.data, sortDirection);
          setDebtorCompanies(sortedCompanies);
          setFilteredCompanies(sortedCompanies);
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
      // Apply sorting when filter is cleared
      setFilteredCompanies(sortCompanies(debtorCompanies, sortDirection));
    } else {
      const filtered = debtorCompanies.filter((company) =>
        company.nombre.toLowerCase().includes(nameFilter.toLowerCase())
      );
      // Apply sorting to filtered results
      setFilteredCompanies(sortCompanies(filtered, sortDirection));
    }
  }, [nameFilter, debtorCompanies, sortDirection]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Empresas Deudoras</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filtrar por nombre"
            value={nameFilter}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSort}
            className="ml-auto flex items-center gap-1"
          >
            Ordenar {sortDirection === "asc" ? "A-Z" : "Z-A"}
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleSort}
                >
                  Nombre
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
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
