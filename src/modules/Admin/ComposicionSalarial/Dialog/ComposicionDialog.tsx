"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { postData, updateData } from "@/services/mysql/functions";
import {
  IComposicionSalarial,
  IConceptoSalarial,
} from "@/shared/types/Querys/IComposicionSalarial";
import {
  CONCEPTOS_POR_DEFECTO,
  MAX_CONCEPTOS,
  MESES,
  calcularTotal,
  colorConcepto,
  formatearMonto,
} from "@/shared/utils/composicionSalarial";

// Fila editable del formulario: el monto se guarda como string para no pelear
// con el input mientras se escribe.
interface FilaConcepto {
  nombre: string;
  monto: string;
}

const aFilas = (conceptos: IConceptoSalarial[]): FilaConcepto[] =>
  conceptos.map((c) => ({ nombre: c.nombre, monto: String(c.monto ?? "") }));

// Sugerencia de período para un alta: el mes siguiente al último cargado, o el
// mes en curso si todavía no hay nada.
const periodoSugerido = (existentes: IComposicionSalarial[]) => {
  const hoy = new Date();
  if (!existentes.length) return { mes: hoy.getMonth() + 1, year: hoy.getFullYear() };
  const ultimo = existentes.reduce((max, c) =>
    c.year * 12 + c.mes > max.year * 12 + max.mes ? c : max
  );
  return ultimo.mes === 12
    ? { mes: 1, year: ultimo.year + 1 }
    : { mes: ultimo.mes + 1, year: ultimo.year };
};

// Un solo diálogo para crear (sin `data`) o editar (con `data`) un período.
export const ComposicionDialog = ({
  data,
  existentes = [],
  onSaved,
}: {
  data?: IComposicionSalarial;
  existentes?: IComposicionSalarial[];
  onSaved: (item: IComposicionSalarial) => void;
}) => {
  const esEdicion = Boolean(data);
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [mes, setMes] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categoria, setCategoria] = useState("Vigilador General");
  const [nota, setNota] = useState("");
  const [publicado, setPublicado] = useState(true);
  const [filas, setFilas] = useState<FilaConcepto[]>(aFilas(CONCEPTOS_POR_DEFECTO));

  // Al abrir se precarga con el registro (edición) o con la sugerencia (alta),
  // así el formulario no arrastra lo que quedó de antes. Se hace en el handler
  // de apertura y no en un useEffect: `existentes` es un array nuevo en cada
  // render y un efecto que dependa de él se re-dispara sin fin.
  const precargar = () => {
    if (data) {
      setMes(data.mes);
      setYear(data.year);
      setCategoria(data.categoria);
      setNota(data.nota ?? "");
      setPublicado(data.publicado !== 0);
      setFilas(aFilas(data.conceptos));
      return;
    }
    const sugerido = periodoSugerido(existentes);
    // Si ya hay un período cargado, arrancamos con sus conceptos como plantilla
    // (lo habitual es que cambien los montos, no los nombres).
    const ultimo = existentes[0];
    setMes(sugerido.mes);
    setYear(sugerido.year);
    setCategoria(ultimo?.categoria ?? "Vigilador General");
    setNota(ultimo?.nota ?? "");
    setPublicado(true);
    setFilas(aFilas(ultimo?.conceptos ?? CONCEPTOS_POR_DEFECTO));
  };

  const cambiarOpen = (valor: boolean) => {
    if (valor) precargar();
    setOpen(valor);
  };

  const conceptos: IConceptoSalarial[] = filas.map((f) => ({
    nombre: f.nombre.trim(),
    monto: Number(f.monto) || 0,
  }));
  const total = calcularTotal(conceptos);

  const actualizarFila = (i: number, campo: keyof FilaConcepto, valor: string) =>
    setFilas((prev) =>
      prev.map((f, idx) => (idx === i ? { ...f, [campo]: valor } : f))
    );

  const agregarFila = () =>
    setFilas((prev) =>
      prev.length < MAX_CONCEPTOS ? [...prev, { nombre: "", monto: "" }] : prev
    );

  const quitarFila = (i: number) =>
    setFilas((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!filas.length) return toast.error("Cargá al menos un concepto.");
    const incompleta = filas.find((f) => !f.nombre.trim() || f.monto === "");
    if (incompleta) {
      return toast.error("Todos los conceptos necesitan nombre y monto.");
    }
    if (conceptos.some((c) => c.monto < 0)) {
      return toast.error("Los montos no pueden ser negativos.");
    }
    if (total <= 0) return toast.error("El total tiene que ser mayor a cero.");

    const formData = new FormData();
    formData.append("year", String(year));
    formData.append("mes", String(mes));
    formData.append("categoria", categoria.trim());
    formData.append("nota", nota.trim());
    formData.append("publicado", publicado ? "1" : "0");
    formData.append("conceptos", JSON.stringify(conceptos));

    setGuardando(true);
    try {
      const result = data
        ? await updateData("salary-composition/:id", data.id, formData)
        : await postData("salary-composition", formData);

      if (result.ok && result.data) {
        toast.success(esEdicion ? "Período actualizado." : "Período cargado.");
        onSaved(result.data);
        setOpen(false);
      } else {
        toast.error(result.message || "No se pudo guardar el período.");
      }
    } catch (error) {
      console.error("Error al guardar la composición salarial:", error);
      toast.error("Error al guardar el período.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={cambiarOpen}>
      <DialogTrigger asChild>
        {esEdicion ? (
          <Button size="sm" className="flex gap-2">
            Editar <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="flex gap-2">
            <Plus className="h-4 w-4" /> Cargar período
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {esEdicion ? "Editar período" : "Cargar período"}
          </DialogTitle>
          <DialogDescription>
            Es lo que ven los afiliados en la home como &quot;Salario del
            mes&quot;. El total se calcula solo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="mes">Mes</Label>
              <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
                <SelectTrigger id="mes">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((nombre, i) => (
                    <SelectItem key={nombre} value={String(i + 1)}>
                      {nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                min={2000}
                max={2100}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={categoria}
              maxLength={120}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Vigilador General"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Conceptos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={agregarFila}
                disabled={filas.length >= MAX_CONCEPTOS}
              >
                <Plus className="mr-1 h-4 w-4" /> Agregar concepto
              </Button>
            </div>
            <div className="grid gap-2">
              {filas.map((fila, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: colorConcepto(i).fill }}
                  />
                  <Input
                    aria-label={`Nombre del concepto ${i + 1}`}
                    placeholder="Concepto"
                    maxLength={60}
                    value={fila.nombre}
                    onChange={(e) => actualizarFila(i, "nombre", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    aria-label={`Monto del concepto ${i + 1}`}
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Monto"
                    value={fila.monto}
                    onChange={(e) => actualizarFila(i, "monto", e.target.value)}
                    className="w-36"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Quitar concepto ${i + 1}`}
                    onClick={() => quitarFila(i)}
                    disabled={filas.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-right text-sm">
              Total:{" "}
              <span className="font-semibold tabular-nums">{formatearMonto(total)}</span>
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="nota">Nota al pie (opcional)</Label>
            <Textarea
              id="nota"
              rows={2}
              maxLength={255}
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ej: Vigilador General, sin adicional regional. Viáticos: referencia de 25 días."
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="publicado"
              checked={publicado}
              onCheckedChange={(v) => setPublicado(v === true)}
            />
            <Label htmlFor="publicado" className="font-normal">
              Publicado (visible en la web). Si lo destildás queda como borrador.
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
