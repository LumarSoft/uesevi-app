// Controla el registro de la sección "Mejoras" del panel
// (src/modules/Admin/Mejoras/mejoras.ts): que cada entrada nueva tenga fecha,
// área y tipo válidos, y que la lista siga de la más nueva a la más vieja.
import test from "node:test";
import assert from "node:assert/strict";
import {
  AREAS,
  MEJORAS,
  TIPOS,
  agruparPorMes,
  diaYMes,
  diasDesde,
} from "../src/modules/Admin/Mejoras/mejoras.ts";

test("cada mejora tiene fecha AAAA-MM-DD real, área, tipo y textos", () => {
  for (const m of MEJORAS) {
    const donde = `"${m.titulo}"`;
    assert.match(m.fecha, /^\d{4}-\d{2}-\d{2}$/, donde);
    const [y, mes, d] = m.fecha.split("-").map(Number);
    const fecha = new Date(y, mes - 1, d);
    assert.equal(fecha.getMonth(), mes - 1, `${donde}: fecha inexistente`);
    assert.equal(fecha.getDate(), d, `${donde}: fecha inexistente`);
    assert.ok(AREAS.includes(m.area), `${donde}: área "${m.area}"`);
    assert.ok(TIPOS.includes(m.tipo), `${donde}: tipo "${m.tipo}"`);
    assert.ok(m.titulo.trim().length > 0, donde);
    assert.ok(m.detalle.trim().length > 0, donde);
  }
});

test("la lista va de la más nueva a la más vieja (se agrega arriba)", () => {
  for (let i = 1; i < MEJORAS.length; i++) {
    assert.ok(
      MEJORAS[i - 1].fecha >= MEJORAS[i].fecha,
      `"${MEJORAS[i].titulo}" (${MEJORAS[i].fecha}) está debajo de una más vieja`
    );
  }
});

test("no hay títulos repetidos el mismo día", () => {
  const claves = MEJORAS.map((m) => `${m.fecha}|${m.titulo}`);
  assert.equal(new Set(claves).size, claves.length);
});

test("agrupa por mes respetando el orden", () => {
  const grupos = agruparPorMes([
    { fecha: "2026-11-27", titulo: "a", detalle: "x", area: "Panel admin", tipo: "Nuevo" },
    { fecha: "2026-11-02", titulo: "b", detalle: "x", area: "Panel admin", tipo: "Nuevo" },
    { fecha: "2026-10-30", titulo: "c", detalle: "x", area: "Panel admin", tipo: "Nuevo" },
  ]);
  assert.deepEqual(
    grupos.map((g) => [g.mes, g.mejoras.length]),
    [
      ["Noviembre 2026", 2],
      ["Octubre 2026", 1],
    ]
  );
});

test("fechas sin corrimiento de zona horaria", () => {
  assert.equal(diaYMes("2026-11-27"), "27/11");
  assert.equal(diasDesde("2026-11-27", new Date(2026, 10, 27, 23, 30)), 0);
  assert.equal(diasDesde("2026-11-13", new Date(2026, 10, 27, 1)), 14);
});
