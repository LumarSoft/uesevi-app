"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { MobileSidebar } from "../Sidebar/Mobile-Sidebar";
import { useAuthStore } from "@/shared/stores/authStore";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";
export default function Header() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    deleteCookie("auth-token");
    router.replace("/admin/login");
  };
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Boxes className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Uesevi</h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" onClick={handleLogout}>
            Cerrar sesion
          </Button>
        </div>
      </nav>
    </div>
  );
}
