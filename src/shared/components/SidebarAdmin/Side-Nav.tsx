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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Nacho } from "@/shared/components/Nacho";

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

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);

  // Con la barra colapsada el título de cada ítem va en un tooltip, que Radix
  // renderiza en un portal. Antes se dibujaba dentro del propio nav, y eso dejó
  // de funcionar cuando el contenedor pasó a tener scroll: todo lo que se sale
  // del ancho de la barra queda recortado.
  const ConTitulo = ({
    titulo,
    children,
  }: {
    titulo: string;
    children: React.ReactNode;
  }) =>
    isOpen ? (
      <>{children}</>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="border-none bg-foreground text-background"
        >
          {titulo}
        </TooltipContent>
      </Tooltip>
    );

  return (
    <TooltipProvider delayDuration={0}>
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
                <ConTitulo titulo={item.title}>
                  <AccordionTrigger
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "group relative flex h-12 justify-between px-4 py-2 text-base duration-200 hover:bg-muted hover:no-underline",
                    )}
                  >
                    <div>
                      <item.icon className={cn("h-5 w-5", item.color)} />
                    </div>
                    {isOpen && (
                      <>
                        <div className="absolute left-12 text-base duration-200">
                          {item.title}
                        </div>
                        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      </>
                    )}
                  </AccordionTrigger>
                </ConTitulo>
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
                        path === child.href &&
                          "bg-muted font-bold hover:bg-muted",
                      )}
                    >
                      <child.icon className={cn("h-5 w-5", child.color)} />
                      <div
                        className={cn(
                          "left-12 text-base duration-200 w-full flex justify-between",
                          !isOpen && className,
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
            <ConTitulo key={item.title} titulo={item.title}>
              <Link
                href={item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "group relative flex h-12 justify-start",
                  path === item.href && "bg-muted font-bold hover:bg-muted",
                )}
              >
                {item.marca === "nacho" ? (
                  <Nacho tamano={22} saludaEnHover />
                ) : (
                  <item.icon className={cn("h-5 w-5", item.color)} />
                )}
                {isOpen && (
                  <span className="absolute left-12 text-base duration-200">
                    {item.title}
                  </span>
                )}
              </Link>
            </ConTitulo>
          ),
        )}
      </nav>
    </TooltipProvider>
  );
}
