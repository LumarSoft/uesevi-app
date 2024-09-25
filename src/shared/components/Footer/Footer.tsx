import { Facebook, Twitter, Instagram, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="font-bold text-2xl mb-4 text-blue-300">
              Sobre nosotros
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Representamos a los trabajadores que prestan servicios en todas
              las empresas y/o agencias privadas de seguridad y/o vigilancia y
              empresas de investigación privada
            </p>
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-6 text-blue-300">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/loginempresa"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Ingreso empresa
                </Link>
              </li>
              <li>
                <Link
                  href="/escalas"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Escalas salariales
                </Link>
              </li>
              <li>
                <Link
                  href="/afiliacion-empresa"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Alta de empresa
                </Link>
              </li>
              <li>
                <Link
                  href="/afiliaciones"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Afiliaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/noticias/page/1"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Noticias
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-300 hover:text-white transition-colors hover:underline"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-6 text-blue-300">
              Contáctenos
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              ¿Tiene alguna pregunta? No dude en contactarnos.
            </p>

            <Link href="/contacto">
              {" "}
              <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                Enviar mensaje
              </Button>
            </Link>
          </div>
        </div>
        <Separator className="my-8 bg-gray-700" />
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()} UESEVI. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
