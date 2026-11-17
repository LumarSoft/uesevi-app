import { Beneficios } from "./components/Beneficios/Beneficios";
import { ComoAfiliarse } from "./components/ComoAfiliarse/ComoAfiliarse";

export default function AfiliacionesModule() {
  return (
    <div className="container mx-auto px-4 py-28">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Afiliación al Gremio
      </h1>
      <Beneficios />
      <ComoAfiliarse />
    </div>
  );
}
