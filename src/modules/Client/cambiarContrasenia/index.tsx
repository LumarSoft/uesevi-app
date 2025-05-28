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

export function CambiarContraseniaModule() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Solicitar email, 2: Ingresar código, 3: Nueva contraseña
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      toast.error("Por favor, ingrese un correo electrónico válido.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await postData("login/password/company/request-reset", formData);

      if (!result.ok) {
        toast.error(result.message || "Ocurrió un error al enviar el código.");
        setLoading(false);
        return;
      }

      toast.success(
        "Se ha enviado un código de verificación a su correo electrónico."
      );
      setStep(2);
    } catch (error: any) {
      console.error("Error en la solicitud:", error);

      if (error.response) {
        toast.error(
          error.response.data.message || "Ocurrió un error al enviar el código."
        );
      } else {
        toast.error("Ocurrió un error en la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (codigo.length < 4) {
      toast.error("Ingrese el código de verificación completo.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", codigo);

      const result = await postData("login/password/company/verify-code", formData);

      if (!result.ok) {
        toast.error(result.message || "Código incorrecto. Intente nuevamente.");
        setLoading(false);
        return;
      }

      toast.success("Código verificado correctamente.");
      setStep(3);
    } catch (error: any) {
      console.error("Error en la verificación:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Código incorrecto. Intente nuevamente."
        );
      } else {
        toast.error("Ocurrió un error en la solicitud.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (nuevaContrasenia.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (nuevaContrasenia !== confirmarContrasenia) {
      toast.error("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", codigo);
      formData.append("newPassword", nuevaContrasenia);

      const result = await postData("login/password/company/reset", formData);

      if (!result.ok) {
        toast.error(
          result.message || "Ocurrió un error al cambiar la contraseña."
        );
        setLoading(false);
        return;
      }

      toast.success("Contraseña cambiada con éxito.");
      router.push("/loginempresa");
    } catch (error: any) {
      console.error("Error al cambiar la contraseña:", error);

      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Ocurrió un error al cambiar la contraseña."
        );
      } else {
        toast.error("Ocurrió un error en la solicitud.");
      }
    } finally {
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
            Cambio de Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 &&
              "Ingrese su correo electrónico para recibir un código de verificación"}
            {step === 2 &&
              "Ingrese el código de verificación enviado a su correo"}
            {step === 3 && "Establezca su nueva contraseña"}
          </CardDescription>
        </CardHeader>

        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  placeholder="nombre@empresa.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Enviar código"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => router.push("/loginempresa")}
              >
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código de verificación</Label>
                <Input
                  id="codigo"
                  placeholder="Ingrese el código recibido"
                  required
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Verificar código"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Volver
              </Button>
            </CardFooter>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={nuevaContrasenia}
                  onChange={(e) => setNuevaContrasenia(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-9"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirmarContrasenia}
                  onChange={(e) => setConfirmarContrasenia(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-9"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoadingSpinner /> : "Cambiar contraseña"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep(2)}
              >
                Volver
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
