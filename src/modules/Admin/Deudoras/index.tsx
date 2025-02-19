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
import { fetchData } from "@/services/mysql/functions";
import { DebtorCompany } from "@/shared/types/DebtorCompany";

export default function DeudorasSection() {
  const [debtorCompanies, setDebtorCompanies] = useState<DebtorCompany[]>([]);

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
        } else {
          console.error("Expected an array but got:", result.data);
          setDebtorCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching debtor companies:", error);
      }
    };

    fetchDebtorCompanies();
  }, []);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Empresas Deudoras</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Nombre</TableHead>
              <TableHead className="font-bold">CUIT</TableHead>
              <TableHead className="font-bold">Deuda Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtorCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.nombre}</TableCell>
                <TableCell>{company.cuit}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(company.total_deuda)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
