"use client";

import { useEffect, useRef, useState } from "react";
import { ULTIMA_ENTREGA } from "./mejoras";

// Qué entregas del boletín vio cada persona. Se guarda en el navegador (es una
// comodidad, no un dato importante): si se borra, el boletín vuelve a marcar
// como nueva la última entrega y nada más.
const CLAVE = "uesevi-mejoras-ultima-vista";
const EVENTO = "uesevi-mejoras-vistas";

const leer = (): string | null => {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
};

const guardar = (fecha: string) => {
  try {
    localStorage.setItem(CLAVE, fecha);
  } catch {
    // Sin almacenamiento (modo privado): el punto del menú volverá a aparecer.
  }
};

/** Para el menú: ¿hay una entrega que esta persona todavía no vio? */
export function useHayNovedades(): boolean {
  const [hay, setHay] = useState(false);

  useEffect(() => {
    const revisar = () => {
      const vista = leer();
      setHay(Boolean(ULTIMA_ENTREGA) && (vista ?? "") < (ULTIMA_ENTREGA ?? ""));
    };
    revisar();
    window.addEventListener(EVENTO, revisar);
    window.addEventListener("storage", revisar);
    return () => {
      window.removeEventListener(EVENTO, revisar);
      window.removeEventListener("storage", revisar);
    };
  }, []);

  return hay;
}

/**
 * Para el boletín: devuelve lo que la persona había visto ANTES de entrar
 * (`undefined` mientras se lee, `null` si nunca entró) y marca todo como visto,
 * así el punto del menú se apaga mientras las tarjetas siguen marcando lo nuevo.
 */
export function useMarcarNovedadesVistas(): string | null | undefined {
  const [previa, setPrevia] = useState<string | null | undefined>(undefined);
  const yaLeido = useRef(false);

  useEffect(() => {
    // Una sola vez: si el efecto corre de nuevo (StrictMode en desarrollo),
    // leería lo que acaba de guardar y no marcaría nada como nuevo.
    if (yaLeido.current) return;
    yaLeido.current = true;
    setPrevia(leer());
    if (ULTIMA_ENTREGA) guardar(ULTIMA_ENTREGA);
    window.dispatchEvent(new Event(EVENTO));
  }, []);

  return previa;
}
