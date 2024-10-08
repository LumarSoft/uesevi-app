"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BsArrowLeftShort } from "react-icons/bs";
import { SideNav } from "./Side-Nav";
import { NavItemsAdmin } from "@/shared/constants/side-nav-admin";
import { useSidebar } from "@/shared/hooks/useSidebar";
import { fetchData } from "@/services/mysql/functions";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const [CountCompaniesPending, setCountCompaniesPending] = useState(0);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  useEffect(() => {
    const companiesInPending = async () => {
      const response = await fetchData("companies/inPending");
      if (response.ok) {
        setCountCompaniesPending(response.data.cantidad);
      }
    };

    companiesInPending();
  }, []);

  return (
    <nav
      className={cn(
        `relative hidden h-screen border-r pt-20 md:block`,
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className
      )}
    >
      <BsArrowLeftShort
        className={cn(
          "absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          !isOpen && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <SideNav
              className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
              items={NavItemsAdmin}
              CountCompaniesPending={CountCompaniesPending}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
