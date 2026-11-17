"use client";
import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postData } from "@/services/mysql/functions";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { normalizeText } from "../../normalizeText";

// Alta de la ficha de afiliación desde el panel. Antes la completaba el propio
// afiliado en /afiliaciones del sitio público; desde 11/2026 UESEVI pidió que
// no sea pública y la carga el personal del sindicato cuando la persona se
// presenta en la sede. Los campos y las claves que se mandan son los mismos que
// tenía el formulario público (POST /forms, tabla `inscripcion`).

const PROVINCIAS = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const ESTADOS_CIVILES = ["Soltero", "Casado", "Divorciado", "Viudo"];

const FICHA_VACIA = {
  name: "",
  lastName: "",
  email: "",
  phone: "",
  cuil: "",
  dni: "",
  birthDate: "",
  birthPlace: "",
  nationality: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
  civilStatus: "",
  childrenCount: "0",
  company: "",
  category: "",
  entryDate: "",
  companyPhone: "",
  companyAddress: "",
  companyCity: "",
  companyPostalCode: "",
  companyProvince: "",
  companyCuit: "",
  objective: "",
};

type Ficha = typeof FICHA_VACIA;
type CampoFicha = keyof Ficha;

// Se guardan sin acentos y en minúsculas, igual que las fichas que llegaban del
// formulario público, para que el listado y la impresión queden parejos.
const CAMPOS_NORMALIZADOS: CampoFicha[] = [
  "name",
  "lastName",
  "email",
  "birthPlace",
  "nationality",
  "province",
  "city",
  "address",
  "civilStatus",
  "company",
  "category",
  "companyAddress",
  "companyCity",
  "companyProvince",
];

export const NuevaFicha = ({
  companies,
  onCreated,
}: {
  companies: IEmpresa[];
  onCreated: () => void | Promise<void>;
}) => {
  const [open, setOpen] = useState(false);
  const [enviando, setEnviando] = useState(false);
  // El borrador vive fuera del contenido del diálogo: si se cierra sin querer
  // no se pierde lo que ya se cargó.
  const [ficha, setFicha] = useState<Ficha>(FICHA_VACIA);

  const set = (campo: CampoFicha) => (valor: string) =>
    setFicha((prev) => ({ ...prev, [campo]: valor }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (enviando) return;

    if (!ficha.name.trim()) return toast.error("El nombre es requerido");
    if (!ficha.lastName.trim()) return toast.error("El apellido es requerido");

    const formData = new FormData();
    (Object.keys(ficha) as CampoFicha[]).forEach((campo) => {
      const valor = ficha[campo].trim();
      formData.append(
        campo,
        CAMPOS_NORMALIZADOS.includes(campo) ? normalizeText(valor) : valor
      );
    });

    setEnviando(true);
    try {
      const result = await postData("forms", formData);
      if (!result.ok) {
        toast.error(result.message || "No se pudo guardar la ficha");
        return;
      }
      toast.success("Ficha de afiliación cargada");
      setFicha(FICHA_VACIA);
      setOpen(false);
      await onCreated();
    } finally {
      setEnviando(false);
    }
  };

  const texto = (
    campo: CampoFicha,
    label: string,
    maxLength: number,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className="space-y-2">
      <Label htmlFor={`ficha-${campo}`}>
        {label}
        {props.required && <span className="text-orange-600 font-bold"> *</span>}
      </Label>
      <Input
        id={`ficha-${campo}`}
        value={ficha[campo]}
        maxLength={maxLength}
        onChange={(e) => set(campo)(e.target.value)}
        {...props}
      />
    </div>
  );

  const selector = (campo: CampoFicha, label: string, opciones: string[]) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={ficha[campo]} onValueChange={set(campo)}>
        <SelectTrigger aria-label={label}>
          <SelectValue placeholder="Seleccionar" />
        </SelectTrigger>
        <SelectContent>
          {opciones.map((opcion) => (
            <SelectItem key={opcion} value={opcion}>
              {opcion}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          Nueva ficha <FilePlus2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        // Un clic afuera no cierra el diálogo: son muchos campos para perderlos.
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Nueva ficha de afiliación</DialogTitle>
          <DialogDescription>
            Carga interna de UESEVI. Los campos con{" "}
            <span className="text-orange-600 font-bold">*</span> son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h3 className="font-semibold">Información personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {texto("name", "Nombre", 100, { required: true, autoFocus: true })}
              {texto("lastName", "Apellido", 100, { required: true })}
              {texto("email", "Email", 150, { type: "email" })}
              {texto("phone", "Teléfono", 20, { type: "tel" })}
              {texto("cuil", "CUIL", 20, { inputMode: "numeric" })}
              {texto("dni", "DNI", 20, { inputMode: "numeric" })}
              {texto("birthDate", "Fecha de nacimiento", 10, { type: "date" })}
              {texto("birthPlace", "Lugar de nacimiento", 255)}
              {texto("nationality", "Nacionalidad", 50)}
              {selector("province", "Provincia", PROVINCIAS)}
              {texto("city", "Ciudad", 100)}
              {texto("address", "Dirección", 150)}
              {texto("postalCode", "Código postal", 10)}
              {selector("civilStatus", "Estado civil", ESTADOS_CIVILES)}
              {texto("childrenCount", "Cantidad de hijos", 3, {
                type: "number",
                min: 0,
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-semibold">Información de la empresa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {texto("company", "Empresa", 100, { list: "ficha-empresas" })}
              <datalist id="ficha-empresas">
                {companies.map((empresa) => (
                  <option key={empresa.id} value={empresa.nombre} />
                ))}
              </datalist>
              {texto("category", "Categoría", 50)}
              {texto("entryDate", "Fecha de ingreso", 10, { type: "date" })}
              {texto("companyPhone", "Teléfono de la empresa", 50, { type: "tel" })}
              {texto("companyAddress", "Dirección de la empresa", 255)}
              {texto("companyCity", "Ciudad de la empresa", 255)}
              {texto("companyPostalCode", "Código postal de la empresa", 20)}
              {selector("companyProvince", "Provincia de la empresa", PROVINCIAS)}
              {texto("companyCuit", "CUIT", 20, { inputMode: "numeric" })}
              <div className="space-y-2 md:col-span-3">
                <Label htmlFor="ficha-objective">Objetivo</Label>
                <Textarea
                  id="ficha-objective"
                  value={ficha.objective}
                  onChange={(e) => set("objective")(e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFicha(FICHA_VACIA)}
              disabled={enviando}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? "Guardando..." : "Guardar ficha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
