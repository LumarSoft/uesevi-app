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

interface DebtorCompany {
  id: number;
  nombre: string;
  cuit: string;
  total_deuda: number;
}

export default function DeudorasSection() {
  const [debtorCompanies, setDebtorCompanies] = useState<DebtorCompany[]>([]);

  useEffect(() => {
    const fetchDebtorCompanies = async () => {
      try {
        const response = await fetchData("statements/deudoras-company");
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDebtorCompanies(data.data);
      } catch (error) {
        console.error("Error fetching debtor companies", error);
      }
    };

    fetchDebtorCompanies();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Empresas Deudoras</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>CUIT</TableHead>
              <TableHead>Deuda Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {debtorCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.nombre}</TableCell>
                <TableCell>{company.cuit}</TableCell>
                <TableCell>${company.total_deuda.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
