"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { filterEmpresas } from "@/shared/utils/filterEmpresas"

export function Combobox({ data }: { data: any[] }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const empresas = filterEmpresas(data)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? empresas.find((empresa) => empresa.value === value)?.label
            : "Seleccionar empresa..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar empresa..." />
          <CommandEmpty>No se encontraron empresas.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {empresas.map((empresa) => (
                <CommandItem
                  key={empresa.value}
                  value={empresa.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === empresa.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {empresa.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}