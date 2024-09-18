"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgregarEmpleadosModule() {
  const handleSubmit = async () => {};

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Agregar empleado
          </h2>
        </div>
        <div>
          <Label>
            Nombre
            <Input />
          </Label>
          <Label>
            Apellido
            <Input />
          </Label>
          <Label>
            CUIL (no debe contenewr )
            <Input />
          </Label>
          <Label>
            Categoria
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Estado empleo
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Label>
            Adhesion Sindicato
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </Label>
        </div>
      </div>
    </div>
  );
}
