import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Heart,
  ShieldPlus,
  Gift,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function FormPreview() {
  return (
    <Card className="w-full px-4 md:px-28 2xl:px-80 mx-auto py-10 border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-blue-800 dark:text-blue-200">
          Nuestros beneficios
        </CardTitle>
        <p className="mt-2 text-blue-600 dark:text-blue-300">
          Únete a nuestro gremio y accede a beneficios exclusivos
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <BenefitCard
          icon={<Heart className="w-8 h-8 text-red-500" />}
          title="Cobertura Médica"
          description="Emergencias, urgencias y visitas domiciliarias"
        />

        <BenefitCard
          icon={<Gift className="w-8 h-8 text-yellow-500" />}
          title="Beneficios Familiares"
          description="Subsidios por nacimiento y kit escolar"
        />
        <BenefitCard
          icon={<ShieldPlus className="w-8 h-8 text-green-500" />}
          title="Descuentos en Farmacias"
          description="50% en red de farmacias colegiadas"
        />
        <BenefitCard
          icon={<Briefcase className="w-8 h-8 text-purple-500" />}
          title="Apoyo Profesional"
          description="Respaldo en tu trayectoria profesional en seguridad."
        />
      </CardContent>
      <CardFooter className="flex justify-center mt-6">
        <Link href="/afiliaciones">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Descubre todos los beneficios y afíliate
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Link href={"/afiliaciones"}>
      <div className="flex flex-col items-center p-4 hover:bg-muted transition dark:bg-blue-900 rounded-lg shadow-md">
        {icon}
        <h3 className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-200">
          {title}
        </h3>
        <p className="mt-1 text-sm text-center text-blue-600 dark:text-blue-300">
          {description}
        </p>
      </div>
    </Link>
  );
}
