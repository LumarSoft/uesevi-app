"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handlesubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rol: "admin" }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        router.push("/admin/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
      console.log(error);
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
      <form className="mt-8 space-y-6" onSubmit={handlesubmit}>
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

        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full">
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
};
