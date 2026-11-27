// Tests de src/modules/Admin/Mejoras/propuestas/propuestas.ts.
import test from "node:test";
import assert from "node:assert/strict";
import {
  ETIQUETA_ESTADO,
  ESTADOS_PROPUESTA,
  contarPorEstado,
  erroresDePropuesta,
  fechaDePropuesta,
} from "../src/modules/Admin/Mejoras/propuestas/propuestas.ts";

test("avisa antes de enviar lo mismo que rechazaría la API", () => {
  assert.equal(erroresDePropuesta("Hola", "Una descripción suficiente").length, 1);
  assert.equal(erroresDePropuesta("Un buen título", "corta").length, 1);
  assert.equal(erroresDePropuesta("x".repeat(121), "Una descripción suficiente").length, 1);
  assert.deepEqual(erroresDePropuesta("  Un buen título ", " Una descripción suficiente "), []);
});

test("cada estado tiene su etiqueta", () => {
  for (const estado of ESTADOS_PROPUESTA) assert.ok(ETIQUETA_ESTADO[estado], estado);
  assert.equal(ETIQUETA_ESTADO.pendiente, "Recibida");
});

test("fechas cortas y tolerantes a datos vacíos", () => {
  assert.equal(fechaDePropuesta(new Date(2026, 10, 27, 15).toISOString()), "27 nov 2026");
  assert.equal(fechaDePropuesta(null), "");
  assert.equal(fechaDePropuesta("no-es-fecha"), "");
});

test("cuenta por estado", () => {
  assert.deepEqual(
    contarPorEstado([{ estado: "hecha" }, { estado: "pendiente" }, { estado: "hecha" }]),
    { pendiente: 1, en_curso: 0, hecha: 2, descartada: 0 }
  );
});
