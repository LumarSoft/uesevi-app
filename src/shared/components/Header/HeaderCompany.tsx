"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileSidebar } from "../SidebarAdmin/Mobile-Sidebar";
import { userStore } from "@/shared/stores/userStore";
import { LogoutDialogCompany } from "./LogoutDialogCompany";

export default function HeaderCompany() {
  const { user } = userStore();

  const companyName = user!.empresa.nombre;
  const companyId = user?.empresa?.id;

  console.log(user)

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          href={"/"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          <Boxes className="h-6 w-6" />
          <h1 className="text-lg font-semibold">
            {companyName ? `${companyName} | ${companyId}` : ""}
          </h1>
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LogoutDialogCompany />
        </div>
      </nav>
    </div>
  );
}
