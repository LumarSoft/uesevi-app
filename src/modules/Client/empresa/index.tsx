import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FramerComponent } from "@/shared/Framer/FramerComponent";

export const EmpresaAltaModule = () => {
  return (
    <FramerComponent
      style="container mx-auto px-4 py-20"
      animationInitial={{ opacity: 0 }}
      animationAnimate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Alta de empresa</h1>
      <Card>
        <CardHeader>
          <CardTitle>Formulario de alta</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <h4 className="text-center text-2xl font-semibold">
              Datos de la empresa
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Cuit</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el cuit de la empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input placeholder="Ingrese el nombre de la empresa" required />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="domicilio">Domicilio</Label>
                <Input
                  id="email"
                  placeholder="Ingrese el domicilio de la empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tel">Telefono</Label>
                <Input
                  id="tel"
                  placeholder="Ingrese el telefono de la empresa"
                  required
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="localidad">Localidad</Label>
              <Input placeholder="Localidad de la empresa" />
            </div>

            <h4 className="text-center text-2xl font-semibold">
              Persona de contacto
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del contacto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input
                  placeholder="Ingrese el apellido del contacto"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Telefono</Label>
                <Input
                  placeholder="Ingrese el telefono del contacto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Correo electronico</Label>
                <Input placeholder="Ingrese el email del contacto" required />
              </div>
            </div>

            <h4 className="text-center text-2xl font-semibold">
              Creedenciales del sistema
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Usuario</Label>
                <Input placeholder="Ingrese el usuario del sistema" required />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input
                  placeholder="Ingrese la contraseña del sistema"
                  required
                />
              </div>
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