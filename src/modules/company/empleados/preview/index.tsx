"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  AlertCircle,
  FileSpreadsheet,
  Edit3,
  ExternalLink 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CATEGORIAS_PERMITIDAS } from "../importacion/constants/excelSchema";

// Tipo para los datos de empleado
interface EmpleadoData {
  cuil: string;
  nombre: string;
  apellido: string;
  categora: string;
  sueldo_bsico: number;
  adicionales: number;
  ad_remunerativo: number;
  suma_no_remunerativa?: number; // Campo opcional para compatibilidad
  adherido_a_sindicato: string;
}

// Función para formatear números como moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
};

// Funciones de cálculo
const calculateTotalBruto = (empleado: EmpleadoData) => {
  return Number(empleado.sueldo_bsico) + 
         Number(empleado.adicionales) + 
         Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
         Number(empleado.ad_remunerativo);
};

const calculateFAS = (basicSalary: number = 100000) => {
  // 1% del sueldo básico de la categoría
  return basicSalary * 0.01;
};

const calculateAporteSolidario = (empleado: EmpleadoData) => {
  // 2% del (sueldo_básico + suma_no_remunerativa + remunerativo_adicional) solo para no afiliados
  if (empleado.adherido_a_sindicato === "no") {
    const total = Number(empleado.sueldo_bsico) + 
                  Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
                  Number(empleado.ad_remunerativo);
    return total * 0.02;
  }
  return 0;
};

const calculateSindicato = (empleado: EmpleadoData) => {
  // 3% del (sueldo_básico + adicionales + suma_no_remunerativa + remunerativo_adicional) solo para afiliados
  if (empleado.adherido_a_sindicato === "si") {
    const total = Number(empleado.sueldo_bsico) + 
                  Number(empleado.adicionales) + 
                  Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
                  Number(empleado.ad_remunerativo);
    return total * 0.03;
  }
  return 0;
};

const calculateTotal = (empleado: EmpleadoData, basicSalary: number = 100000) => {
  const fas = calculateFAS(basicSalary);
  const aporteSolidario = calculateAporteSolidario(empleado);
  const sindicato = calculateSindicato(empleado);
  return fas + aporteSolidario + sindicato;
};

export const PreviewEmpleados = () => {
  const [empleadosData, setEmpleadosData] = useState<EmpleadoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [isTableWindowOpen, setIsTableWindowOpen] = useState(false);
  const [tableWindowRef, setTableWindowRef] = useState<Window | null>(null);
  const { user } = userStore();
  const router = useRouter();

  // Cargar datos del sessionStorage al montar el componente
  useEffect(() => {
    const storedData = sessionStorage.getItem('empleados_preview_data');
    const storedMonth = sessionStorage.getItem('empleados_preview_month');
    const storedYear = sessionStorage.getItem('empleados_preview_year');

    if (storedData && storedMonth && storedYear) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Normalizar datos para adherido_a_sindicato
        const normalizedData = parsedData.map((empleado: any) => ({
          ...empleado,
          adherido_a_sindicato: String(empleado.adherido_a_sindicato).toLowerCase() === 'si' || 
                                String(empleado.adherido_a_sindicato).toLowerCase() === 'true' || 
                                String(empleado.adherido_a_sindicato) === '1' ? 'si' : 'no',
          suma_no_remunerativa: Number(empleado.suma_no_remunerativa) || 0 // Asegurar que siempre sea 0 para importaciones
        }));
        
        setEmpleadosData(normalizedData);
        setMonth(parseInt(storedMonth));
        setYear(parseInt(storedYear));
      } catch (error) {
        console.error('Error al parsear datos del sessionStorage:', error);
        toast.error('Error al cargar los datos. Regresando a importación.');
        router.push('/empresa/empleados/importacion');
      }
    } else {
      toast.error('No se encontraron datos para mostrar. Regresando a importación.');
      router.push('/empresa/empleados/importacion');
    }

    // Verificar si ya hay una ventana de edición abierta al cargar
    const isWindowOpen = localStorage.getItem('empleados_table_window_open') === 'true';
    console.log('Verificación inicial - localStorage:', localStorage.getItem('empleados_table_window_open'), 'isWindowOpen:', isWindowOpen);
    setIsTableWindowOpen(isWindowOpen);
  }, [router]);



  // Escuchar cambios en localStorage para detectar cuando se cierra la ventana de edición
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'empleados_table_window_open') {
        const isOpen = e.newValue === 'true';
        setIsTableWindowOpen(isOpen);
        if (!isOpen) {
          setTableWindowRef(null);
        }
      }
    };

    // Polling para verificar el estado cada segundo
    const interval = setInterval(() => {
      const isWindowOpen = localStorage.getItem('empleados_table_window_open') === 'true';
      console.log('Polling - localStorage value:', localStorage.getItem('empleados_table_window_open'), 'isWindowOpen:', isWindowOpen);
      setIsTableWindowOpen(isWindowOpen);
      
      // Si tenemos una referencia a la ventana, verificar si está cerrada
      if (tableWindowRef && tableWindowRef.closed) {
        console.log('Ventana cerrada detectada por polling');
        setIsTableWindowOpen(false);
        setTableWindowRef(null);
        localStorage.removeItem('empleados_table_window_open');
      }
    }, 1000);

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [tableWindowRef]);

  // Función para enviar datos a la API
  const sendJson = async (data: any[]): Promise<boolean> => {
    if (month === null || year === null) {
      toast.error("Error: mes y año no definidos");
      return false;
    }

    const formData = new FormData();

    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        formData.append(`employees[${index}][${key}]`, value as any);
      });
    });

    formData.append("companyId", user.empresa.id);
    formData.append("month", month.toString());
    formData.append("year", year.toString());

    try {
      const result = await postData("employees/import", formData);
      if (result.ok) {
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      toast.error("Error al enviar los datos a la API");
      return false;
    }
  };

  // Función para validar los datos antes de enviar
  const validateData = (data: EmpleadoData[]) => {
    const errors: string[] = [];

    data.forEach((empleado, index) => {
      const rowNumber = index + 1;

      // Convertir a string antes de validar
      const cuilStr = String(empleado.cuil || '');
      const nombreStr = String(empleado.nombre || '');
      const apellidoStr = String(empleado.apellido || '');
      const categoriaStr = String(empleado.categora || '');

      if (!cuilStr || cuilStr.trim() === "") {
        errors.push(`Fila ${rowNumber}: El CUIL no puede estar vacío`);
      } else if (!/^\d+$/.test(cuilStr.trim())) {
        errors.push(`Fila ${rowNumber}: El CUIL debe contener solo números`);
      }

      if (!nombreStr || nombreStr.trim() === "") {
        errors.push(`Fila ${rowNumber}: El nombre no puede estar vacío`);
      }

      if (!apellidoStr || apellidoStr.trim() === "") {
        errors.push(`Fila ${rowNumber}: El apellido no puede estar vacío`);
      }

      if (!categoriaStr || categoriaStr.trim() === "") {
        errors.push(`Fila ${rowNumber}: La categoría no puede estar vacía`);
      } else if (!CATEGORIAS_PERMITIDAS.includes(categoriaStr.trim())) {
        errors.push(`Fila ${rowNumber}: La categoría "${empleado.categora}" no es válida`);
      }

      if (isNaN(Number(empleado.sueldo_bsico)) || Number(empleado.sueldo_bsico) < 0) {
        errors.push(`Fila ${rowNumber}: El sueldo básico debe ser un número válido mayor o igual a 0`);
      }

      if (isNaN(Number(empleado.adicionales)) || Number(empleado.adicionales) < 0) {
        errors.push(`Fila ${rowNumber}: Los adicionales deben ser un número válido mayor o igual a 0`);
      }

      if (isNaN(Number(empleado.ad_remunerativo)) || Number(empleado.ad_remunerativo) <= 0) {
        errors.push(`Fila ${rowNumber}: El adicional remunerativo debe ser un número positivo mayor a 0`);
      }

      const sindicatoValue = String(empleado.adherido_a_sindicato).toLowerCase();
      if (sindicatoValue !== "si" && sindicatoValue !== "no") {
        errors.push(`Fila ${rowNumber}: Adherido a sindicato debe ser Sí o No`);
      }
    });

    return errors;
  };

  // Función eliminada - Ya no se permite envío directo
  // Los usuarios deben pasar obligatoriamente por la tabla de edición

  // Función para volver a la importación
  const handleBackToImport = () => {
    sessionStorage.removeItem('empleados_preview_data');
    sessionStorage.removeItem('empleados_preview_month');
    sessionStorage.removeItem('empleados_preview_year');
    
    router.push('/empresa/empleados/importacion');
  };

  // Función para abrir la tabla en nueva pestaña
  const handleOpenTableInNewTab = () => {
    // Si ya hay una ventana abierta, no hacer nada (el botón estará deshabilitado)
    if (isTableWindowOpen && tableWindowRef && !tableWindowRef.closed) {
      return;
    }

    const url = `/empleados-preview-table`;
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      setTableWindowRef(newWindow);
      setIsTableWindowOpen(true);
      localStorage.setItem('empleados_table_window_open', 'true');
      
      console.log('Nueva ventana abierta, estado actualizado:', true);
      
      // Verificar inmediatamente si la ventana se abrió correctamente
      setTimeout(() => {
        if (newWindow.closed) {
          setIsTableWindowOpen(false);
          setTableWindowRef(null);
          localStorage.removeItem('empleados_table_window_open');
          console.log('Ventana cerrada inmediatamente');
        }
      }, 100);
    } else {
      console.log('No se pudo abrir la ventana');
    }
  };

  // Estado para el sueldo básico real
  const [basicSalary, setBasicSalary] = useState<number>(100000);

  // Función para obtener el sueldo básico real de la API
  const fetchBasicSalary = async () => {
    try {
      console.log('🔍 PREVIEW - Obteniendo Basic Salary desde API...');
      console.log('🔍 PREVIEW - API URL:', process.env.NEXT_PUBLIC_BASE_API_URL);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/basicSalary`);
      console.log('🔍 PREVIEW - Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 PREVIEW - Response data:', result);
        
        if (result.ok && result.data && result.data.length > 0) {
          const realBasicSalary = result.data[0].sueldo_basico || 100000;
          setBasicSalary(realBasicSalary);
          console.log('🔍 PREVIEW - Basic Salary obtenido de API:', realBasicSalary);
        } else {
          console.warn('🔍 PREVIEW - API response no válida:', result);
          console.log('🔍 PREVIEW - Usando valor por defecto:', 100000);
        }
      } else {
        console.error('🔍 PREVIEW - Error HTTP:', response.status, response.statusText);
        console.log('🔍 PREVIEW - Usando valor por defecto:', 100000);
      }
    } catch (error) {
      console.error('🔍 PREVIEW - Error al obtener sueldo básico:', error);
      console.log('🔍 PREVIEW - Usando valor por defecto:', 100000);
      // Mantener valor por defecto
    }
  };

  // Obtener basicSalary al cargar el componente
  useEffect(() => {
    fetchBasicSalary();
  }, []);

  // Función para simular el cálculo como lo haría las declaraciones finales
  const calculateTotalsLikeDeclaraciones = () => {
    console.log('🔍 PREVIEW - === SIMULACIÓN DECLARACIONES ===');
    
    // Simular la estructura de datos de las declaraciones
    const simulatedEmployeeData = empleadosData.map(empleado => ({
      nombre_completo: `${empleado.apellido}, ${empleado.nombre}`,
      afiliado: empleado.adherido_a_sindicato === "si" ? "Sí" : "No",
      monto: Number(empleado.sueldo_bsico),           // sueldo_bsico → monto
      adicional: Number(empleado.adicionales),        // adicionales → adicional  
      suma_no_remunerativa: Number(empleado.suma_no_remunerativa || 0), // suma_no_remunerativa → suma_no_remunerativa
      remunerativo_adicional: Number(empleado.ad_remunerativo), // ad_remunerativo → remunerativo_adicional
    }));

    console.log('🔍 PREVIEW - Datos simulados como declaraciones (primeros 3):', simulatedEmployeeData.slice(0, 3));

    // Cálculos exactos como en declaraciones
    const FAS_PERCENTAGE = 0.01;
    const APORTE_SOLIDARIO_PERCENTAGE = 0.02;
    const SINDICATO_PERCENTAGE = 0.03;

    let totalFaz = basicSalary * FAS_PERCENTAGE * simulatedEmployeeData.length;

    let { totalAporteSolidario, totalSindicato } = simulatedEmployeeData.reduce(
      (acc, employee, index) => {
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

        if (index < 3) {
          console.log(`🔍 PREVIEW - Simulación Empleado ${index + 1}:`, {
            nombre: employee.nombre_completo,
            monto: montoEmpleado,
            adicional: adicionalEmpleado,
            suma_no_remunerativa: sumaNoRemunerativa,
            remunerativo_adicional: remunerativoAdicional,
            afiliado: employee.afiliado,
            totalEmployee: totalEmployee,
            aporteSolidario: aporteSolidario,
            sindicato: sindicato
          });
        }

        return {
          totalAporteSolidario: acc.totalAporteSolidario + aporteSolidario,
          totalSindicato: acc.totalSindicato + sindicato,
        };
      },
      { totalAporteSolidario: 0, totalSindicato: 0 }
    );

    const grandTotalSimulated = totalFaz + totalAporteSolidario + totalSindicato;

    console.log('🔍 PREVIEW - TOTALES SIMULADOS COMO DECLARACIONES:', {
      totalFAS: totalFaz,
      totalAporteSolidario,
      totalSindicato,
      grandTotal: grandTotalSimulated
    });

    return {
      totalFAS: totalFaz,
      totalAporteSolidario,
      totalSindicato,
      grandTotal: grandTotalSimulated
    };
  };

  // Calcular totales originales
  const calculateTotals = () => {
    console.log('🔍 PREVIEW - Calculando totales con basicSalary:', basicSalary);
    console.log('🔍 PREVIEW - Número de empleados:', empleadosData.length);
    
    let totalFAS = empleadosData.length * calculateFAS(basicSalary);
    let totalAporteSolidario = 0;
    let totalSindicato = 0;
    let totalBruto = 0;

    console.log('🔍 PREVIEW - FAS por empleado:', calculateFAS(basicSalary));
    console.log('🔍 PREVIEW - Total FAS:', totalFAS);

    empleadosData.forEach((empleado, index) => {
      const bruto = calculateTotalBruto(empleado);
      const solidario = calculateAporteSolidario(empleado);
      const sindicato = calculateSindicato(empleado);
      
      totalBruto += bruto;
      totalAporteSolidario += solidario;
      totalSindicato += sindicato;

      if (index < 3) { // Debug solo primeros 3 empleados
        console.log(`🔍 PREVIEW - Empleado ${index + 1}:`, {
          nombre: `${empleado.nombre} ${empleado.apellido}`,
          sueldo_basico: empleado.sueldo_bsico,
          adicionales: empleado.adicionales,
          ad_remunerativo: empleado.ad_remunerativo,
          suma_no_remunerativa: empleado.suma_no_remunerativa || 0,
          adherido_sindicato: empleado.adherido_a_sindicato,
          totalBruto: bruto,
          aporteSolidario: solidario,
          sindicato: sindicato
        });
      }
    });

    const grandTotal = totalFAS + totalAporteSolidario + totalSindicato;

    console.log('🔍 PREVIEW - TOTALES FINALES:', {
      totalFAS,
      totalAporteSolidario,
      totalSindicato,
      totalBruto,
      grandTotal
    });

    // Ejecutar también la simulación para comparar
    const simulatedTotals = calculateTotalsLikeDeclaraciones();
    
    console.log('🔍 PREVIEW - === COMPARACIÓN TOTALES ===');
    console.log('🔍 PREVIEW - Diferencia FAS:', totalFAS - simulatedTotals.totalFAS);
    console.log('🔍 PREVIEW - Diferencia Aporte Solidario:', totalAporteSolidario - simulatedTotals.totalAporteSolidario);
    console.log('🔍 PREVIEW - Diferencia Sindicato:', totalSindicato - simulatedTotals.totalSindicato);
    console.log('🔍 PREVIEW - Diferencia Total:', grandTotal - simulatedTotals.grandTotal);

    return {
      totalFAS,
      totalAporteSolidario, 
      totalSindicato,
      totalBruto,
      grandTotal
    };
  };

  // Si no hay datos, mostrar loading
  if (empleadosData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToImport}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Resumen de Empleados
            </h1>
            <p className="text-gray-600 mt-2">
              Revise el resumen de la declaración antes de confirmar la importación.
              {month && year && (
                <span className="font-medium"> Período: {month}/{year}</span>
              )}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Empleados</p>
                  <p className="text-2xl font-bold">{empleadosData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Save className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Período</p>
                  <p className="text-lg font-semibold">{month}/{year}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Bruto</p>
                  <p className="text-lg font-semibold">{formatCurrency(totals.totalBruto)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert informativo */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Resumen de la declaración:</strong> A continuación se muestran los totales calculados para todos los empleados. 
          <strong>Para continuar con la importación, debe obligatoriamente revisar y confirmar los datos desde la tabla de edición.</strong>
        </AlertDescription>
      </Alert>

      {/* Totales Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Totales de la Declaración</CardTitle>
          <CardDescription>
            Resumen de aportes y contribuciones calculadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">FAS (1%)</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totals.totalFAS)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Aporte Solidario (2%)
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totals.totalAporteSolidario)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Sindicato (3%)
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(totals.totalSindicato)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Bruto</h3>
              <p className="text-2xl font-bold text-gray-700">
                {formatCurrency(totals.totalBruto)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">TOTAL A PAGAR</h3>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(totals.grandTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <Card>
        <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Continuar con la importación</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Paso obligatorio:</strong> Debe revisar y editar los datos en la tabla antes de confirmar la importación.
                </p>
                <p className="text-sm text-amber-600 font-medium">
                  ⚠️ Debe revisar los datos en la tabla de edición para confirmar la importación.
                </p>
                {isTableWindowOpen && (
                  <p className="text-sm text-orange-600 font-medium">
                    📋 Pestaña de edición abierta en otra ventana
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleOpenTableInNewTab}
                  className="min-w-[200px] bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={loading || isUploading || isTableWindowOpen}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isTableWindowOpen ? 'Pestaña de Edición Abierta' : 'Ir a Tabla de Edición'}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
        </CardContent>
      </Card>

      {/* Barra de progreso durante carga */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h3 className="text-lg font-semibold">Importando empleados...</h3>
                <p className="text-sm text-muted-foreground">
                  Por favor espere mientras procesamos los datos
                </p>
                <Progress value={66} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 