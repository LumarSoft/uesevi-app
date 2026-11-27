"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";
import {
  MENSAJE_SESION_VENCIDA,
  mensajeDeErrorDeLogin,
  tomarAvisoSesionVencida,
} from "@/shared/utils/sesionVencida";

import LoadingSpinner from "./LoadingSpinner";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasInput, setHasInput] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aviso, setAviso] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (tomarAvisoSesionVencida()) setAviso(MENSAJE_SESION_VENCIDA);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAviso("");

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("rol", "admin");

      // Sin console.log de la respuesta: traía el token de sesión.
      const response = await postData("login", formData);

      if (response.ok && response.data) {
        const { token, user } = response.data;

        if (user.rol !== "admin") {
          setError(
            "Acceso denegado. El usuario no tiene el rol de administrador."
          );
          setLoading(false);
          return;
        }

        userStore.getState().setAuth(token, user as any);

        router.replace("/admin/dashboard");
      } else {
        // "Contraseña incorrecta", "El correo electrónico no existe" o
        // "Demasiados intentos…", tal como lo dice la API.
        setError(mensajeDeErrorDeLogin(response));
        setLoading(false);
      }
    } catch {
      setError(mensajeDeErrorDeLogin({}));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-lg border border-zinc-300">
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
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setHasInput(e.target.value.length > 0);
                setError("");
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
        {aviso && !error && (
          <p
            role="status"
            className="text-amber-700 text-base text-center font-semibold"
          >
            {aviso}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="text-red-500 text-base text-center font-semibold"
          >
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
