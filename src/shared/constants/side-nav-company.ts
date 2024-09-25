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
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/empresa/dashboard",
    color: "text-sky-500",
  },
  {
    title: "Empleados",
    icon: Users,
    href: "/empresa/empleados",
    color: "text-rose-500",
    isChidren: true,
    children: [
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
        color: "text-rose-500",
      },
      {
        title: "Importacion masiva",
        href: "/empresa/empleados/importacion",
        icon: Pickaxe,
        color: "text-rose-500",
      },
    ],
  },
  {
    title: "Declaracion jurada",
    icon: Newspaper,
    href: "/empresa/declaraciones",
    color: "text-indigo-500",
  },
  {
    title: "Instructivo del sistema",
    icon: BookUser,
    href: "/empresa/instructivo",
    color: "text-green-500",
  },
];
