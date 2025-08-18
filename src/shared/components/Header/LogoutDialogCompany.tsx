import { userStore } from "@/shared/stores/userStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearAuthToken } from "@/shared/utils/tokenUtils";

export const LogoutDialogCompany = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const logout = userStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    clearAuthToken();
    router.push("/loginempresa");
    setIsDialogOpen(false);
  };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Cerrar sesión
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[385px]">
        <DialogHeader>
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogDescription className="text-base text-center">
            ¿Estás seguro de que quieres cerrar tu sesión?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsDialogOpen(false)}
            className="mr-2"
          >
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
