import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

export const Formulario = () => {

  // Enviar el formulario a la tabla inscripcion

  return (
    <FramerComponent
    animationInitial={{  opacity: 0 }}
    animationAnimate={{  opacity: 1 }}
    >
      <Card className="">
        <CardHeader>
          <CardTitle>Formulario de Afiliación</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" placeholder="Ingrese su nombre" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  placeholder="Ingrese su apellido"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electronico</Label>
                <Input
                  id="email"
                  placeholder="Ingrese su correo electronico"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telefono</Label>
                <Input
                  id="tel"
                  placeholder="Ingrese su telefono"
                  required
                  type="tel"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cuil">Cuil</Label>
                <Input
                  id="cuil"
                  placeholder="Ingrese su CUIL"
                  required
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="DNI">DNI</Label>
                <Input
                  id="DNI"
                  placeholder="Ingrese su dni"
                  required
                  type="number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nacimiento">Fecha de nacimiento</Label>
                <Input
                  id="nacimiento"
                  placeholder="Nacimiento"
                  required
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nacionalidad">Nacionalidad</Label>
                <Input
                  id="nacionalidad"
                  placeholder="Ingrese su nacionalidad"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nacimiento">Provincia</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                    <SelectItem value="Catamarca">Catamarca</SelectItem>
                    <SelectItem value="Chaco">Chaco</SelectItem>
                    <SelectItem value="Chubut">Chubut</SelectItem>
                    <SelectItem value="Córdoba">Córdoba</SelectItem>
                    <SelectItem value="Corrientes">Corrientes</SelectItem>
                    <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                    <SelectItem value="Formosa">Formosa</SelectItem>
                    <SelectItem value="Jujuy">Jujuy</SelectItem>
                    <SelectItem value="La Pampa">La Pampa</SelectItem>
                    <SelectItem value="La Rioja">La Rioja</SelectItem>
                    <SelectItem value="Mendoza">Mendoza</SelectItem>
                    <SelectItem value="Misiones">Misiones</SelectItem>
                    <SelectItem value="Neuquén">Neuquén</SelectItem>
                    <SelectItem value="Río Negro">Río Negro</SelectItem>
                    <SelectItem value="Salta">Salta</SelectItem>
                    <SelectItem value="San Juan">San Juan</SelectItem>
                    <SelectItem value="San Luis">San Luis</SelectItem>
                    <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                    <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                    <SelectItem value="Santiago del Estero">
                      Santiago del Estero
                    </SelectItem>
                    <SelectItem value="Tierra del Fuego">
                      Tierra del Fuego
                    </SelectItem>
                    <SelectItem value="Tucumán">Tucumán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidad">Localidad</Label>
                <Input
                  id="localidad"
                  placeholder="Ingrese su localidad"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Codigo postal</Label>
                <Input type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidad">Domicilio</Label>
                <Input
                  id="domicilio"
                  placeholder="Ingrese su domicilio"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input type="text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localidad">Categoria</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Vigilador general</SelectItem>
                    <SelectItem value="2">Vigilador bombero</SelectItem>
                    <SelectItem value="3">Administrativo</SelectItem>
                    <SelectItem value="4">Vigilador principal</SelectItem>
                    <SelectItem value="5">Verificador evento</SelectItem>
                    <SelectItem value="6">Operador de monitoreo</SelectItem>
                    <SelectItem value="7">Guia tecnico</SelectItem>
                    <SelectItem value="8">
                      Instalador de elementos de seguridad electronica
                    </SelectItem>
                    <SelectItem value="9">
                      Controlador de admision y permanencia en general
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objetivo">Objetivo</Label>
              <Textarea
                placeholder="Objetivo para con el gremio"
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full">
              Enviar Solicitud
            </Button>
          </form>
        </CardContent>
      </Card>
    </FramerComponent>
  );
};
