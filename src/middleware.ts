import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { jwtVerify } from "jose"; // Usamos jose para verificar el token

// Asegúrate de que JWT_SECRET tenga un valor válido
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length === 0) {
  throw new Error("JWT_SECRET no está definido o es vacío.");
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Obtener el token de cookies
  const token = getCookie("auth-token", { req });

  // Verificar si se está accediendo a la ruta "/loginempresa"
  if (pathname === "/loginempresa") {
    // Si hay un token, verificamos si es una cuenta de empresa
    if (token) {
      try {
        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(JWT_SECRET)
        );
        const { rol } = payload;

        // Si el rol es "empresa", redirigimos a la página de agregar empleado
        if (rol === "empresa") {
          return NextResponse.redirect(new URL("/empresa/empleados/agregar-empleado", req.url));
        }
      } catch (error) {
        console.error(
          "Error al verificar el token en /loginempresa:",
          (error as Error).message || error
        );
        // Si hay un error en la verificación, permitimos el acceso a /loginempresa
      }
    }
    // Si no hay token o no es una cuenta de empresa, permitimos el acceso a /loginempresa
    return NextResponse.next();
  }

  // Verificar si se está accediendo a una ruta de "empresa"
  if (pathname.startsWith("/empresa")) {
    // Si no hay token, redirigir a la página de login de empresa
    if (!token) {
      console.error("No se encontró el token de empresa.");
      return NextResponse.redirect(new URL("/loginempresa", req.url));
    }

    try {
      // Verificar el token utilizando jose y el secreto
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const { rol } = payload;

      // Solo permitir acceso a usuarios con el rol "empresa"
      if (rol !== "empresa") {
        console.error(
          "Acceso denegado. El usuario no tiene el rol de empresa."
        );
        return NextResponse.redirect(new URL("/loginempresa", req.url));
      }

      // Si el rol es válido, permitir acceso
      return NextResponse.next();
    } catch (error) {
      console.error(
        "Error al verificar el token de empresa:",
        (error as Error).message || error
      );
      return NextResponse.redirect(new URL("/loginempresa", req.url));
    }
  }

  // Verificar si se está accediendo a una ruta de "admin"
  if (pathname.startsWith("/admin")) {
    // Permitir acceso libre a la página de login de admin
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Si no hay token, redirigir a la página de login de admin
    if (!token) {
      console.error("No se encontró el token de admin.");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      // Verificar el token utilizando jose y el secreto
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      const { rol } = payload;

      // Solo permitir acceso a usuarios con el rol "admin"
      if (rol !== "admin") {
        console.error(
          "Acceso denegado. El usuario no tiene el rol de administrador."
        );
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // Si el rol es válido, permitir acceso
      return NextResponse.next();
    } catch (error) {
      console.error(
        "Error al verificar el token de admin:",
        (error as Error).message || error
      );
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // Si ninguna de las rutas coincide, continuar
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/empresa/:path*", "/loginempresa"], // Rutas a proteger
};