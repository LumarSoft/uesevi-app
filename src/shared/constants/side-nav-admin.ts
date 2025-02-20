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
  BookCopy,
  MessageSquare,
  Calculator,
  AlertTriangle,
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

export const NavItemsAdmin: NavItem[] = [
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
        href: "/admin/usuarios/empleados",
        icon: Pickaxe,
        color: "text-rose-500",
      },
      {
        title: "Formulario",
        href: "/admin/usuarios/formulario",
        icon: BookCopy,
        color: "text-rose-500",
      },
    ],
  },
  // Ahora noticias, cambiando el color del icono
  {
    title: "Noticias",
    icon: Newspaper,
    href: "/admin/noticias",
    color: "text-green-500",
  },
  //Ahora escalas, cambiando el color del icono
  {
    title: "Escalas",
    icon: FileText,
    href: "/admin/escalas",
    color: "text-yellow-500",
  },

  //Ahora categorias
  {
    title: "Categorías",
    icon: BookUser,
    href: "/admin/categorias",
    color: "text-blue-500",
  },
  // Otro color
  {
    title: "Tasa de interés",
    icon: Percent,
    href: "/admin/tasa",
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
        href: "/admin/declaraciones",
        icon: Scroll,
        color: "text-indigo-500",
      },
      {
        title: "Declaraciones antiguas",
        href: "/admin/antiguas",
        icon: BookMarked,
        color: "text-indigo-500",
      },
    ],
  },
  {
    title: "Consultas",
    icon: MessageSquare,
    href: "/admin/consultas",
    color: "text-purple-500",
  },
  {
    title: "Calculadora de intereses",
    icon: Calculator,
    href: "/admin/calculadora",
    color: "text-pink-500",
  },
  {
    title: "Empresas deudoras",
    icon: AlertTriangle,
    href: "/admin/deudoras",
    color: "text-amber-500",
  },
];
