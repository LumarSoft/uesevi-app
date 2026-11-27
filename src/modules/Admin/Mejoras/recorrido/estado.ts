import { create } from "zustand";

// Estado de la presentación de Mejoras: compartido entre el layout del panel
// (que la muestra) y la página de Mejoras (botón "Ver recorrido").
type Etapa = "cerrado" | "bienvenida" | "pasos" | "final";

interface EstadoRecorrido {
  etapa: Etapa;
  paso: number;
  abrirBienvenida: () => void;
  empezar: () => void;
  siguiente: (totalPasos: number) => void;
  anterior: () => void;
  cerrar: () => void;
}

export const useRecorridoMejoras = create<EstadoRecorrido>((set) => ({
  etapa: "cerrado",
  paso: 0,
  abrirBienvenida: () => set({ etapa: "bienvenida", paso: 0 }),
  empezar: () => set({ etapa: "pasos", paso: 0 }),
  siguiente: (totalPasos) =>
    set((s) => (s.paso + 1 >= totalPasos ? { etapa: "final" } : { paso: s.paso + 1 })),
  anterior: () => set((s) => ({ paso: Math.max(0, s.paso - 1) })),
  cerrar: () => set({ etapa: "cerrado", paso: 0 }),
}));
