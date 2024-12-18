"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/shared/hooks/use-auth";
import { LoadingPage } from "./LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Only perform verification when loading is complete
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (isAuthenticated === false) {
        router.push("/");
        return;
      }

      // Check route access based on user role
      if (user) {
        // Admin-specific route check
        if (pathname.startsWith('/admin') && user.rol !== 'admin') {
          router.push("/unauthorized");
          return;
        }

        // Company-specific route check
        if (pathname.startsWith('/empresa') && user.rol !== 'empresa') {
          router.push("/unauthorized");
          return;
        }

        // Additional role-specific checks if required
        if (requiredRoles) {
          const hasRequiredRole = requiredRoles.includes(user.rol);
          if (!hasRequiredRole) {
            router.push("/unauthorized");
            return;
          }
        }
      }
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