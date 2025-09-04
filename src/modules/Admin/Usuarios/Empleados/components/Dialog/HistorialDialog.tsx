"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building2, Clock, User, ChevronDown, ChevronRight } from "lucide-react";
import { IEmployeeHistory } from "@/shared/types/Querys/IEmployeeHistory";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";

interface HistorialDialogProps {
  empleado: IEmpleado;
}

export const HistorialDialog: React.FC<HistorialDialogProps> = ({ empleado }) => {
  const [historial, setHistorial] = useState<IEmployeeHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const fetchHistorial = async () => {
    console.log("🔍 Datos del empleado:", empleado);
    console.log("🎯 empleado_id:", empleado.empleado_id);
    
    if (!empleado.empleado_id) {
      console.error("❌ No hay empleado_id disponible");
      return;
    }
    
    setLoading(true);
    try {
      const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3001";
      console.log("🔧 BASE_API_URL:", BASE_API_URL);
      
      // Obtener el historial del empleado
      const url = `${BASE_API_URL}/employees/history/${empleado.empleado_id}`;
      console.log("🌐 URL de consulta:", url);
      
      const response = await fetch(url);
      console.log("🔍 History response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("📡 Respuesta del servidor:", data);
        
        if (data.ok) {
          console.log("✅ Datos del historial recibidos:", data.data);
          console.log("🔍 Primer elemento del historial:", JSON.stringify(data.data[0], null, 2));
          setHistorial(data.data);
        } else {
          console.error("Error fetching historial:", data.message);
        }
      } else {
        console.error("❌ Error HTTP:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("❌ Error response:", errorText.substring(0, 500));
      }
    } catch (error) {
      console.error("Error fetching historial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistorial();
    }
  }, [open, empleado.empleado_id]);

  const toggleExpanded = (empresaId: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(empresaId)) {
      newExpanded.delete(empresaId);
    } else {
      newExpanded.add(empresaId);
    }
    setExpandedItems(newExpanded);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'Activo':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Finalizado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Inactivo':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatFecha = (fecha: string) => {
    if (!fecha || fecha === 'Invalid Date') return 'N/A';
    
    // Si la fecha ya viene formateada (dd/mm/yyyy), devolverla directamente
    if (typeof fecha === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      return fecha;
    }
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formateando fecha:', fecha, error);
      return 'N/A';
    }
  };

  const calcularDuracion = (inicio: string, fin: string | null) => {
    if (!inicio || inicio === 'Invalid Date') return 'N/A';
    
    try {
      // Convertir fecha formateada (dd/mm/yyyy) a Date
      let fechaInicio;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(inicio)) {
        const [day, month, year] = inicio.split('/');
        fechaInicio = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        fechaInicio = new Date(inicio);
      }
      
      let fechaFin;
      if (fin && fin !== 'Invalid Date') {
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fin)) {
          const [day, month, year] = fin.split('/');
          fechaFin = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          fechaFin = new Date(fin);
        }
      } else {
        fechaFin = new Date();
      }
      
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        return 'N/A';
      }
      
      const diffTime = Math.abs(fechaFin.getTime() - fechaInicio.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} días`;
      } else if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30);
        return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
      } else {
        const años = Math.floor(diffDays / 365);
        const mesesRestantes = Math.floor((diffDays % 365) / 30);
        return `${años} ${años === 1 ? 'año' : 'años'}${mesesRestantes > 0 ? ` y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`;
      }
    } catch (error) {
      console.error('Error calculando duración:', inicio, fin, error);
      return 'N/A';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-1" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Historial Laboral - {empleado.apellido}, {empleado.nombre}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            CUIL: {empleado.cuil}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontró historial laboral para este empleado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historial.map((item, index) => {
                const isExpanded = expandedItems.has(item.empresa_id);
                return (
                  <Card key={item.empresa_id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <Building2 className="w-5 h-5" />
                          <CardTitle className="text-lg">{item.nombre_empresa}</CardTitle>
                          {item.total_contratos > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(item.empresa_id)}
                              className="ml-2 p-1 h-6 w-6"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {item.total_contratos > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              {item.total_contratos} contratos
                            </Badge>
                          )}
                          <Badge className={getEstadoBadgeColor(item.estado_descripcion)}>
                            {item.estado_descripcion}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        CUIT: {item.cuit_empresa}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      {/* Resumen del período total */}
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium">Período Total</p>
                              <p className="text-sm text-muted-foreground">
                                {formatFecha(item.fecha_inicio)} - {item.fecha_fin ? formatFecha(item.fecha_fin) : 'Vigente'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">Antigüedad Total</p>
                              <p className="text-sm text-muted-foreground">
                                {calcularDuracion(item.fecha_inicio, item.fecha_fin)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {item.categoria && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Categoría</p>
                            <p className="text-sm text-muted-foreground">{item.categoria}</p>
                          </div>
                        )}
                      </div>

                      {/* Detalles de contratos individuales (expandible) */}
                      {item.total_contratos > 1 && isExpanded && (
                        <div className="space-y-3">
                          <div className="text-sm font-medium text-muted-foreground border-b pb-1">
                            Detalle de contratos individuales:
                          </div>
                          {item.contratos.map((contrato, contratoIndex) => (
                            <div key={contrato.contrato_id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Contrato #{contrato.contrato_id}</span>
                                <Badge className={getEstadoBadgeColor(contrato.estado_descripcion)} variant="outline">
                                  {contrato.estado_descripcion}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium">Inicio:</span> {formatFecha(contrato.fecha_inicio)}
                                </div>
                                <div>
                                  <span className="font-medium">Fin:</span> {contrato.fecha_fin ? formatFecha(contrato.fecha_fin) : 'Vigente'}
                                </div>
                                <div>
                                  <span className="font-medium">Duración:</span> {calcularDuracion(contrato.fecha_inicio, contrato.fecha_fin)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Modificado: {formatFecha(contrato.ultima_modificacion)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
