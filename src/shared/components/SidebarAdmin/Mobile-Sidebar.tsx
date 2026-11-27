import { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SideNav } from "./Side-Nav";
import { NavItemsAdmin } from "@/shared/constants/side-nav-admin";

export const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div
            className="flex items-center justify-center gap-2"
            data-recorrido="menu-movil"
          >
            <MenuIcon />
          </div>
        </SheetTrigger>
        {/* Con un desplegable abierto el menú es más alto que la pantalla del
            celular: sin overflow-y-auto los últimos ítems quedaban afuera. */}
        <SheetContent side="left" className="w-72 overflow-y-auto">
          <div className="px-1 py-6 pt-16">
            <SideNav items={NavItemsAdmin} setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
