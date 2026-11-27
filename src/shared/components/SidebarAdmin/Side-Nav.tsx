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
import { useHayNovedades } from "@/modules/Admin/Mejoras/useNovedades";

// Ítem del boletín de mejoras: lleva un punto mientras haya algo sin ver.
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
  const hayNovedades = useHayNovedades();

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
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative flex h-12 justify-start",
              path === item.href && "bg-muted font-bold hover:bg-muted"
            )}
          >
            <span className="relative">
              <item.icon className={cn("h-5 w-5", item.color)} />
              {item.href === RUTA_MEJORAS && hayNovedades && (
                // En el ícono y no en el texto: se ve también con el menú cerrado.
                <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9431c] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c9431c] ring-2 ring-background" />
                </span>
              )}
            </span>
            <span
              className={cn(
                "absolute left-12 text-base duration-200",
                !isOpen && className
              )}
            >
              {item.title}
              {item.href === RUTA_MEJORAS && hayNovedades && (
                <span className="sr-only"> (hay novedades sin ver)</span>
              )}
            </span>
          </Link>
        )
      )}
    </nav>
  );
}
