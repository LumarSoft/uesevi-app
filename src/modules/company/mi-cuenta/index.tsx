"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
import { fetchData } from "@/services/mysql/functions";
import { userStore } from "@/shared/stores/userStore";

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const MIN_PASSWORD_LENGTH = 8;

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

interface Cuenta {
  id: number;
  email: string;
  nombre: string | null;
  apellido: string | null;
  empresa: { id: number; nombre: string; cuit: string } | null;
}

// PUT sin id en la URL: updateData() siempre reemplaza ":id", así que para
// /account/* se arma la request acá con el mismo formato (FormData + Bearer).
const putAccount = async (path: string, body: FormData) => {
  const token = userStore.getState().token;
  try {
    const response = await fetch(`${BASE_API_URL}/account/${path}`, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
    if (response.status === 401) {
      userStore.getState().logout();
      window.location.href = "/loginempresa";
    }
    return await response.json();
  } catch (error: any) {
    return { ok: false, message: error?.message || "Error de conexión" };
  }
};

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-1 top-0 h-full"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}

export default function MiCuentaModule() {
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [loadingCuenta, setLoadingCuenta] = useState(true);

  const [nuevoEmail, setNuevoEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [passwordEmail, setPasswordEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      const result = await fetchData("account");
      if (result.ok) setCuenta(result.data);
      else toast.error(result.message || "No se pudieron obtener los datos de la cuenta");
      setLoadingCuenta(false);
    };
    cargar();
  }, []);

  const handleCambiarEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = nuevoEmail.trim().toLowerCase();

    if (!isValidEmail(email)) {
      toast.error("Ingrese un correo electrónico válido.");
      return;
    }
    if (email !== confirmarEmail.trim().toLowerCase()) {
      toast.error("Los emails no coinciden.");
      return;
    }

    setSavingEmail(true);
    const body = new FormData();
    body.append("newEmail", email);
    body.append("currentPassword", passwordEmail);
    const result = await putAccount("email", body);
    setSavingEmail(false);

    if (!result.ok) {
      toast.error(result.message || "No se pudo cambiar el email.");
      return;
    }

    // La API devuelve un token nuevo con el email actualizado.
    const { token, user } = userStore.getState();
    userStore
      .getState()
      .setAuth(result.data?.token || token || "", { ...user, email: result.data?.email });
    setCuenta((prev) => (prev ? { ...prev, email: result.data?.email } : prev));
    setNuevoEmail("");
    setConfirmarEmail("");
    setPasswordEmail("");
    toast.success("Email de acceso actualizado. Desde ahora ingrese con el nuevo email.");
  };

  const handleCambiarPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordNueva.length < MIN_PASSWORD_LENGTH) {
      toast.error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setSavingPassword(true);
    const body = new FormData();
    body.append("currentPassword", passwordActual);
    body.append("newPassword", passwordNueva);
    const result = await putAccount("password", body);
    setSavingPassword(false);

    if (!result.ok) {
      toast.error(result.message || "No se pudo cambiar la contraseña.");
      return;
    }

    setPasswordActual("");
    setPasswordNueva("");
    setPasswordConfirmar("");
    toast.success("Contraseña actualizada con éxito.");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Mi cuenta</h2>
          <p className="text-muted-foreground">
            {loadingCuenta
              ? "Cargando datos de la cuenta…"
              : cuenta
                ? `${cuenta.empresa?.nombre ?? ""}${cuenta.empresa?.cuit ? ` · CUIT ${cuenta.empresa.cuit}` : ""}`
                : ""}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <form onSubmit={handleCambiarEmail}>
              <CardHeader>
                <CardTitle>Email de acceso</CardTitle>
                <CardDescription>
                  Es el email con el que ingresa al sistema y al que llegan los códigos para
                  recuperar la contraseña. Cada empresa debe tener uno distinto.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email actual</Label>
                  <Input value={cuenta?.email ?? ""} disabled readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nuevoEmail">Nuevo email</Label>
                  <Input
                    id="nuevoEmail"
                    type="email"
                    value={nuevoEmail}
                    onChange={(e) => setNuevoEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarEmail">Repetir nuevo email</Label>
                  <Input
                    id="confirmarEmail"
                    type="email"
                    value={confirmarEmail}
                    onChange={(e) => setConfirmarEmail(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordEmail">Contraseña actual</Label>
                  <PasswordInput
                    id="passwordEmail"
                    value={passwordEmail}
                    onChange={setPasswordEmail}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={savingEmail || loadingCuenta}>
                  {savingEmail ? "Guardando…" : "Cambiar email"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card>
            <form onSubmit={handleCambiarPassword}>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>
                  Mínimo {MIN_PASSWORD_LENGTH} caracteres.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordActual">Contraseña actual</Label>
                  <PasswordInput
                    id="passwordActual"
                    value={passwordActual}
                    onChange={setPasswordActual}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordNueva">Nueva contraseña</Label>
                  <PasswordInput
                    id="passwordNueva"
                    value={passwordNueva}
                    onChange={setPasswordNueva}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirmar">Repetir nueva contraseña</Label>
                  <PasswordInput
                    id="passwordConfirmar"
                    value={passwordConfirmar}
                    onChange={setPasswordConfirmar}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={savingPassword}>
                  {savingPassword ? "Guardando…" : "Cambiar contraseña"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
