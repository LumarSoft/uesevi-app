"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";

export function ComboboxEmpresas({
  empresas,
  onChangeFilterCombobox,
}: {
  empresas: IEmpresa[];
  onChangeFilterCombobox: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value
            ? empresas.find((empresa) => empresa.nombre === value)?.nombre
            : "Selecciona una empresa..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Busca una empresa" />
          <CommandList>
            <CommandEmpty>Empresa no encontrada</CommandEmpty>
            <CommandGroup>
              {empresas.map((empresa) => (
                <CommandItem
                  key={empresa.id}
                  value={empresa.nombre}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onChangeFilterCombobox(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === empresa.nombre ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {empresa.nombre}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
