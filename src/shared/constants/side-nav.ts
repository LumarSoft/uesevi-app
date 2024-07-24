import {
  LayoutDashboard,
  Users,
  UserRoundCog,
  Building2,
  Pickaxe,
  Newspaper,
  FileText,
  BookUser,
  Percent,
  BookText,
  BookMarked,
  Scroll,
  Search,
  BookCopy,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  isChidren?: boolean;
  children?: NavItem[];
}

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-sky-500",
  },
  {
    title: "Usuarios",
    icon: Users,
    href: "/admin/usarios",
    color: "text-rose-500",
    isChidren: true,
    children: [
      {
        title: "Administradores",
        href: "/admin/usuarios/administradores",
        icon: UserRoundCog,
        color: "text-rose-500",
      },
      {
        title: "Empresas",
        href: "/admin/usuarios/empresas",
        icon: Building2,
        color: "text-rose-500",
      },

      {
        title: "Empleados",
        href: "/usuarios/empleados",
        icon: Pickaxe,
        color: "text-rose-500",
      },
      {
        title: "Busqueda por empresa",
        href: "/usuarios/busqueda",
        icon: Search,
        color: "text-rose-500",
      },
      {
        title: "Formulario",
        href: "/usuarios/formulario",
        icon: BookCopy,
        color: "text-rose-500",
      },
    ],
  },
  // Ahora noticias, cambiando el color del icono
  {
    title: "Noticias",
    icon: Newspaper,
    href: "/noticias",
    color: "text-green-500",
  },
  //Ahora escalas, cambiando el color del icono
  {
    title: "Escalas",
    icon: FileText,
    href: "/escalas",
    color: "text-yellow-500",
  },

  //Ahora categorias
  {
    title: "Categorias",
    icon: BookUser,
    href: "/categorias",
    color: "text-blue-500",
  },
  // Otro color
  {
    title: "Tasa de interes",
    icon: Percent,
    href: "/interes",
    color: "text-red-500",
  },
  {
    title: "Declaraciones juradas",
    icon: BookText,
    href: "/declaraciones",
    color: "text-indigo-500",
    isChidren: true,
    children: [
      // Una para declaraciones juradas y otra para declaraciones juradas antiguas
      {
        title: "Declaraciones juradas",
        href: "/declaraciones/declaraciones",
        icon: Scroll,
        color: "text-indigo-500",
      },
      {
        title: "Declaraciones antiguas",
        href: "/declaraciones/antiguas",
        icon: BookMarked,
        color: "text-indigo-500",
      },
    ],
  },
];
