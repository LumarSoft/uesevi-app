import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Interfaz para props
interface CalculadoraProps {
  interes?: any;
}

// Interfaz para el resultado del cálculo
interface ResultadoCalculo {
  fechaVencimiento: string;
  fechaPago: string;
  diasExcedidos: number;
  valorDeclaracionJurada: number;
  interesAplicado: number;
  montoMulta: number;
  valorFinal: number;
}

export default function CalculadoraModule({
  interes = 0.249,
}: CalculadoraProps) {
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
  const [fechaPago, setFechaPago] = useState<string>("");
  const [usarFechaActual, setUsarFechaActual] = useState<boolean>(false);
  const [valorDeclaracionJurada, setValorDeclaracionJurada] =
    useState<string>("");
  const [resultado, setResultado] = useState<ResultadoCalculo | null>(null);

  const calcularMulta = () => {
    // Validaciones básicas
    if (!fechaVencimiento || !valorDeclaracionJurada) {
      alert("Por favor, complete todos los campos");
      return;
    }

    // Determinar fecha de pago
    const fechaPagoReal = usarFechaActual
      ? new Date().toISOString().split("T")[0]
      : fechaPago;

    if (!fechaPagoReal) {
      alert("Por favor, seleccione una fecha de pago");
      return;
    }

    const vencimiento = new Date(fechaVencimiento);
    const pago = new Date(fechaPagoReal);

    // Calcular días excedidos
    const diasExcedidos = Math.max(
      0,
      Math.ceil(
        (pago.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
      )
    );

    // Si no hay días excedidos, no hay multa
    if (diasExcedidos === 0) {
      setResultado(null);
      alert("No hay días excedidos para calcular multa");
      return;
    }

    // Calcular multa
    const valorDeclaracion = parseFloat(valorDeclaracionJurada);
    const interesAplicado = interes.porcentaje || 5; // Usar prop de interés o valor por defecto

    const montoMulta =
      (diasExcedidos * interesAplicado * valorDeclaracion) / 100;
    const valorFinal = valorDeclaracion + montoMulta;

    setResultado({
      fechaVencimiento: vencimiento.toLocaleDateString(),
      fechaPago: pago.toLocaleDateString(),
      diasExcedidos,
      valorDeclaracionJurada: valorDeclaracion,
      interesAplicado,
      montoMulta: parseFloat(montoMulta.toFixed(2)),
      valorFinal: parseFloat(valorFinal.toFixed(2)),
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Calculadora de Intereses por Mora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Fecha de Vencimiento */}
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="fechaVencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fechaVencimiento"
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                />
              </div>

              {/* Fecha de Pago */}
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label>Fecha de Pago</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="usarFechaActual"
                    checked={usarFechaActual}
                    onCheckedChange={(checked) => setUsarFechaActual(!!checked)}
                  />
                  <Label htmlFor="usarFechaActual">Usar Fecha Actual</Label>
                </div>
                {!usarFechaActual && (
                  <Input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                  />
                )}
              </div>

              {/* Valor Declaración Jurada */}
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="valorDeclaracion">
                  Valor Declaración Jurada
                </Label>
                <Input
                  id="valorDeclaracion"
                  type="number"
                  placeholder="Ingrese el valor"
                  value={valorDeclaracionJurada}
                  onChange={(e) => setValorDeclaracionJurada(e.target.value)}
                />
              </div>

              {/* Botón de Cálculo */}
              <Button onClick={calcularMulta}>Calcular Interes</Button>

              {/* Tabla de Resultados */}
              {resultado && (
                <div className="mt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha Vencimiento</TableHead>
                        <TableHead>Fecha Pago</TableHead>
                        <TableHead>Días Excedidos</TableHead>
                        <TableHead>Interés Aplicado</TableHead>
                        <TableHead>Valor Declaración</TableHead>
                        <TableHead>Interes de la declaracion</TableHead>
                        <TableHead>Valor Final</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{resultado.fechaVencimiento}</TableCell>
                        <TableCell>{resultado.fechaPago}</TableCell>
                        <TableCell>{resultado.diasExcedidos}</TableCell>
                        <TableCell>{resultado.interesAplicado}%</TableCell>
                        <TableCell>
                          ${resultado.valorDeclaracionJurada.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${resultado.montoMulta.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          ${resultado.valorFinal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
