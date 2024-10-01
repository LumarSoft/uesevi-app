"use client";

import { FramerComponent } from "@/shared/Framer/FramerComponent";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { userStore } from "@/shared/stores/userStore";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user } = userStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isHomePage = pathname === "/";
  const isContactPage = pathname === "/contacto";

  const isActive = (path: string) => pathname === path;

  const linkStyle = (path: any) =>
    `hover:text-primary transition duration-300 ${
      isActive(path) ? "text-primary font-bold" : ""
    }`;

  return (
    <FramerComponent
      style={`w-full top-0 hidden md:flex justify-between items-center px-4 md:px-28 2xl:px-80 2xl:h-20 fixed z-20 transition-all duration-500 ${
        scrolled || !isHomePage ? "shadow-lg bg-white" : "bg-transparent"
      }`}
      animationInitial={{ y: -100, opacity: 0 }}
      animationAnimate={{ y: 0, opacity: 1 }}
      animationExit={{ y: -100, opacity: 0 }}
    >
      <nav className="lg:flex gap-2 md:gap-4 items-center font-semibold hidden text-lg">
        <Link href={"/loginempresa"} className={linkStyle("/loginempresa")}>
          Ingreso empresa
        </Link>
        <Link href={"/escalas"} className={linkStyle("/escalas")}>
          Escalas salariales
        </Link>
        <Link href={"/alta-empresa"} className={linkStyle("/alta-empresa")}>
          Alta de empresa
        </Link>
        <Link href={"/afiliaciones"} className={linkStyle("/afiliaciones")}>
          Afiliaciones
        </Link>
        <Link
          href={"/noticias/page/1"}
          className={linkStyle("/noticias/page/1")}
        >
          Noticias
        </Link>
        <Link href={"/contacto"} className={linkStyle("/contacto")}>
          Contacto
        </Link>
      </nav>
      <div>
        <Link href={"/"}>
          <img src="/logo_chico.png" className="h-16" alt="Logo END" />
        </Link>
      </div>
    </FramerComponent>
  );
};

export const DropDownNav = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="lg:hidden fixed top-6 right-4 z-50"
        asChild
      >
        <div className="px-3 bg-[#1f294c] py-3 rounded-full">
          <Menu color="white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link href={"/loginempresa"}>Ingreso empresa</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/escalas"}>Escalas salariales</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/alta-empresa"}>Alta de empresa</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/afiliaciones"}>Afiliaciones</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/noticias/page/1"}>Noticias</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/contacto"}>Contacto</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
