"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { setCookie } from "cookies-next";
export const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await postData("login", {
        email,
        password,
        rol: "admin",
      });

      console.log("Respuesta del servidor:", response);

      if (response.ok && response.data) {
        const { token, user } = response.data;

        userStore.getState().setAuth(token, user as any);
        setCookie("auth-token", token);

        if (user.rol === "admin") {
          router.replace("/admin/dashboard");
          console.log(user.rol);
        } else if (user.rol === "empresa") {
          router.replace("/admin/empresa/dashboard");
        } else {
          setError("Rol de usuario no reconocido");
        }
      } else {
        setError("Error al iniciar sesión. Por favor, intente de nuevo.");
      }
    } catch (error: any) {
      console.error("Error en login:", error);
      setError("Error al iniciar sesión. Por favor, intente de nuevo.");
    }
  };

  return (
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-lg border border-zinc-300">
      <h1 className="text-black">administracion@uesevi.org.ar</h1>
      <h1 className="text-black">Zuviria5975</h1>

      <div>
        <img
          className="mx-auto w-72"
          src="/logo_uesevi.png"
          alt="Uesevi logo"
        />
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="text-red-500 text-base text-center font-semibold">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
};
