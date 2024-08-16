"use client";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IEmpresa } from "@/shared/types/Querys/IEmpresa";
import { Label } from "@/components/ui/label";

export const ComboboxEmpresa = ({ empresas }: { empresas: IEmpresa[] }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");


  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="date-range">Desde y hasta</Label>
      <div className={cn("grid gap-2")}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
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
      </div>
    </div>
  );
};
