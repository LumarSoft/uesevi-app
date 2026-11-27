// Tests de la presentación de Mejoras (src/modules/Admin/Mejoras/recorrido/recorrido.ts).
import test from "node:test";
import assert from "node:assert/strict";
import {
  CLAVE_ANUNCIO,
  PASOS,
  RUTA_MEJORAS,
  anuncioVisto,
  marcarAnuncioVisto,
  posicionTarjeta,
} from "../src/modules/Admin/Mejoras/recorrido/recorrido.ts";

const almacenFalso = () => {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
  };
};

test("la presentación se muestra hasta que se marca como vista", () => {
  const almacen = almacenFalso();
  assert.equal(anuncioVisto(almacen), false);
  marcarAnuncioVisto(almacen);
  assert.equal(anuncioVisto(almacen), true);
  assert.equal(almacen.getItem(CLAVE_ANUNCIO), "visto");
});

test("sin almacenamiento disponible no insiste en cada carga", () => {
  const roto = {
    getItem: () => {
      throw new Error("bloqueado");
    },
    setItem: () => {
      throw new Error("bloqueado");
    },
  };
  assert.equal(anuncioVisto(roto), true);
  assert.equal(anuncioVisto(null), true);
  assert.doesNotThrow(() => marcarAnuncioVisto(roto));
});

test("los pasos: primero el menú, después la página de Mejoras", () => {
  assert.equal(PASOS[0].id, "menu");
  assert.ok(PASOS[0].selectorMovil, "el menú lateral no se ve en el celular");
  for (const paso of PASOS) {
    assert.match(paso.selector, /^\[data-recorrido="[a-z-]+"\]$/, paso.id);
    assert.ok(paso.titulo.trim() && paso.texto.trim(), paso.id);
  }
  for (const paso of PASOS.slice(1)) assert.equal(paso.ruta, RUTA_MEJORAS, paso.id);
  assert.equal(new Set(PASOS.map((p) => p.id)).size, PASOS.length);
});

const pantalla = { ancho: 1440, alto: 900 };
const tarjeta = { ancho: 352, alto: 220 };

test("la tarjeta va a la derecha del menú lateral", () => {
  const item = { top: 400, left: 12, right: 276, bottom: 448 };
  assert.deepEqual(posicionTarjeta(item, tarjeta, pantalla), { top: 400, left: 296 });
});

test("si no entra a la derecha va abajo, y si no, arriba", () => {
  const ancho = { top: 200, left: 300, right: 1400, bottom: 260 };
  assert.deepEqual(posicionTarjeta(ancho, tarjeta, pantalla), { top: 280, left: 300 });
  const abajoDeTodo = { top: 700, left: 300, right: 1400, bottom: 880 };
  assert.deepEqual(posicionTarjeta(abajoDeTodo, tarjeta, pantalla), { top: 460, left: 300 });
});

test("nunca se sale de la pantalla", () => {
  const celular = { ancho: 375, alto: 812 };
  const p = posicionTarjeta({ top: 20, left: 300, right: 340, bottom: 60 }, { ancho: 343, alto: 240 }, celular);
  assert.ok(p.left >= 16 && p.left + 343 <= 375 - 16 + 0.001, JSON.stringify(p));
  assert.ok(p.top >= 16 && p.top + 240 <= 812, JSON.stringify(p));
});

test("sin elemento, al centro", () => {
  assert.deepEqual(posicionTarjeta(null, tarjeta, pantalla), { top: 340, left: 544 });
});
