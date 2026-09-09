"use client";

import { Nacho } from "@/shared/components/Nacho";
import type { EstadoNacho } from "@/shared/components/Nacho";

/**
 * Identidad de Nacho en el hilo. Es un envoltorio fino sobre la silueta: existe
 * para que los llamados del módulo no tengan que conocer el motor.
 *
 * `activo` se mantiene por compatibilidad con los usos viejos; cuando se sabe
 * qué está haciendo Nacho conviene pasar `estado` y que la silueta lo muestre.
 */
const AvatarNacho = ({
  activo = false,
  estado,
  tamano = 32,
  sigueCursor = false,
}: {
  activo?: boolean;
  estado?: EstadoNacho;
  tamano?: number;
  sigueCursor?: boolean;
}) => (
  <Nacho
    estado={estado ?? (activo ? "pensando" : "reposo")}
    tamano={tamano}
    sigueCursor={sigueCursor}
  />
);

export default AvatarNacho;
