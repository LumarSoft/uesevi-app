"use client";
import { Building2 } from "lucide-react";
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
import { userStore } from "@/shared/stores/userStore";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function LoginEmpresaModule() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await postData("login/loginEmpresa", formData);
      const { data } = result;
      if (data.error) {
        toast.error(result.data.details.message);
      }
      console.log(data);
      const { user, token } = data;

      userStore.getState().setAuth(token, user);
      setCookie("auth-token", token);

      console.log("Usuario autenticado", user);

      router.replace("/empresa/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al iniciar sesión");
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
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              required
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            Iniciar sesión
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
