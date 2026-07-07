"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { fetchData, updateData } from "@/services/mysql/functions";
import { CompanyManagementRow } from "@/shared/types/PaymentsPanel";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onChanged: () => void; // refrescar grilla al cerrar/cambiar
}

export default function GestionEmpresasModal({
  open,
  onOpenChange,
  onChanged,
}: Props) {
  const [companies, setCompanies] = useState<CompanyManagementRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  const fetchCompanies = () => {
    setLoading(true);
    fetchData("payments-panel/companies-management")
      .then((res) => setCompanies(Array.isArray(res?.data) ? res.data : []))
      .catch((e) => console.error("Error gestión empresas:", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) {
      setSearch("");
      setDirty(false);
      fetchCompanies();
    }
  }, [open]);

  // Buscador por nombre. El orden por adeudadas (desc) viene del backend.
  const visible = useMemo(() => {
    if (!search.trim()) return companies;
    const q = search.trim().toLowerCase();
    return companies.filter((c) => c.nombre.toLowerCase().includes(q));
  }, [companies, search]);

  const toggle = async (company: CompanyManagementRow, activar: boolean) => {
    const nuevoEstado = activar ? "Activo" : "Inactivo";
    setSavingId(company.id);
    // Optimista
    setCompanies((prev) =>
      prev.map((c) => (c.id === company.id ? { ...c, estado: nuevoEstado } : c))
    );
    try {
      const fd = new FormData();
      fd.append("state", nuevoEstado);
      const res = await updateData("companies/:id/state", company.id, fd);
      if (res && res.ok === false) throw new Error(res.message);
      setDirty(true);
    } catch (e) {
      console.error("Error al cambiar estado:", e);
      // Revertir
      setCompanies((prev) =>
        prev.map((c) => (c.id === company.id ? { ...c, estado: company.estado } : c))
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (!v && dirty) onChanged();
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestionar empresas activas / inactivas</DialogTitle>
          <DialogDescription>
            Las empresas inactivas no aparecen en la grilla ni en los
            indicadores, pero conservan su historial. Ordenadas por declaraciones
            adeudadas (último año).
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="Buscar empresa por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-[55vh] space-y-1 overflow-y-auto pr-1">
          {loading ? (
            <p className="py-6 text-center text-muted-foreground">Cargando…</p>
          ) : visible.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              Sin resultados.
            </p>
          ) : (
            visible.map((c) => {
              const activa = c.estado === "Activo";
              return (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border p-2 hover:bg-muted/40"
                >
                  <Checkbox
                    checked={activa}
                    disabled={savingId === c.id}
                    onCheckedChange={(checked) => toggle(c, Boolean(checked))}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.nombre}</p>
                    <p className="text-xs text-muted-foreground">{c.cuit}</p>
                  </div>
                  {c.adeudadas > 0 && (
                    <Badge variant="destructive" title="Declaraciones adeudadas (último año)">
                      {c.adeudadas} adeud.
                    </Badge>
                  )}
                  <Badge variant={activa ? "default" : "secondary"}>
                    {activa ? "Activa" : "Inactiva"}
                  </Badge>
                </label>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
