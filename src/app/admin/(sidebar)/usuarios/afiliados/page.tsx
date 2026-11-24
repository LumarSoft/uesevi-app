"use client";
import AdminAfiliadosModule from "@/modules/Admin/Usuarios/Afiliados";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/services/mysql/functions";
import { Loader } from "@/shared/components/Loader/Loader";
import { IAfiliado } from "@/shared/types/Querys/IAfiliado";
import { useEffect, useState } from "react";

export default function AdminAfiliados() {
  // null = todavía cargando. Un listado vacío es un resultado válido, no "cargando".
  const [afiliados, setAfiliados] = useState<IAfiliado[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;

    const cargar = async () => {
      const respuesta = await fetchData("employees/affiliates");
      if (cancelado) return;

      if (respuesta?.ok && Array.isArray(respuesta.data)) {
        setAfiliados(respuesta.data);
      } else {
        setError(respuesta?.message || "Error desconocido");
      }
    };

    cargar();
    return () => {
      cancelado = true;
    };
  }, [intento]);

  if (error) {
    return (
      <div className="space-y-3 p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Afiliados</h2>
        <p className="text-sm text-muted-foreground">
          No se pudo cargar el listado de afiliados ({error}).
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null);
            setIntento((n) => n + 1);
          }}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (afiliados === null) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return <AdminAfiliadosModule afiliados={afiliados} />;
}
