import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

const FAS_PERCENTAGE = 0.01; // 1%
const APORTE_SOLIDARIO_PERCENTAGE = 0.02; // 2%
const SINDICATO_PERCENTAGE = 0.03; // 3%

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

export function Total({
  statement,
  rate,
  basicSalary,
}: {
  statement: IInfoDeclaracion;
  rate: any;
  basicSalary: any;
}) {
  const fechaPago = statement.fecha_pago;
  let totalIntereses = 0;
  const employeeData = statement.empleados;
  console.log(employeeData);

  let totalFaz = basicSalary * FAS_PERCENTAGE * employeeData.length;

  let {
    totalAporteSolidario,
    totalSindicato,
    totalNoRemunerativo,
    totalRemunerativoAdicional,
  } = employeeData.reduce(
    (acc, employee) => {
      const montoEmpleado = Number(employee.monto);
      const adicionalEmpleado = Number(employee.adicional);
      const sumaNoRemunerativa = Number(employee.suma_no_remunerativa || 0);
      const remunerativoAdicional = Number(employee.remunerativo_adicional);

      const totalEmployee =
        montoEmpleado +
        adicionalEmpleado +
        sumaNoRemunerativa +
        remunerativoAdicional;

      const aporteSolidario =
        employee.afiliado === "No"
          ? (montoEmpleado + sumaNoRemunerativa + remunerativoAdicional) *
            APORTE_SOLIDARIO_PERCENTAGE
          : 0;

      const sindicato =
        employee.afiliado === "Sí" ? totalEmployee * SINDICATO_PERCENTAGE : 0;

      return {
        totalAporteSolidario: acc.totalAporteSolidario + aporteSolidario,
        totalSindicato: acc.totalSindicato + sindicato,
        totalNoRemunerativo: acc.totalNoRemunerativo + sumaNoRemunerativa,
        totalRemunerativoAdicional:
          acc.totalRemunerativoAdicional + remunerativoAdicional,
      };
    },
    {
      totalAporteSolidario: 0,
      totalSindicato: 0,
      totalNoRemunerativo: 0,
      totalRemunerativoAdicional: 0,
    }
  );

  const vencimiento = new Date(statement.vencimiento);
  let diffDays;

  if (fechaPago) {
    const pagoDate = new Date(fechaPago);
    diffDays = Math.floor(
      (pagoDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else {
    const hoyDate = new Date();
    diffDays = Math.floor(
      (hoyDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Calcular el total sin ajuste, incluyendo suma_no_remunerativa
  const grandTotal =
    totalFaz +
    totalAporteSolidario +
    totalSindicato +
    totalNoRemunerativo +
    totalRemunerativoAdicional;

  // Calcular el ajuste automático
  const importeDeclaracion = Number(statement.subtotal);
  const ajuste =
    importeDeclaracion - (totalFaz + totalAporteSolidario + totalSindicato); // No incluir totalNoRemunerativo en el cálculo del ajuste

  // Crear un array de contribuciones para distribuir el ajuste
  const totalSinAjusteYNoRemunerativo =
    totalFaz + totalAporteSolidario + totalSindicato;
  const contribuciones = [
    {
      nombre: "FAS",
      valor: totalFaz,
      porcentaje: totalFaz / totalSinAjusteYNoRemunerativo,
    },
    {
      nombre: "Aporte Solidario",
      valor: totalAporteSolidario,
      porcentaje: totalAporteSolidario / totalSinAjusteYNoRemunerativo,
    },
    {
      nombre: "Sindicato",
      valor: totalSindicato,
      porcentaje: totalSindicato / totalSinAjusteYNoRemunerativo,
    },
  ];

  // Distribuir el ajuste de manera precisa
  const contribucionesAjustadas = contribuciones.map((contribucion) => {
    const ajusteContribucion = ajuste * contribucion.porcentaje;
    return {
      ...contribucion,
      valorAjustado: contribucion.valor + ajusteContribucion,
    };
  });

  // Extraer valores ajustados
  const totalFazAjustado = contribucionesAjustadas[0].valorAjustado;
  const totalAporteSolidarioAjustado = contribucionesAjustadas[1].valorAjustado;
  const totalSindicatoAjustado = contribucionesAjustadas[2].valorAjustado;

  // Agregar el totalNoRemunerativo al grand total ajustado
  const grandTotalAjustado =
    totalFazAjustado + totalAporteSolidarioAjustado + totalSindicatoAjustado;

  // Calcular intereses solo si la declaración está vencida
  if (diffDays > 0) {
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    totalIntereses = (grandTotalAjustado * interes) / 100;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Resumen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid 2xl:grid-cols-7 grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">FAS</h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalFazAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Aporte Solidario
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalAporteSolidarioAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Sindicato
            </h3>
            <p className="text-2xl font-bold">
              {formatCurrency(totalSindicatoAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">TOTAL</h3>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(grandTotalAjustado)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Intereses
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(totalIntereses)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total a pagar
            </h3>
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(grandTotalAjustado + totalIntereses)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
