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
import { CATEGORIAS_PERMITIDAS } from "../../../../empleados/importacion/constants/excelSchema";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

// Tipo para los datos de empleado en rectificación
interface EmpleadoRectificarData {
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

// Funciones de cálculo (corregidas según backend)
const calculateTotalBruto = (empleado: EmpleadoRectificarData) => {
  return Number(empleado.sueldo_bsico) + 
         Number(empleado.adicionales) + 
         Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
         Number(empleado.ad_remunerativo);
};

const calculateFAS = (basicSalary: number = 100000) => {
  // 1% del sueldo básico de la categoría
  return basicSalary * 0.01;
};

const calculateAporteSolidario = (empleado: EmpleadoRectificarData) => {
  // 2% del (sueldo_básico + suma_no_remunerativa + remunerativo_adicional) solo para no afiliados
  if (empleado.adherido_a_sindicato === "no") {
    const total = Number(empleado.sueldo_bsico) + 
                  Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
                  Number(empleado.ad_remunerativo);
    return total * 0.02;
  }
  return 0;
};

const calculateSindicato = (empleado: EmpleadoRectificarData) => {
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

const calculateTotal = (empleado: EmpleadoRectificarData, basicSalary: number = 100000) => {
  const fas = calculateFAS(basicSalary);
  const aporteSolidario = calculateAporteSolidario(empleado);
  const sindicato = calculateSindicato(empleado);
  return fas + aporteSolidario + sindicato;
};

export const RectificarPreviewModule = ({ statement }: { statement: IInfoDeclaracion }) => {
  const [empleadosData, setEmpleadosData] = useState<EmpleadoRectificarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statementId, setStatementId] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [isTableWindowOpen, setIsTableWindowOpen] = useState(false);
  const [tableWindowRef, setTableWindowRef] = useState<Window | null>(null);
  const [basicSalary, setBasicSalary] = useState<number>(100000);
  const { user } = userStore();
  const router = useRouter();

  // Función para obtener el sueldo básico
  const fetchBasicSalary = async () => {
    try {
      console.log('🔍 RECTIFICAR - Obteniendo Basic Salary desde API...');
      console.log('🔍 RECTIFICAR - API URL:', process.env.NEXT_PUBLIC_BASE_API_URL);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/basicSalary`);
      console.log('🔍 RECTIFICAR - Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 RECTIFICAR - Response data:', result);
        
        if (result.ok && result.data && result.data.length > 0) {
          const realBasicSalary = result.data[0].sueldo_basico || 100000;
          setBasicSalary(realBasicSalary);
          console.log('🔍 RECTIFICAR - Basic Salary obtenido de API:', realBasicSalary);
        } else {
          console.warn('🔍 RECTIFICAR - API response no válida:', result);
          console.log('🔍 RECTIFICAR - Usando valor por defecto:', 100000);
        }
      } else {
        console.error('🔍 RECTIFICAR - Error HTTP:', response.status, response.statusText);
        console.log('🔍 RECTIFICAR - Usando valor por defecto:', 100000);
      }
    } catch (error) {
      console.error('🔍 RECTIFICAR - Error al obtener sueldo básico:', error);
      console.log('🔍 RECTIFICAR - Usando valor por defecto:', 100000);
      // Mantener valor por defecto
    }
  };

  // Cargar datos del sessionStorage al montar el componente
  useEffect(() => {
    const storedData = sessionStorage.getItem('empleados_rectificar_data');
    const storedStatementId = sessionStorage.getItem('empleados_rectificar_statementId');
    const storedMonth = sessionStorage.getItem('empleados_rectificar_month');
    const storedYear = sessionStorage.getItem('empleados_rectificar_year');

    if (storedData && storedStatementId && storedMonth && storedYear) {
      try {
        const parsedData = JSON.parse(storedData);
        
        // Normalizar datos para adherido_a_sindicato
        const normalizedData = parsedData.map((empleado: any) => ({
          ...empleado,
          adherido_a_sindicato: String(empleado.adherido_a_sindicato).toLowerCase() === 'si' || 
                                String(empleado.adherido_a_sindicato).toLowerCase() === 'true' || 
                                String(empleado.adherido_a_sindicato) === '1' ? 'si' : 'no'
        }));
        
        setEmpleadosData(normalizedData);
        setStatementId(parseInt(storedStatementId));
        setMonth(parseInt(storedMonth));
        setYear(parseInt(storedYear));
        
        // Obtener el sueldo básico
        fetchBasicSalary();
      } catch (error) {
        console.error('Error al parsear datos del sessionStorage:', error);
        toast.error('Error al cargar los datos. Regresando a rectificación.');
        router.push(`/empresa/declaraciones/${statement.id}/rectificar`);
      }
    } else {
      toast.error('No se encontraron datos para mostrar. Regresando a rectificación.');
      router.push(`/empresa/declaraciones/${statement.id}/rectificar`);
    }

    // Verificar si ya hay una ventana de edición abierta al cargar
    const isWindowOpen = localStorage.getItem('empleados_rectificar_table_window_open') === 'true';
    setIsTableWindowOpen(isWindowOpen);
  }, [router, statement.id]);

  // Escuchar cambios en localStorage para detectar cuando se cierra la ventana de edición
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'empleados_rectificar_table_window_open') {
        const isOpen = e.newValue === 'true';
        setIsTableWindowOpen(isOpen);
        if (!isOpen) {
          setTableWindowRef(null);
        }
      }
    };

    // Polling para verificar el estado cada segundo
    const interval = setInterval(() => {
      const isWindowOpen = localStorage.getItem('empleados_rectificar_table_window_open') === 'true';
      setIsTableWindowOpen(isWindowOpen);
      
      // Si tenemos una referencia a la ventana, verificar si está cerrada
      if (tableWindowRef && tableWindowRef.closed) {
        setIsTableWindowOpen(false);
        setTableWindowRef(null);
        localStorage.removeItem('empleados_rectificar_table_window_open');
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
    if (statementId === null || month === null || year === null) {
      toast.error("Error: datos de rectificación no definidos");
      return false;
    }

    const formData = new FormData();

    data.forEach((item, index) => {
      Object.entries(item).forEach(([key, value]) => {
        formData.append(`employees[${index}][${key}]`, value as any);
      });
    });

    formData.append("companyId", user.empresa.id);
    formData.append("statementId", statementId.toString());
    formData.append("year", year.toString());
    formData.append("month", month.toString());

    try {
      const result = await postData("statements/rectifications", formData);
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
  const validateData = (data: EmpleadoRectificarData[]) => {
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

  // Función para enviar los datos finales (sin editar)
  const handleDirectSubmit = async () => {
    const errors = validateData(empleadosData);

    if (errors.length > 0) {
      const displayErrors = errors.slice(0, 5);
      const remainingErrors = errors.length - 5;

      let errorMessage = displayErrors.join("\n");
      if (remainingErrors > 0) {
        errorMessage += `\n...y ${remainingErrors} errores más.`;
      }

      toast.error(errorMessage, {
        autoClose: 10000,
      });
      return;
    }

    setLoading(true);
    setIsUploading(true);

    const isSuccess = await sendJson(empleadosData);

    setLoading(false);
    setIsUploading(false);

    if (isSuccess) {
      // Limpiar sessionStorage después del envío exitoso
      sessionStorage.removeItem('empleados_rectificar_data');
      sessionStorage.removeItem('empleados_rectificar_statementId');
      sessionStorage.removeItem('empleados_rectificar_month');
      sessionStorage.removeItem('empleados_rectificar_year');
      
      toast.success("Rectificación enviada correctamente");
      router.push("/empresa/declaraciones");
    } else {
      toast.error("Hubo un problema al enviar los datos");
    }
  };

  // Función para volver a la rectificación
  const handleBackToRectificar = () => {
    sessionStorage.removeItem('empleados_rectificar_data');
    sessionStorage.removeItem('empleados_rectificar_statementId');
    sessionStorage.removeItem('empleados_rectificar_month');
    sessionStorage.removeItem('empleados_rectificar_year');
    
    router.push(`/empresa/declaraciones/${statement.id}/rectificar`);
  };

  // Función para abrir la tabla en nueva pestaña
  const handleOpenTableInNewTab = () => {
    if (isTableWindowOpen && tableWindowRef && !tableWindowRef.closed) {
      // Si ya hay una ventana abierta, enfocarla
      tableWindowRef.focus();
      return;
    }

    const url = `/empleados-rectificar-preview-table`;
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      setTableWindowRef(newWindow);
      setIsTableWindowOpen(true);
      localStorage.setItem('empleados_rectificar_table_window_open', 'true');
      
      // Verificar inmediatamente si la ventana se abrió correctamente
      setTimeout(() => {
        if (newWindow.closed) {
          setIsTableWindowOpen(false);
          setTableWindowRef(null);
          localStorage.removeItem('empleados_rectificar_table_window_open');
        }
      }, 100);
    }
  };

  // Calcular totales
  const calculateTotals = () => {
    let totalFAS = empleadosData.length * calculateFAS(basicSalary);
    let totalAporteSolidario = 0;
    let totalSindicato = 0;
    let totalBruto = 0;

    empleadosData.forEach(empleado => {
      totalBruto += calculateTotalBruto(empleado);
      totalAporteSolidario += calculateAporteSolidario(empleado);
      totalSindicato += calculateSindicato(empleado);
    });

    const grandTotal = totalFAS + totalAporteSolidario + totalSindicato;

    return {
      totalFAS,
      totalAporteSolidario, 
      totalSindicato,
      totalBruto,
      grandTotal
    };
  };

  const totals = calculateTotals();

  // Si no hay datos, mostrar loading
  if (empleadosData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos de rectificación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" onClick={handleBackToRectificar}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Preview de Rectificación
            </h1>
            <p className="text-gray-600 mt-2">
              Revise los datos antes de confirmar la rectificación de la declaración.
              {month && year && (
                <span className="font-medium"> Período: {month}/{year}</span>
              )}
            </p>
          </div>
        </div>

        {/* Info de la declaración original */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Información de la Declaración Original</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Empresa</p>
                <p className="font-semibold">{statement.nombre_empresa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Empleados</p>
                <p className="font-semibold">{statement.cantidad_empleados_declaracion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rectificación N°</p>
                <p className="font-semibold">{statement.rectificada + 1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Vencimiento</p>
                <p className="font-semibold">{new Date(statement.vencimiento).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <Edit3 className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-lg font-semibold text-blue-600">Rectificación</p>
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
      </div>

      {/* Alert informativo */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Esta es una rectificación de la declaración original. 
          Puede revisar y editar los datos antes de confirmar.
        </AlertDescription>
      </Alert>

      {/* Totales */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Totales de la Rectificación</CardTitle>
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
              <h3 className="text-lg font-semibold">¿Qué desea hacer?</h3>
              <p className="text-sm text-muted-foreground">
                Puede confirmar la rectificación directamente o revisar/editar los datos en la tabla.
              </p>
              {isTableWindowOpen && (
                <p className="text-sm text-orange-600 font-medium">
                  ⚠️ Hay una ventana de edición abierta. Ciérrela antes de confirmar desde aquí.
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleOpenTableInNewTab}
                className="min-w-[180px]"
                disabled={loading || isUploading}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isTableWindowOpen ? 'Enfocar Tabla' : 'Ver/Editar Tabla'}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
              
              <Button
                onClick={handleDirectSubmit}
                disabled={loading || isUploading || isTableWindowOpen}
                className="min-w-[180px] bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Confirmar Rectificación
                  </>
                )}
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
                <h3 className="text-lg font-semibold">Enviando rectificación...</h3>
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