import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Users, 
  UserCheck, 
  Calendar, 
  ClipboardCheck,
  Clock,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

export const Info = ({ statement }: { statement: IInfoDeclaracion }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calculateDaysOverdue = () => {
    const vencimientoDate = new Date(statement.vencimiento);
    const hoyDate = new Date();
    const fechaPago = statement.fecha_pago;

    if (fechaPago && new Date(fechaPago) <= new Date(statement.vencimiento)) {
      return Math.floor(
        (new Date(fechaPago).getTime() - vencimientoDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    } else if (!fechaPago && hoyDate > vencimientoDate) {
      return Math.floor(
        (hoyDate.getTime() - vencimientoDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return 0;
  };

  const isPaid = statement.fecha_pago && statement.fecha_pago <= statement.vencimiento;
  const daysOverdue = calculateDaysOverdue();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Información de la Declaración
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Empresa:</span>
              <span>{statement.nombre_empresa}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Empleados:</span>
              <span>{statement.cantidad_empleados_declaracion}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Afiliados:</span>
              <span>{statement.cantidad_afiliados_declaracion}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Fecha:</span>
              <span>{statement.mes}/{statement.year}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Rectificada:</span>
              <span>{statement.rectificada}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Vencimiento:</span>
              <span className="flex">
                {formatDate(statement.vencimiento)}
                {isPaid ? (
                  <span className="ml-2 text-green-500 font-medium">
                    ✓ Pagada a tiempo
                  </span>
                ) : (
                  <span className="ml-2 text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Vencida: {daysOverdue} días
                  </span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="font-medium">Fecha de pago:</span>
              <span>{formatDate(statement.fecha_pago)}</span>
            </div>
            
            {statement.pago_parcial && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span className="font-medium">Pago parcial:</span>
                <span>${statement.pago_parcial}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Info;