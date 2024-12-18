// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  rol: string;
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{
    id: number;
    email: string;
    rol: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar token al cargar o recargar la página
    const token = localStorage.getItem("authToken");
    setIsLoading(true);

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);

        // Verificar si el token ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
          setUser({
            id: decoded.id,
            email: "", // No está en tu token actual
            rol: decoded.rol,
          });
        } else {
          // Token expirado
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Token inválido
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const login = (loginResponse: any) => {
    // Guardar todo el token
    localStorage.setItem("authToken", loginResponse.data.token);

    // Decodificar el token
    const decoded = jwtDecode<DecodedToken>(loginResponse.data.token);

    setIsAuthenticated(true);
    setUser({
      id: decoded.id,
      email: loginResponse.data.user.correo,
      rol: decoded.rol,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, login, logout, isLoading };
};