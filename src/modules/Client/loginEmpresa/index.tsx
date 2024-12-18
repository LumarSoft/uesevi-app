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
import { useState } from "react";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/modules/Login/components/LoadingSpinner";
import { useAuth } from "@/shared/hooks/use-auth";

export function LoginEmpresaModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Nueva variable de estado para mostrar/ocultar contraseña
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar formato de email
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    setLoading(true);

    // Validar formato del email
    if (!validateEmail(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await postData("login/company", formData);

      if (!result.ok) {
        toast.error(result.message || "Ocurrió un error al iniciar sesión.");
        setLoading(false);
        return;
      }

      const { user } = result.data;

      if (user.rol !== "empresa") {
        toast.error("No tienes permisos para acceder.");
        setLoading(false);
        return;
      }

      await login(result);
      router.push("/empresa/empleados/importacion");
    } catch (error: any) {
      console.error("Error en la solicitud:", error);

      // Manejo de errores específicos de Axios
      if (error.response) {
        const { statusCode, message } = error.response.data;

        if (statusCode === 401) {
          toast.error(
            "Las credenciales son incorrectas. Verifique su correo y contraseña."
          );
        } else {
          toast.error(message || "Ocurrió un error al iniciar sesión.");
        }
      } else {
        toast.error("Ocurrió un error en la solicitud.");
      }

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
                placeholder="nombre@empresa.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                required
                type={showPassword ? "text" : "password"} // Muestra/oculta la contraseña
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-9" // Ajusta la posición del ícono
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
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
