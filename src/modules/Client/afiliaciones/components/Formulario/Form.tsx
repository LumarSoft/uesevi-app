"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { toast } from "react-toastify";
import { postData } from "@/services/mysql/functions";
import { Info } from "lucide-react";

export const Form = () => {
  // States for personal information
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cuil, setCuil] = useState("");
  const [dni, setDni] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [nationality, setNationality] = useState("");
  const [province, setProvince] = useState(""); // For provinces
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [childrenCount, setChildrenCount] = useState(0);

  // States for company information
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyCity, setCompanyCity] = useState("");
  const [companyPostalCode, setCompanyPostalCode] = useState("");
  const [companyProvince, setCompanyProvince] = useState(""); // For provinces in the company section
  const [companyCuit, setCompanyCuit] = useState("");
  const [objective, setObjective] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    if (!lastName.trim()) {
      toast.error("El apellido es requerido");
      return;
    }
    // Crear objeto FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("cuil", cuil);
    formData.append("dni", dni);
    formData.append("birthDate", birthDate);
    formData.append("birthPlace", birthPlace);
    formData.append("nationality", nationality);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("postalCode", postalCode);
    formData.append("civilStatus", civilStatus);
    formData.append("childrenCount", childrenCount.toString()); // Asegurarse de que sea un string
    formData.append("company", company);
    formData.append("category", category);
    formData.append("entryDate", entryDate);
    formData.append("companyPhone", companyPhone);
    formData.append("companyAddress", companyAddress);
    formData.append("companyCity", companyCity);
    formData.append("companyPostalCode", companyPostalCode);
    formData.append("companyProvince", companyProvince);
    formData.append("companyCuit", companyCuit);
    formData.append("objective", objective);

    try {
      const result = await postData("forms", formData);
      console.log(result);
      if (result.ok) {
        setName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setCuil("");
        setDni("");
        setBirthDate("");
        setBirthPlace("");
        setNationality("");
        setProvince("");
        setCity("");
        setAddress("");
        setPostalCode("");
        setCivilStatus("");
        setChildrenCount(0);
        setCompany("");
        setCategory("");
        setEntryDate("");
        setCompanyPhone("");
        setCompanyAddress("");
        setCompanyCity("");
        setCompanyPostalCode("");
        setCompanyProvince("");
        setCompanyCuit("");
        setObjective("");
        return toast.success("Formulario enviado correctamente");
      }
    } catch (error) {}
  };

  return (
    <FramerComponent
      animationInitial={{ opacity: 0 }}
      animationAnimate={{ opacity: 1 }}
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>CUIL</Label>
                <Input value={cuil} onChange={(e) => setCuil(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>DNI</Label>
                <Input value={dni} onChange={(e) => setDni(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Lugar de Nacimiento</Label>
                <Input
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Nacionalidad</Label>
                <Input
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Provincia</Label>
                <Select onValueChange={(value) => setProvince(value)}>
                  <SelectTrigger>
                    <SelectValue>{province || "Seleccionar"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                    <SelectItem value="Catamarca">Catamarca</SelectItem>
                    <SelectItem value="Chaco">Chaco</SelectItem>
                    <SelectItem value="Chubut">Chubut</SelectItem>
                    <SelectItem value="Córdoba">Córdoba</SelectItem>
                    <SelectItem value="Corrientes">Corrientes</SelectItem>
                    <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                    <SelectItem value="Formosa">Formosa</SelectItem>
                    <SelectItem value="Jujuy">Jujuy</SelectItem>
                    <SelectItem value="La Pampa">La Pampa</SelectItem>
                    <SelectItem value="La Rioja">La Rioja</SelectItem>
                    <SelectItem value="Mendoza">Mendoza</SelectItem>
                    <SelectItem value="Misiones">Misiones</SelectItem>
                    <SelectItem value="Neuquén">Neuquén</SelectItem>
                    <SelectItem value="Río Negro">Río Negro</SelectItem>
                    <SelectItem value="Salta">Salta</SelectItem>
                    <SelectItem value="San Juan">San Juan</SelectItem>
                    <SelectItem value="San Luis">San Luis</SelectItem>
                    <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                    <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                    <SelectItem value="Santiago del Estero">
                      Santiago del Estero
                    </SelectItem>
                    <SelectItem value="Tierra del Fuego">
                      Tierra del Fuego
                    </SelectItem>
                    <SelectItem value="Tucumán">Tucumán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Código Postal</Label>
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Estado Civil</Label>
                <Select onValueChange={(value) => setCivilStatus(value)}>
                  <SelectTrigger>
                    <SelectValue>{civilStatus || "Seleccionar"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Soltero">Soltero</SelectItem>
                    <SelectItem value="Casado">Casado</SelectItem>
                    <SelectItem value="Divocriado">Divorciado</SelectItem>
                    <SelectItem value="Viudo">Viudo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cantidad de Hijos</Label>
                <Input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                />
              </div>

              <CardTitle className="lg:col-span-3">
                Información de la Empresa
              </CardTitle>

              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha de Ingreso</Label>
                <Input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Teléfono de la Empresa</Label>
                <Input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Dirección de la Empresa</Label>
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ciudad de la Empresa</Label>
                <Input
                  value={companyCity}
                  onChange={(e) => setCompanyCity(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Código Postal de la Empresa</Label>
                <Input
                  value={companyPostalCode}
                  onChange={(e) => setCompanyPostalCode(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Provincia de la Empresa</Label>
                <Select onValueChange={(value) => setCompanyProvince(value)}>
                  <SelectTrigger>
                    <SelectValue>
                      {companyProvince || "Seleccionar"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                    <SelectItem value="Catamarca">Catamarca</SelectItem>
                    <SelectItem value="Chaco">Chaco</SelectItem>
                    <SelectItem value="Chubut">Chubut</SelectItem>
                    <SelectItem value="Córdoba">Córdoba</SelectItem>
                    <SelectItem value="Corrientes">Corrientes</SelectItem>
                    <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                    <SelectItem value="Formosa">Formosa</SelectItem>
                    <SelectItem value="Jujuy">Jujuy</SelectItem>
                    <SelectItem value="La Pampa">La Pampa</SelectItem>
                    <SelectItem value="La Rioja">La Rioja</SelectItem>
                    <SelectItem value="Mendoza">Mendoza</SelectItem>
                    <SelectItem value="Misiones">Misiones</SelectItem>
                    <SelectItem value="Neuquén">Neuquén</SelectItem>
                    <SelectItem value="Río Negro">Río Negro</SelectItem>
                    <SelectItem value="Salta">Salta</SelectItem>
                    <SelectItem value="San Juan">San Juan</SelectItem>
                    <SelectItem value="San Luis">San Luis</SelectItem>
                    <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                    <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                    <SelectItem value="Santiago del Estero">
                      Santiago del Estero
                    </SelectItem>
                    <SelectItem value="Tierra del Fuego">
                      Tierra del Fuego
                    </SelectItem>
                    <SelectItem value="Tucumán">Tucumán</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>CUIT</Label>
                <Input
                  value={companyCuit}
                  onChange={(e) => setCompanyCuit(e.target.value)}
                />
              </div>

              <div className="space-y-2 lg:col-span-3">
                <Label>Objetivo</Label>
                <Textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-6 mb-4 p-4 bg-yellow-50 text-yellow-700 rounded-md border border-yellow-200 shadow-sm">
              <Info className="w-6 h-6 flex-shrink-0 mt-1 sm:mt-0" />
              <div className="text-sm sm:text-base">
                <p className="font-semibold mb-1">
                  Validación presencial requerida
                </p>
                <p>
                  Por favor, visite nuestra oficina para validar su información:
                </p>
                <p>
                  Para completar la afiliación, deberá presentarse con recibo de
                  haberes y DNI físico en la sede sindical
                </p>
                <p className="font-bold mt-2">
                  Dirección:{" "}
                  <span className="underline">Mariano Moreno 58</span>
                </p>
                <p className="mt-1">
                  Horario: Lunes a viernes, de 9:00 a.m. a 14:00 p.m.
                </p>
              </div>
            </div>

            <Button type="submit" className="mt-4 w-full">
              Enviar
            </Button>
          </CardContent>
        </Card>
      </form>
    </FramerComponent>
  );
};
