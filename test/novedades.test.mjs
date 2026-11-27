// Tests de src/modules/Admin/Mejoras/novedades.ts: el número de novedades sin
// ver junto a "Mejoras" en el menú.
import test from "node:test";
import assert from "node:assert/strict";
import {
  CLAVE_VISTAS,
  NOVEDADES_DESDE,
  claveMejora,
  guardarVistas,
  leerVistas,
  mejorasNuevas,
} from "../src/modules/Admin/Mejoras/novedades.ts";
import { MEJORAS } from "../src/modules/Admin/Mejoras/mejoras.ts";

const almacenFalso = () => {
  const datos = new Map();
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
  };
};

const m = (fecha, titulo) => ({ fecha, titulo });

test("lo publicado hasta el lanzamiento no cuenta como novedad", () => {
  const lista = [m(NOVEDADES_DESDE, "Lanzamiento"), m("2026-10-01", "Viejo")];
  assert.deepEqual(mejorasNuevas(lista, new Set()), []);
});

test("hoy, con la lista real, el menú arranca sin número", () => {
  const publicadasDespues = MEJORAS.filter((x) => x.fecha > NOVEDADES_DESDE);
  assert.equal(mejorasNuevas(MEJORAS, new Set()).length, publicadasDespues.length);
});

test("lo publicado después cuenta hasta que se ve", () => {
  const lista = [m("2026-12-03", "B"), m("2026-12-01", "A"), m(NOVEDADES_DESDE, "Lanzamiento")];
  assert.deepEqual(
    mejorasNuevas(lista, new Set()).map((x) => x.titulo),
    ["B", "A"]
  );
  assert.deepEqual(
    mejorasNuevas(lista, new Set([claveMejora(lista[1])])).map((x) => x.titulo),
    ["B"]
  );
});

test("guardar y leer las vistas; una nueva publicación vuelve a contar", () => {
  const almacen = almacenFalso();
  const antes = [m("2026-12-01", "A")];
  guardarVistas(almacen, antes);
  assert.equal(mejorasNuevas(antes, leerVistas(almacen)).length, 0);

  const despues = [m("2026-12-10", "C"), ...antes];
  assert.deepEqual(
    mejorasNuevas(despues, leerVistas(almacen)).map((x) => x.titulo),
    ["C"]
  );
});

test("datos rotos o sin almacenamiento no rompen nada", () => {
  const almacen = almacenFalso();
  almacen.setItem(CLAVE_VISTAS, "{no es json");
  assert.equal(leerVistas(almacen).size, 0);
  const roto = {
    getItem: () => {
      throw new Error("bloqueado");
    },
    setItem: () => {
      throw new Error("bloqueado");
    },
  };
  assert.equal(leerVistas(roto).size, 0);
  assert.doesNotThrow(() => guardarVistas(roto, [m("2026-12-01", "A")]));
  assert.equal(leerVistas(null).size, 0);
});
