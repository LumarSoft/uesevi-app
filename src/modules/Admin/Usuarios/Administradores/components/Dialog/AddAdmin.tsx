import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";

export const AddAdmin = () => {
  return (
    <Button>
      <UserPlusIcon className="mr-2 h-4 w-4" />
      Agregar Administrador
    </Button>
  );
};
