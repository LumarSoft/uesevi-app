import { FramerComponent } from "@/shared/Framer/FramerComponent";
import { Form } from "./components/Form";

export const EmpresaAltaModule = () => {
  return (
    <FramerComponent
      style="container mx-auto px-4 py-20"
      animationInitial={{ opacity: 0 }}
      animationAnimate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Alta de empresa</h1>
      <Form />
    </FramerComponent>
  );
};
