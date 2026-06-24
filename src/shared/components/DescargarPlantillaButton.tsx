"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { descargarPlantillaEmpleados } from "@/shared/utils/plantillaEmpleados";

/**
 * Botón que genera y descarga la plantilla de empleados (.xlsx) con
 * desplegables de Categoría (categorías reales del sistema) y Adherido a
 * Sindicato. Reutilizable desde los distintos ChargeAlert.
 */
export const DescargarPlantillaButton = ({
  className,
}: {
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await descargarPlantillaEmpleados();
    } catch (error) {
      console.error("Error al generar la plantilla:", error);
      toast.error("No se pudo generar la plantilla. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={loading} className={className}>
      {loading ? "Generando..." : "Descargar ejemplo de archivo"}
    </Button>
  );
};
