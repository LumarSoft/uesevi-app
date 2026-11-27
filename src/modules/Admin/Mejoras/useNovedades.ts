"use client";

// Estado compartido de las novedades sin ver de Mejoras (./novedades.ts): el
// menú lateral muestra el número y la página de Mejoras, al abrirse, las da
// por vistas (el número desaparece en el momento).

import { useEffect } from "react";
import { create } from "zustand";
import { MEJORAS } from "./mejoras";
import { CLAVE_VISTAS, guardarVistas, leerVistas, mejorasNuevas } from "./novedades";

const almacen = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

interface EstadoNovedades {
  /** null hasta leer el navegador (así el server y el cliente coinciden). */
  vistas: Set<string> | null;
  cargar: () => void;
  marcarTodasVistas: () => void;
}

export const useNovedadesMejoras = create<EstadoNovedades>((set) => ({
  vistas: null,
  cargar: () => set({ vistas: leerVistas(almacen()) }),
  marcarTodasVistas: () => set({ vistas: guardarVistas(almacen(), MEJORAS) }),
}));

/** Cuántos cambios nuevos hay sin ver en este navegador. */
export function useCantidadNovedades(): number {
  const vistas = useNovedadesMejoras((s) => s.vistas);
  const cargar = useNovedadesMejoras((s) => s.cargar);

  useEffect(() => {
    if (vistas === null) cargar();
  }, [vistas, cargar]);

  // Si se abre Mejoras en otra pestaña, ésta también se actualiza.
  useEffect(() => {
    const alCambiar = (e: StorageEvent) => {
      if (e.key === CLAVE_VISTAS) cargar();
    };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, [cargar]);

  return vistas ? mejorasNuevas(MEJORAS, vistas).length : 0;
}
