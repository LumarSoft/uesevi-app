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

// Funciones de cálculo - EXACTAMENTE iguales a las otras partes del sistema
const calculateTotalBruto = (empleado: EmpleadoRectificarData) => {
  return Number(empleado.sueldo_bsico) + 
         Number(empleado.adicionales) + 
         Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
         Number(empleado.ad_remunerativo);
};

const calculateFAS = (basicSalary: number = 100000) => {
  return basicSalary * 0.01;
};

const calculateAporteSolidario = (empleado: EmpleadoRectificarData) => {
  if (empleado.adherido_a_sindicato === "no") {
    // Según el backend: 2% de (sueldo_básico + suma_no_remunerativa + remunerativo_adicional)
    const total = Number(empleado.sueldo_bsico) + 
                  Number(empleado.suma_no_remunerativa || 0) + // Usar valor real o 0 por defecto
                  Number(empleado.ad_remunerativo);
    return total * 0.02;
  }
  return 0;
};

const calculateSindicato = (empleado: EmpleadoRectificarData) => {
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

const calculateTotal = (empleado: EmpleadoRectificarData, basicSalary: number = 100000) => {
  const fas = calculateFAS(basicSalary);
  const aporteSolidario = calculateAporteSolidario(empleado);
  const sindicato = calculateSindicato(empleado);
  return fas + aporteSolidario + sindicato;
};

export default function EmpleadosRectificarPreviewTablePage() {
  const [editableData, setEditableData] = useState<EmpleadoRectificarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statementId, setStatementId] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [basicSalary, setBasicSalary] = useState<number>(100000); // Valor por defecto
  const { user } = userStore();
  const router = useRouter();

  // Cargar datos del sessionStorage al montar el componente
  useEffect(() => {
    const storedData = sessionStorage.getItem('empleados_rectificar_data');
    const storedStatementId = sessionStorage.getItem('empleados_rectificar_statementId');
    const storedMonth = sessionStorage.getItem('empleados_rectificar_month');
    const storedYear = sessionStorage.getItem('empleados_rectificar_year');

    if (storedData && storedStatementId && storedMonth && storedYear) {
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
        setStatementId(parseInt(storedStatementId));
        setMonth(parseInt(storedMonth));
        setYear(parseInt(storedYear));
        
        // Obtener el sueldo básico de la categoría 1 (igual que en Columns.tsx)
        fetchBasicSalary();
        
        // Marcar que esta ventana está abierta
        localStorage.setItem('empleados_rectificar_table_window_open', 'true');
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/basicSalary`);
      if (response.ok) {
        const result = await response.json();
        if (result.ok && result.data && result.data.length > 0) {
          setBasicSalary(result.data[0].sueldo_basico || 100000);
        }
      }
    } catch (error) {
      console.error('Error al obtener sueldo básico:', error);
      // Mantener valor por defecto
    }
  };

  // Limpiar el localStorage cuando se cierre la ventana
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('empleados_rectificar_table_window_open');
    };

    const handleUnload = () => {
      localStorage.removeItem('empleados_rectificar_table_window_open');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      // También limpiar al desmontar el componente
      localStorage.removeItem('empleados_rectificar_table_window_open');
    };
  }, []);

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

  // Función para manejar cambios en los inputs de la tabla
  const handleInputChange = (index: number, field: keyof EmpleadoRectificarData, value: string | number) => {
    const updatedData = [...editableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    };
    setEditableData(updatedData);
    
    // Actualizar sessionStorage con los cambios
    sessionStorage.setItem('empleados_rectificar_data', JSON.stringify(updatedData));
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
      sessionStorage.removeItem('empleados_rectificar_data');
      sessionStorage.removeItem('empleados_rectificar_statementId');
      sessionStorage.removeItem('empleados_rectificar_month');
      sessionStorage.removeItem('empleados_rectificar_year');
      
      // Limpiar localStorage
      localStorage.removeItem('empleados_rectificar_table_window_open');
      
      toast.success("Rectificación procesada correctamente");
      
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
    localStorage.removeItem('empleados_rectificar_table_window_open');
    window.close();
  };

  // Si no hay datos, mostrar loading
  if (editableData.length === 0) {
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
    <div className="container mx-auto px-4 py-6 max-w-full">
      <h1>Tabla de Rectificación - En construcción</h1>
    </div>
  );
} 