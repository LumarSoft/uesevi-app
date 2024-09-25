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
import { IOldEmpresa } from "@/shared/types/Querys/IOldEmpresa";

export const ComboboxCompanies = ({
  companies,
  companyProp,
  setCompany,
}: {
  companies: IOldEmpresa[];
  companyProp: number | null;
  setCompany: (companyitem: number | null) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-2 w-full">
      <Label htmlFor="date-range">Empresa</Label>
      <div className={cn("grid gap-2")}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {companyProp
                ? companies.find((empresa) => empresa.id === companyProp)
                    ?.nombre
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
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={String(company.id)}
                      onSelect={() => {
                        setCompany(
                          companyProp === company.id ? null : company.id
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          companyProp === company.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {company.nombre}
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
