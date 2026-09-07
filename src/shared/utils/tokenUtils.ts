import { userStore } from "@/shared/stores/userStore";

/**
 * Decodifica un token JWT sin verificar la firma
 * Solo para leer la información del payload en el cliente
 */
export function decodeJWT(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}

/**
 * Verifica si un token está expirado
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Obtiene el token del store de sesión (Zustand) y verifica si es válido.
 * Esta es la única fuente de verdad del token: no leer/escribir localStorage
 * por fuera del store.
 */
export function getValidToken(): string | null {
  const token = userStore.getState().token;

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    userStore.getState().logout();
    return null;
  }

  return token;
}

/**
 * Verifica si el usuario está autenticado con un rol específico.
 * Esto es solo UX (redirige en el cliente); la seguridad real la da el
 * backend con el JWT en cada request.
 */
export function isAuthenticatedWithRole(requiredRole: string): boolean {
  const token = getValidToken();

  if (!token) {
    return false;
  }

  const payload = decodeJWT(token);

  if (!payload || payload.rol !== requiredRole) {
    return false;
  }

  return true;
}

/**
 * Limpia la sesión del usuario.
 */
export function clearAuthToken(): void {
  userStore.getState().logout();
}
