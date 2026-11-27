// Tests de src/shared/utils/sesionVencida.ts: qué pedidos son de login (un 401
// ahí no redirige) y qué mensaje ve la persona que intenta ingresar.
import test from "node:test";
import assert from "node:assert/strict";
import {
  esPedidoDeLogin,
  marcarSesionVencida,
  mensajeDeErrorDeLogin,
  tomarAvisoSesionVencida,
} from "../src/shared/utils/sesionVencida.ts";

test("los pedidos de ingreso y recuperación de clave son de login", () => {
  for (const endpoint of [
    "login",
    "/login",
    "login/company",
    "login/password/company/request-reset",
  ]) {
    assert.equal(esPedidoDeLogin(endpoint), true, endpoint);
  }
});

test("el resto de los pedidos no: ahí un 401 sigue siendo sesión vencida", () => {
  for (const endpoint of [
    "employees/import",
    "statements/rectifications",
    "companies/3",
    "loginempresa",
    "users/login-history",
    "",
  ]) {
    assert.equal(esPedidoDeLogin(endpoint), false, endpoint);
  }
});

test("un 4xx muestra el mensaje de la API", () => {
  assert.equal(
    mensajeDeErrorDeLogin({ statusCode: 401, message: "Contraseña incorrecta" }),
    "Contraseña incorrecta"
  );
  assert.equal(
    mensajeDeErrorDeLogin({
      statusCode: 429,
      message: "Demasiados intentos, intentá de nuevo más tarde",
    }),
    "Demasiados intentos, intentá de nuevo más tarde"
  );
});

test("sin conexión o un 5xx muestran un mensaje en castellano, no el técnico", () => {
  const generico = mensajeDeErrorDeLogin({});
  assert.match(generico, /No pudimos conectarnos/);
  assert.equal(
    mensajeDeErrorDeLogin({ statusCode: 500, message: "Failed to fetch" }),
    generico
  );
  assert.equal(
    mensajeDeErrorDeLogin({ statusCode: 401, message: "" }),
    generico
  );
});

test("el aviso de sesión vencida se muestra una sola vez", () => {
  const datos = new Map();
  globalThis.sessionStorage = {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
  };
  try {
    assert.equal(tomarAvisoSesionVencida(), false);
    marcarSesionVencida();
    assert.equal(tomarAvisoSesionVencida(), true);
    assert.equal(tomarAvisoSesionVencida(), false);
  } finally {
    delete globalThis.sessionStorage;
  }
});

test("sin sessionStorage no rompe: simplemente no avisa", () => {
  assert.doesNotThrow(() => marcarSesionVencida());
  assert.equal(tomarAvisoSesionVencida(), false);
});
