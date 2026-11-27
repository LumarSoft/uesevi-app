"use client";
import { Building2 } from "lucide-react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import {
  MENSAJE_SESION_VENCIDA,
  mensajeDeErrorDeLogin,
  tomarAvisoSesionVencida,
} from "@/shared/utils/sesionVencida";

import { useRouter } from "next/navigation";
import LoadingSpinner from "@/modules/Login/components/LoadingSpinner";

export function LoginEmpresaModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nueva variable de estado para mostrar/ocultar contraseña
  const [loading, setLoading] = useState(false);
  // El error queda escrito debajo del formulario (el toast se iba solo) y se
  // borra apenas la persona corrige el email o la contraseña.
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (tomarAvisoSesionVencida()) setAviso(MENSAJE_SESION_VENCIDA);
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar formato de email
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setLoading(true);
    setError("");
    setAviso("");

    // Validar formato del email
    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await postData("login/company", formData);

      if (!result.ok) {
        setError(mensajeDeErrorDeLogin(result));
        setLoading(false);
        return;
      }

      const { data } = result as { data: any };

      const { user, token } = data;
      userStore.getState().setAuth(token, user);

      router.replace("/empresa/empleados/importacion");
    } catch {
      // postData no lanza (devuelve { ok: false }); esto es por las dudas.
      setError(mensajeDeErrorDeLogin({}));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Inicio de Sesión Empresarial
          </CardTitle>
          <CardDescription className="text-center">
            Ingrese sus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                autoComplete="email"
                placeholder="nombre@empresa.com"
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                autoComplete="current-password"
                required
                type={showPassword ? "text" : "password"} // Muestra/oculta la contraseña
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-9" // Ajusta la posición del ícono
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <div className="text-right">
              {/* type="button": sin esto el link enviaba el formulario de login. */}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-sm text-blue-600 hover:text-blue-800"
                onClick={() => router.push("/cambiarcontrasenia")}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
            {aviso && !error && (
              <p
                role="status"
                className="rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800"
              >
                {aviso}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <LoadingSpinner /> : "Iniciar sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
