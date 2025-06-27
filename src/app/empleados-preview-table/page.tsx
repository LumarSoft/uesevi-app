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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { 
  Edit3, 
  Save, 
  Users, 
  AlertCircle,
  FileSpreadsheet,
  X
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CATEGORIAS_PERMITIDAS } from "@/modules/company/empleados/importacion/constants/excelSchema";

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
  return basicSalary * 0.01;
};

const calculateAporteSolidario = (empleado: EmpleadoData) => {
  if (empleado.adherido_a_sindicato === "no") {
    // Según el backend: 2% de (sueldo_básico + suma_no_remunerativa + remunerativo_adicional)
    const total = Number(empleado.sueldo_bsico) + 
                  Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
                  Number(empleado.ad_remunerativo);
    return total * 0.02;
  }
  return 0;
};

const calculateSindicato = (empleado: EmpleadoData) => {
  if (empleado.adherido_a_sindicato === "si") {
    // Según el backend: 3% de (sueldo_básico + adicionales + suma_no_remunerativa + remunerativo_adicional)
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

export default function EmpleadosPreviewTablePage() {
  const [editableData, setEditableData] = useState<EmpleadoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [basicSalary, setBasicSalary] = useState<number>(100000); // Valor por defecto
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
        
        // Normalizar datos para adherido_a_sindicato y suma_no_remunerativa
        const normalizedData = parsedData.map((empleado: any) => ({
          ...empleado,
          adherido_a_sindicato: String(empleado.adherido_a_sindicato).toLowerCase() === 'si' || 
                                String(empleado.adherido_a_sindicato).toLowerCase() === 'true' || 
                                String(empleado.adherido_a_sindicato) === '1' ? 'si' : 'no',
          suma_no_remunerativa: Number(empleado.suma_no_remunerativa) || 0 // Asegurar que siempre sea 0 para importaciones
        }));
        
        setEditableData(normalizedData);
        setMonth(parseInt(storedMonth));
        setYear(parseInt(storedYear));
        
        // Obtener el sueldo básico de la categoría 1 (igual que en Columns.tsx)
        fetchBasicSalary();
        
        // Marcar que esta ventana está abierta
        localStorage.setItem('empleados_table_window_open', 'true');
      } catch (error) {
        console.error('Error al parsear datos del sessionStorage:', error);
        toast.error('Error al cargar los datos.');
        window.close();
      }
    } else {
      toast.error('No se encontraron datos para mostrar.');
      window.close();
    }
  }, []);

  // Función para obtener el sueldo básico
  const fetchBasicSalary = async () => {
    try {
      console.log('🔍 TABLA - Obteniendo Basic Salary desde API...');
      console.log('🔍 TABLA - API URL:', process.env.NEXT_PUBLIC_BASE_API_URL);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/basicSalary`);
      console.log('🔍 TABLA - Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('🔍 TABLA - Response data:', result);
        
        if (result.ok && result.data && result.data.length > 0) {
          const realBasicSalary = result.data[0].sueldo_basico || 100000;
          setBasicSalary(realBasicSalary);
          console.log('🔍 TABLA - Basic Salary obtenido de API:', realBasicSalary);
        } else {
          console.warn('🔍 TABLA - API response no válida:', result);
          console.log('🔍 TABLA - Usando valor por defecto:', 100000);
        }
      } else {
        console.error('🔍 TABLA - Error HTTP:', response.status, response.statusText);
        console.log('🔍 TABLA - Usando valor por defecto:', 100000);
      }
    } catch (error) {
      console.error('🔍 TABLA - Error al obtener sueldo básico:', error);
      console.log('🔍 TABLA - Usando valor por defecto:', 100000);
      // Mantener valor por defecto
    }
  };

  // Limpiar el localStorage cuando se cierre la ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('empleados_table_window_open');
    };

    const handleUnload = () => {
      localStorage.removeItem('empleados_table_window_open');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      // También limpiar al desmontar el componente
      localStorage.removeItem('empleados_table_window_open');
    };
  }, []);

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

  // Función para manejar cambios en los inputs de la tabla
  const handleInputChange = (index: number, field: keyof EmpleadoData, value: string | number) => {
    const updatedData = [...editableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    };
    setEditableData(updatedData);
    
    // Actualizar sessionStorage con los cambios
    sessionStorage.setItem('empleados_preview_data', JSON.stringify(updatedData));
  };

  // Función para enviar los datos finales
  const handleFinalSubmit = async () => {
    // Validaciones básicas antes de enviar
    const errors: string[] = [];

    editableData.forEach((empleado, index) => {
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
        errors.push(`Fila ${rowNumber}: La categoría &quot;${empleado.categora}&quot; no es válida`);
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

      if (isNaN(Number(empleado.suma_no_remunerativa || 0)) || Number(empleado.suma_no_remunerativa || 0) < 0) {
        errors.push(`Fila ${rowNumber}: La suma no remunerativa debe ser un número válido mayor o igual a 0`);
      }

      const sindicatoValue = String(empleado.adherido_a_sindicato).toLowerCase();
      if (sindicatoValue !== "si" && sindicatoValue !== "no") {
        errors.push(`Fila ${rowNumber}: Adherido a sindicato debe ser Sí o No`);
      }
    });

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

    const isSuccess = await sendJson(editableData);

    setLoading(false);
    setIsUploading(false);

    if (isSuccess) {
      // Limpiar sessionStorage después del envío exitoso
      sessionStorage.removeItem('empleados_preview_data');
      sessionStorage.removeItem('empleados_preview_month');
      sessionStorage.removeItem('empleados_preview_year');
      
      // Limpiar localStorage
      localStorage.removeItem('empleados_table_window_open');
      
      toast.success("Empleados importados correctamente");
      
      // Cerrar pestaña y redirigir en la ventana padre
      if (window.opener) {
        window.opener.location.href = "/empresa/declaraciones";
        window.close();
      }
    } else {
      toast.error("Hubo un problema al enviar los datos");
    }
  };

  // Función para cerrar la pestaña
  const handleClose = () => {
    localStorage.removeItem('empleados_table_window_open');
    window.close();
  };

  // Si no hay datos, mostrar loading
  if (editableData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-600" />
                Editor de Empleados
              </h1>
              <p className="text-gray-600 mt-2">
                Edite la información de los empleados antes de confirmar la importación.
                {month && year && (
                  <span className="font-medium"> Período: {month}/{year}</span>
                )}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleClose}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Empleados</p>
                  <p className="text-2xl font-bold">{editableData.length}</p>
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
                  <p className="text-lg font-semibold text-blue-600">Editable</p>
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
      </div>

      {/* Alert informativo */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Importante:</strong> Puede editar cualquier campo directamente en la tabla. 
          Los cambios se guardan automáticamente y se sincronizarán con la ventana principal.
        </AlertDescription>
      </Alert>

      {/* Tabla editable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Datos de Empleados - Editable
          </CardTitle>
          <CardDescription>
            Haga clic en cualquier campo para editarlo. Los cambios se guardan automáticamente.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead className="min-w-[100px]">CUIL</TableHead>
                    <TableHead className="min-w-[100px]">Nombre</TableHead>
                    <TableHead className="min-w-[100px]">Apellido</TableHead>
                    <TableHead className="min-w-[80px]">Categoría</TableHead>
                    <TableHead className="min-w-[100px]">Sueldo Básico</TableHead>
                    <TableHead className="min-w-[90px]">Adicionales</TableHead>
                    <TableHead className="min-w-[110px]">Ad. Remunerativo</TableHead>
                    <TableHead className="min-w-[110px]">Suma No Remunerativa</TableHead>
                    <TableHead className="min-w-[100px]">Adherido Sindicato</TableHead>
                    <TableHead className="min-w-[100px]">Total Bruto</TableHead>
                    <TableHead className="min-w-[80px]">FAS</TableHead>
                    <TableHead className="min-w-[100px]">Aporte Solidario</TableHead>
                    <TableHead className="min-w-[80px]">Sindicato</TableHead>
                    <TableHead className="min-w-[80px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableData.map((empleado, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-center font-medium text-muted-foreground bg-muted/30">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={empleado.cuil}
                          onChange={(e) => handleInputChange(index, 'cuil', e.target.value)}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="CUIL"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={empleado.nombre}
                          onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="Nombre"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={empleado.apellido}
                          onChange={(e) => handleInputChange(index, 'apellido', e.target.value)}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="Apellido"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={empleado.categora}
                          onValueChange={(value) => handleInputChange(index, 'categora', value)}
                        >
                          <SelectTrigger className="border-0 shadow-none bg-transparent focus:ring-1">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIAS_PERMITIDAS.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={empleado.sueldo_bsico}
                          onChange={(e) => handleInputChange(index, 'sueldo_bsico', Number(e.target.value))}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={empleado.adicionales}
                          onChange={(e) => handleInputChange(index, 'adicionales', Number(e.target.value))}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={empleado.ad_remunerativo}
                          onChange={(e) => handleInputChange(index, 'ad_remunerativo', Number(e.target.value))}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={empleado.suma_no_remunerativa || 0}
                          onChange={(e) => handleInputChange(index, 'suma_no_remunerativa', Number(e.target.value))}
                          className="border-0 shadow-none bg-transparent focus-visible:ring-1"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={empleado.adherido_a_sindicato}
                          onValueChange={(value) => handleInputChange(index, 'adherido_a_sindicato', value)}
                        >
                          <SelectTrigger className="border-0 shadow-none bg-transparent focus:ring-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(calculateTotalBruto(empleado))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(calculateFAS(basicSalary))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(calculateAporteSolidario(empleado))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(calculateSindicato(empleado))}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(calculateTotal(empleado, basicSalary))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center bg-muted/30 px-6 py-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{editableData.length}</span> empleados listos para importar
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="min-w-[120px]"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar
            </Button>
            
            <Button
              onClick={handleFinalSubmit}
              disabled={loading || isUploading}
              className="min-w-[180px] bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Importando...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Confirmar Importación
                </>
              )}
            </Button>
          </div>
        </CardFooter>
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
} 