// Controla el registro de la sección "Mejoras" del panel
// (src/modules/Admin/Mejoras/mejoras.ts): que cada entrada nueva tenga fecha,
// área y tipo válidos, y que la lista siga de la más nueva a la más vieja.
import test from "node:test";
import assert from "node:assert/strict";
import {
  AREAS,
  MEJORAS,
  TIPOS,
  agruparPorFecha,
  diaYMes,
  diasDesde,
  fechaCorta,
  fechaLarga,
  textoParaCompartir,
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
    if (m.dondeVerlo !== undefined) {
      assert.ok(Array.isArray(m.dondeVerlo) && m.dondeVerlo.length > 0, `${donde}: dondeVerlo vacío`);
      for (const paso of m.dondeVerlo) assert.ok(paso.trim().length > 0, `${donde}: paso vacío`);
    }
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

test("agrupa por entrega (fecha) respetando el orden", () => {
  const m = (fecha, titulo) => ({ fecha, titulo, detalle: "x", area: "Panel admin", tipo: "Nuevo" });
  const entregas = agruparPorFecha([
    m("2026-11-27", "a"),
    m("2026-11-27", "b"),
    m("2026-11-02", "c"),
    m("2026-10-30", "d"),
  ]);
  assert.deepEqual(
    entregas.map((e) => [e.fecha, e.mejoras.map((x) => x.titulo).join("")]),
    [
      ["2026-11-27", "ab"],
      ["2026-11-02", "c"],
      ["2026-10-30", "d"],
    ]
  );
});

test("el texto para compartir agrupa por fecha y lleva los pasos", () => {
  const texto = textoParaCompartir([
    {
      fecha: "2026-11-27",
      titulo: "Algo nuevo",
      detalle: "Qué cambia.",
      dondeVerlo: ["Menú → Algo."],
      area: "Panel admin",
      tipo: "Nuevo",
    },
    { fecha: "2026-11-26", titulo: "Un arreglo", detalle: "Antes fallaba.", area: "Sitio público", tipo: "Corrección" },
  ]);
  assert.equal(
    texto,
    [
      "*Mejoras del sistema de UESEVI*",
      "*27 de noviembre de 2026*",
      "*Algo nuevo* (Nuevo · Panel admin)\nQué cambia.\n• Menú → Algo.",
      "*26 de noviembre de 2026*",
      "*Un arreglo* (Corrección · Sitio público)\nAntes fallaba.",
    ].join("\n\n")
  );
});

test("fechas sin corrimiento de zona horaria", () => {
  assert.equal(diaYMes("2026-11-27"), "27/11");
  assert.equal(fechaLarga("2026-11-07"), "7 de noviembre de 2026");
  assert.equal(fechaLarga("2026-11-07", false), "7 de noviembre");
  assert.equal(fechaCorta("2026-11-07"), "7 nov 2026");
  assert.equal(diasDesde("2026-11-27", new Date(2026, 10, 27, 23, 30)), 0);
  assert.equal(diasDesde("2026-11-13", new Date(2026, 10, 27, 1)), 14);
});
