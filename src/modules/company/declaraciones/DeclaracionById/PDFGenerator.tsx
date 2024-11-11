import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  BlobProvider,
} from "@react-pdf/renderer";
import {
  IInfoDeclaracion,
  Empleado,
} from "@/shared/types/Querys/IInfoDeclaracion";
import { Button } from "@/components/ui/button";

interface PDFGeneratorProps {
  data: IInfoDeclaracion;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 7,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
  },
  infoGrid: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    borderBottom: 1,
    paddingBottom: 10,
  },
  infoColumn: {
    flex: 1,
    marginRight: 20,
  },
  infoRow: {
    marginBottom: 8,
    fontSize: 10,
  },
  label: {
    fontFamily: "Helvetica-Bold",
    marginRight: 5,
  },
  value: {
    fontFamily: "Helvetica",
  },
  warningText: {
    color: "red",
    marginLeft: 5,
  },
  successText: {
    color: "green",
    marginLeft: 5,
  },
  tableContainer: {
    display: "flex",
    width: "auto",
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCol: {
    width: "6.5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  tableColWide: {
    width: "9%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 2,
  },
  summarySection: {
    marginTop: 0,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryGrid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryItem: {
    flex: 1,
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 8,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
  },
  summaryValuePrimary: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0066cc",
  },
  summaryValueDanger: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#dc2626",
  },
});

const MyDocument: React.FC<{
  data: IInfoDeclaracion;
  rate: any;
  basicSalary: any;
}> = ({ data, rate, basicSalary }) => {
  const calcularTotalBruto = (empleado: Empleado): number => {
    return Number(empleado.monto) + Number(empleado.adicional);
  };

  const calcularFAS = (basicSalary: number): number => {
    return basicSalary * 0.01;
  };

  const calcularAporteSolidario = (empleado: Empleado): number => {
    return empleado.afiliado === "No" ? Number(empleado.monto) * 0.02 : 0;
  };

  const calcularSindicato = (empleado: Empleado): number => {
    return empleado.afiliado === "Sí"
      ? (Number(empleado.monto) + Number(empleado.adicional)) * 0.03
      : 0;
  };

  const calcularTotal = (empleado: Empleado, basicSalary: number): number => {
    const fas = calcularFAS(basicSalary);
    const aporteSolidario = calcularAporteSolidario(empleado);
    const sindicato = calcularSindicato(empleado);
    return fas + aporteSolidario + sindicato;
  };

  const FAS_PERCENTAGE = 0.01;
  const APORTE_SOLIDARIO_PERCENTAGE = 0.02;
  const SINDICATO_PERCENTAGE = 0.03;

  // Cálculos del resumen
  const totalFaz = basicSalary * FAS_PERCENTAGE * data.empleados.length;

  const { totalAporteSolidario, totalSindicato } = data.empleados.reduce(
    (acc, employee) => {
      const totalEmployee = Number(employee.monto) + Number(employee.adicional);

      const aporteSolidario =
        employee.afiliado === "No"
          ? Number(employee.monto) * APORTE_SOLIDARIO_PERCENTAGE
          : 0;

      const sindicato =
        employee.afiliado === "Sí" ? totalEmployee * SINDICATO_PERCENTAGE : 0;

      return {
        totalAporteSolidario: acc.totalAporteSolidario + aporteSolidario,
        totalSindicato: acc.totalSindicato + sindicato,
      };
    },
    { totalAporteSolidario: 0, totalSindicato: 0 }
  );

  const grandTotal = totalFaz + totalAporteSolidario + totalSindicato;

  // Cálculo de intereses
  const vencimiento = new Date(data.vencimiento);
  let diffDays;
  if (data.fecha_pago) {
    const pagoDate = new Date(data.fecha_pago);
    diffDays = Math.floor(
      (pagoDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  } else {
    const hoyDate = new Date();
    diffDays = Math.floor(
      (hoyDate.getTime() - vencimiento.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  let totalIntereses = 0;
  if (diffDays > 0) {
    const tasaInteres = parseFloat(rate.porcentaje);
    const interes = tasaInteres * diffDays;
    totalIntereses = (grandTotal * interes) / 100;
  }

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>
          Declaración Empresa: {data.nombre_empresa}
        </Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Empleados:</Text>
                <Text style={styles.value}>
                  {data.cantidad_empleados_declaracion}
                </Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Afiliados:</Text>
                <Text style={styles.value}>
                  {data.cantidad_afiliados_declaracion}
                </Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.value}>
                  {data.mes}/{data.year}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Rectificada:</Text>
                <Text style={styles.value}>{data.rectificada}</Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Vencimiento:</Text>
                <Text style={styles.value}>{formatDate(data.vencimiento)}</Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Fecha de pago:</Text>
                <Text style={styles.value}>{formatDate(data.fecha_pago)}</Text>
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text>
                <Text style={styles.label}>Pago parcial:</Text>
                <Text style={styles.value}>{data.pago_parcial || "N/A"}</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.summarySection}>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>FAS</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(totalFaz)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Aporte Solidario</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(totalAporteSolidario)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sindicato</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(totalSindicato)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>TOTAL</Text>
              <Text style={styles.summaryValuePrimary}>
                {formatCurrency(grandTotal)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Intereses</Text>
              <Text style={styles.summaryValueDanger}>
                {formatCurrency(totalIntereses)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableColWide}>
                <Text>Nombre</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Afiliado</Text>
              </View>
              <View style={styles.tableColWide}>
                <Text>CUIL</Text>
              </View>
              <View style={styles.tableColWide}>
                <Text>Categoría</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Rem. adic.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>No remun.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Ap. extra</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Sueldo básico</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Adicional</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>T. bruto</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>FAS</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Ap. sol.</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Sindicato</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Total</Text>
              </View>
            </View>

            {data.empleados.map((empleado, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.tableColWide}>
                  <Text>{empleado.nombre_completo}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{empleado.afiliado}</Text>
                </View>
                <View style={styles.tableColWide}>
                  <Text>{empleado.cuil}</Text>
                </View>
                <View style={styles.tableColWide}>
                  <Text>{empleado.categoria}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {formatCurrency(Number(empleado.remunerativo_adicional))}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {formatCurrency(Number(empleado.suma_no_remunerativa))}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(0)}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(Number(empleado.monto))}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(Number(empleado.adicional))}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(calcularTotalBruto(empleado))}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(calcularFAS(data.sueldo_basico))}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {formatCurrency(calcularAporteSolidario(empleado))}
                  </Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{formatCurrency(calcularSindicato(empleado))}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>
                    {formatCurrency(
                      calcularTotal(empleado, data.sueldo_basico)
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

interface PDFGeneratorProps {
  data: IInfoDeclaracion;
  rate: any;
  basicSalary: any;
}

export const PDFDownloadComponent: React.FC<PDFGeneratorProps> = ({
  data,
  rate,
  basicSalary,
}) => {
  return (
    <BlobProvider
      document={
        <MyDocument data={data} rate={rate} basicSalary={basicSalary} />
      }
    >
      {({ blob, url, loading }) => (
        <Button
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (url) {
              const link = document.createElement("a");
              link.href = url;
              link.download = `declaracion-${data.nombre_empresa}-${data.year}-${data.mes}.pdf`;
              link.click();
            }
          }}
        >
          {loading ? "Generando PDF..." : "Descargar PDF"}
        </Button>
      )}
    </BlobProvider>
  );
};
