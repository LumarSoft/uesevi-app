"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface EmpresaOption {
  id: number;
  nombre: string;
  cuit: string;
}

interface Props {
  options: EmpresaOption[];
  value: number | null; // empresa_id seleccionado, null = "Todas"
  onChange: (id: number | null) => void;
}

export default function EmpresaCombobox({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = value !== null ? options.find((o) => o.id === value) : null;

  const handleSelect = (id: number) => {
    // Si ya estaba seleccionado, deseleccionar (mostrar todas)
    onChange(id === value ? null : id);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-sm w-full justify-between font-normal"
        >
          <span className="truncate text-left">
            {selected ? selected.nombre : "Buscar empresa por nombre…"}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {selected && (
              <X
                className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] p-0"
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandInput placeholder="Buscar empresa…" />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.id}
                  value={`${o.nombre} ${o.cuit}`}
                  onSelect={() => handleSelect(o.id)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === o.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{o.nombre}</p>
                    <p className="text-xs text-muted-foreground">{o.cuit}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
