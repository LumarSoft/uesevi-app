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
 * Obtiene el token del localStorage y verifica si es válido
 */
export function getValidToken(): string | null {
  const token = localStorage.getItem("auth-token");

  if (!token) {
    return null;
  }

  if (isTokenExpired(token)) {
    // Si el token está expirado, lo eliminamos
    localStorage.removeItem("auth-token");
    return null;
  }

  return token;
}

/**
 * Verifica si el usuario está autenticado con un rol específico
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
 * Limpia el token del localStorage
 */
export function clearAuthToken(): void {
  localStorage.removeItem("auth-token");
}
