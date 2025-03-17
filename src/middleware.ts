import { NextResponse, NextRequest } from "next/server";
import { getCookie } from "cookies-next";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME || "1h";

if (!JWT_SECRET || JWT_SECRET.length === 0) {
  throw new Error("JWT_SECRET no está definido o es vacío.");
}

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host');
  if (hostname?.startsWith('www.')) {
    const newUrl = new URL(req.url);
    newUrl.host = hostname.replace(/^www\./, '');
    return NextResponse.redirect(newUrl, 301);
  }
  
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

      // Refrescar el token si le quedan menos de 5 minutos antes de expirar
      if (payload.exp && payload.exp - Math.floor(Date.now() / 1000) < 5 * 60) {
        const newToken = await generateNewToken(payload);
        const response = NextResponse.next();
        response.cookies.set("auth-token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Asegúrate de que solo se setee en producción
          maxAge: 60 * 60, // 1 hora
        });
        console.log("Token refrescado exitosamente");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("expired")) {
        console.error("Token expirado - redirigiendo a login de empresa");
        return NextResponse.redirect(new URL("/loginempresa", req.url));
      } else {
        console.error("Error al verificar el token de empresa:", errorMessage);
        return NextResponse.redirect(new URL("/loginempresa", req.url));
      }
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

      // Refrescar el token si le quedan menos de 5 minutos antes de expirar
      if (payload.exp && payload.exp - Math.floor(Date.now() / 1000) < 5 * 60) {
        const newToken = await generateNewToken(payload);
        const response = NextResponse.next();
        response.cookies.set("auth-token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Asegúrate de que solo se setee en producción
          maxAge: 60 * 60, // 1 hora
        });
        console.log("Token refrescado exitosamente");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("expired")) {
        console.error("Token expirado - redirigiendo a login de admin");
        return NextResponse.redirect(new URL("/admin/login", req.url));
      } else {
        console.error("Error al verificar el token de admin:", errorMessage);
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/admin/:path*", "/empresa/:path*", "/loginempresa"],
};

async function generateNewToken(payload: JWTPayload): Promise<string> {
  const newToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(new TextEncoder().encode(JWT_SECRET));

  return newToken;
}