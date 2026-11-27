"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Subnav-Accordion";
import { useEffect, useState } from "react";
import { NavItem } from "@/shared/constants/side-nav-admin";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCantidadNovedades } from "@/modules/Admin/Mejoras/useNovedades";

// Junto a "Mejoras": cuántos cambios nuevos hay sin ver
// (modules/Admin/Mejoras/novedades.ts).
const RUTA_MEJORAS = "/admin/mejoras";

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
  CountCompaniesPending?: number;
}

export function SideNav({
  items,
  setOpen,
  className,
  CountCompaniesPending,
}: SideNavProps) {
  const path = usePathname();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");
  const novedades = useCantidadNovedades();

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);

  return (
    <nav className="space-y-2">
      {items.map((item) =>
        item.isChidren ? (
          <Accordion
            type="single"
            collapsible
            className="space-y-2"
            key={item.title}
            value={openItem}
            onValueChange={setOpenItem}
          >
            <AccordionItem value={item.title} className="border-none">
              <AccordionTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "group relative flex h-12 justify-between px-4 py-2 text-base duration-200 hover:bg-muted hover:no-underline"
                )}
              >
                <div>
                  <item.icon className={cn("h-5 w-5", item.color)} />
                </div>
                <div
                  className={cn(
                    "absolute left-12 text-base duration-200",
                    !isOpen && className
                  )}
                >
                  {item.title}
                </div>

                {isOpen && (
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                )}
              </AccordionTrigger>
              <AccordionContent className="mt-2 space-y-4 pb-1">
                {item.children?.map((child) => (
                  <Link
                    key={child.title}
                    href={child.href}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "group relative flex h-12 justify-start gap-x-3",
                      path === child.href && "bg-muted font-bold hover:bg-muted"
                    )}
                  >
                    <child.icon className={cn("h-5 w-5 shrink-0", child.color)} />
                    <div
                      className={cn(
                        "left-12 text-base duration-200 w-full flex justify-between",
                        !isOpen && className
                      )}
                    >
                      {child.title}
                      {child.title === "Empresas" ? (
                        <Badge className="bg-rose-500 hover:bg-rose-600">
                          {CountCompaniesPending}
                        </Badge>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            key={item.title}
            href={item.href}
            // Marca para el recorrido de presentación de Mejoras.
            data-recorrido={
              item.href === "/admin/mejoras" ? "nav-mejoras" : undefined
            }
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative flex h-12 justify-start",
              path === item.href && "bg-muted font-bold hover:bg-muted"
            )}
          >
            <item.icon className={cn("h-5 w-5", item.color)} />
            <span
              className={cn(
                "absolute left-12 text-base duration-200",
                !isOpen && className
              )}
            >
              {item.title}
              {item.href === RUTA_MEJORAS && novedades > 0 && (
                <span className="sr-only">
                  {` (${novedades} ${novedades === 1 ? "novedad" : "novedades"} sin ver)`}
                </span>
              )}
            </span>
            {item.href === RUTA_MEJORAS &&
              novedades > 0 &&
              (isOpen ? (
                <span
                  aria-hidden
                  className="absolute right-3 min-w-[1.5rem] rounded-full bg-primary px-1.5 py-0.5 text-center text-xs font-semibold tabular-nums text-primary-foreground"
                >
                  {novedades > 9 ? "9+" : novedades}
                </span>
              ) : (
                // Menú achicado: un punto sobre el ícono.
                <span
                  aria-hidden
                  className="absolute left-8 top-2.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"
                />
              ))}
          </Link>
        )
      )}
    </nav>
  );
}
