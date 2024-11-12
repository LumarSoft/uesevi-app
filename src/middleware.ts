import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

if (!JWT_SECRET || JWT_SECRET.length === 0) {
  throw new Error("JWT_SECRET no está definido o es vacío.");
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = getCookie("auth-token", { req });

  if (pathname === "/loginempresa") {
    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );

        if (payload.rol === "empresa") {
          return NextResponse.redirect(
            new URL("/empresa/empleados/importacion", req.url)
          );
        }
      } catch (error) {
        console.error(
          "Error al verificar el token en /loginempresa:",
          (error as Error).message
        );
      }
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/empresa")) {
    if (!token) {
      console.error("No se encontró el token de empresa.");
      return NextResponse.redirect(new URL("/loginempresa", req.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      if (payload.rol !== "empresa") {
        console.error(
          "Acceso denegado. El usuario no tiene el rol de empresa."
        );
        return NextResponse.redirect(new URL("/loginempresa", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("expired")) {
        console.error("Token expirado - redirigiendo a login de empresa");
      } else {
        console.error("Error al verificar el token de empresa:", errorMessage);
      }
      return NextResponse.redirect(new URL("/loginempresa", req.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    if (!token) {
      console.error("No se encontró el token de admin.");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );

      if (payload.rol !== "admin") {
        console.error(
          "Acceso denegado. El usuario no tiene el rol de administrador."
        );
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("expired")) {
        console.error("Token expirado - redirigiendo a login de admin");
      } else {
        console.error("Error al verificar el token de admin:", errorMessage);
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/empresa/:path*", "/loginempresa"],
};
