import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IEmpleado } from "@/shared/types/Querys/IEmpleado";
import { Pen } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { updateData } from "@/services/mysql/functions";
import { ICategoria } from "@/shared/types/Querys/ICategory";

export const EditEmployee = ({
  employee,
  categories,
  updateEmployee,
}: {
  employee: IEmpleado;
  categories: ICategoria[];
  updateEmployee: (employee: IEmpleado) => void;
}) => {
  const [firstName, setFirstName] = useState(employee.nombre);
  const [lastName, setLastName] = useState(employee.apellido);
  const [cuil, setCuil] = useState(employee.cuil);
  const [category, setCategory] = useState(
    employee.categoria_id?.toString() ?? ""
  );
  const [employmentStatus, setEmploymentStatus] = useState(employee.estado); // Initialize based on your logic
  const [unionMembership, setUnionMembership] = useState(
    employee.sindicato_activo === 1 ? "1" : "0" // Cambiado a "1" o "0"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!firstName || !lastName || !cuil || !category || !employmentStatus) {
      return toast.error("Por favor, completa todos los campos.");
    }

    // Validación específica para CUIL (puedes ajustar según tus necesidades)
    const cuilPattern = /^\d{11}$/; // CUIL debe ser un número de 11 dígitos
    if (!cuilPattern.test(cuil)) {
      return toast.error("El CUIL debe ser un número de 11 dígitos.");
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("cuil", cuil);
    formData.append("category", category);
    formData.append("employmentStatus", employmentStatus);
    formData.append("unionMembership", unionMembership); // Este ahora será "0" o "1"

    try {
      const result = await updateData(
        "employees/editEmployee",
        employee.id,
        formData
      );
      console.log(result);
      if (result.message === "Employee updated") {
        updateEmployee({
          ...employee,
          nombre: firstName,
          apellido: lastName,
          cuil,
          categoria_id: parseInt(category),
          estado: employmentStatus,
          sindicato_activo: parseInt(unionMembership),
        });

        return toast.success("Empleado editado correctamente.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al editar el empleado.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>
            Completa la información del empleado
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <Label htmlFor="firstName">Nombre:</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Apellido:</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cuil">CUIL:</Label>
            <Input
              id="cuil"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría:</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.nombre} {/* Mostrar el nombre de la categoría */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="employmentStatus">Estado de Empleo:</Label>
            <Select
              value={employmentStatus}
              onValueChange={setEmploymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="2">Inactivo</SelectItem>
                <SelectItem value="3">Suspendido</SelectItem>
                <SelectItem value="4">Licencia</SelectItem>
                <SelectItem value="5">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unionMembership">Adhesión al Sindicato:</Label>
            <Select value={unionMembership} onValueChange={setUnionMembership}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Sí</SelectItem> {/* Valor 1 */}
                <SelectItem value="0">No</SelectItem> {/* Valor 0 */}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="submit" variant="secondary">
                Guardar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
