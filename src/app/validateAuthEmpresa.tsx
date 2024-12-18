"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { LoadingPage } from "./LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRouteEmpresa: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated === false) {
      return router.push("/loginempresa");
    }

    if (isAuthenticated && user && user.rol !== "empresa") {
      return router.push("/loginempresa");
    }
   
  }, [isAuthenticated, user, router, requiredRoles, isLoading, pathname]);

  // Show loading indicator while verifying
  if (isLoading) {
    return <LoadingPage />;
  }

  // If not authenticated, don't show anything
  if (isAuthenticated === false) {
    return null;
  }

  return <>{children}</>;
};