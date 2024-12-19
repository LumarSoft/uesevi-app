import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { userStore, User } from "../stores/userStore";

interface DecodedToken {
  id: number;
  rol: string;
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const { setAuth, logout: storeLogout, getUser } = userStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
        } else {
          // Token expirado
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          storeLogout(); // Usar el método logout del store
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        // Token inválido
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        storeLogout(); // Usar el método logout del store
      }
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, [storeLogout]);

  const login = (loginResponse: any) => {
    // Guardar todo el token
    localStorage.setItem("authToken", loginResponse.data.token);

    console.log(loginResponse);

    setIsAuthenticated(true);

    setAuth(loginResponse.data.token, loginResponse.data.user);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    console.log("logout");
    storeLogout(); // Usar el método logout del store
  };

  return {
    isAuthenticated,
    login,
    logout,
    isLoading,
    user: getUser() as User | null,
  };
};
