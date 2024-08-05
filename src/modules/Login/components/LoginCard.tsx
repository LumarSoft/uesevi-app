"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import { setCookie } from "cookies-next";
import LoadingSpinner from "./LoadingSpinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
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
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setHasInput(e.target.value.length > 0);
              }}
              required
            />
            {hasInput && (
              <button
                type="button"
                className="absolute right-2 top-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-base text-center font-semibold">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoadingSpinner /> : "Iniciar sesión"}
        </Button>
      </form>
    </div>
  );
};
