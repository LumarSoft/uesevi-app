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
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  color?: string;
  isChidren?: boolean;
  children?: NavItem[];
}

export const NavItemsCompany: NavItem[] = [
  {
    title: "Agregar Empleado",
    href: "/empresa/empleados/agregar-empleado",
    icon: UserRoundCog,
    color: "text-rose-500",
  },
  {
    title: "Mis Empleados",
    href: "/empresa/empleados/mis-empleados",
    icon: Building2,
    color: "text-blue-500", // Color azul para "Mis Empleados"
  },
  {
    title: "Declaracion jurada",
    href: "/empresa/empleados/importacion",
    icon: Pickaxe,
    color: "text-orange-500", // Color naranja para "Declaracion jurada"
  },
  {
    title: "Historial de declaraciones",
    icon: Newspaper,
    href: "/empresa/declaraciones",
    color: "text-indigo-500",
  },
];
