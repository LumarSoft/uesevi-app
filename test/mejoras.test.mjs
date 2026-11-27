// Controla el boletín de mejoras del panel (src/modules/Admin/Mejoras/mejoras.ts):
// que cada entrada nueva tenga fecha, área, tipo y textos válidos, que la lista
// siga de la más nueva a la más vieja, y los cálculos de la página.
import test from "node:test";
import assert from "node:assert/strict";
import {
  AREAS,
  FECHAS_DE_ENTREGA,
  MEJORAS,
  TIPOS,
  ULTIMA_ENTREGA,
  agruparPorFecha,
  coincide,
  diaYMes,
  diasDesde,
  fechaDeCorte,
  fechaLarga,
  haceCuanto,
  pulso,
  resaltar,
} from "../src/modules/Admin/Mejoras/mejoras.ts";

const m = (fecha, titulo, extra = {}) => ({
  fecha,
  titulo,
  ahora: "x",
  area: "Panel admin",
  tipo: "Nuevo",
  ...extra,
});

test("cada mejora tiene fecha AAAA-MM-DD real, área, tipo y textos", () => {
  for (const mejora of MEJORAS) {
    const donde = `"${mejora.titulo}"`;
    assert.match(mejora.fecha, /^\d{4}-\d{2}-\d{2}$/, donde);
    const [y, mes, d] = mejora.fecha.split("-").map(Number);
    const fecha = new Date(y, mes - 1, d);
    assert.equal(fecha.getMonth(), mes - 1, `${donde}: fecha inexistente`);
    assert.equal(fecha.getDate(), d, `${donde}: fecha inexistente`);
    assert.ok(AREAS.includes(mejora.area), `${donde}: área "${mejora.area}"`);
    assert.ok(TIPOS.includes(mejora.tipo), `${donde}: tipo "${mejora.tipo}"`);
    assert.ok(mejora.titulo.trim().length > 0, donde);
    assert.ok(mejora.ahora.trim().length > 0, `${donde}: falta "ahora"`);
    if ("antes" in mejora) {
      assert.ok(mejora.antes.trim().length > 0, `${donde}: "antes" vacío (sacarlo)`);
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
  const claves = MEJORAS.map((x) => `${x.fecha}|${x.titulo}`);
  assert.equal(new Set(claves).size, claves.length);
});

test("las entregas se numeran desde la primera y el número no cambia al filtrar", () => {
  assert.equal(ULTIMA_ENTREGA, MEJORAS[0].fecha);
  const todas = agruparPorFecha(MEJORAS);
  assert.equal(todas[0].numero, FECHAS_DE_ENTREGA.length);
  assert.equal(todas[todas.length - 1].numero, 1);
  const filtradas = agruparPorFecha(MEJORAS.filter((x) => x.fecha !== ULTIMA_ENTREGA));
  assert.equal(filtradas[0].numero, FECHAS_DE_ENTREGA.length - 1);
});

test("nuevo para vos: lo posterior a lo último visto; la primera vez, sólo la última entrega", () => {
  const fechas = ["2026-11-27", "2026-11-26", "2026-11-24"];
  assert.equal(fechaDeCorte(null, fechas), "2026-11-26");
  assert.equal(fechaDeCorte("2026-11-24", fechas), "2026-11-24");
  assert.equal(fechaDeCorte(null, ["2026-11-27"]), "");
});

test("el pulso cubre todos los meses hasta hoy, con las entregas de cada uno", () => {
  const meses = pulso(
    [m("2026-11-27", "a"), m("2026-11-27", "b"), m("2026-09-03", "c")],
    new Date(2027, 0, 10)
  );
  assert.deepEqual(
    meses.map((x) => [x.clave, x.etiqueta, x.cambios]),
    [
      ["2026-09", "sep", 1],
      ["2026-10", "oct", 0],
      ["2026-11", "nov", 2],
      ["2026-12", "dic", 0],
      ["2027-01", "ene", 0],
    ]
  );
  assert.deepEqual(meses[2].entregas, [{ fecha: "2026-11-27", dia: 27, cantidad: 2 }]);
  assert.equal(meses[2].diasDelMes, 30);
});

test("la búsqueda ignora tildes y mayúsculas y mira también el antes", () => {
  const mejora = m("2026-11-27", "Vista previa en WhatsApp", {
    antes: "No aparecía ninguna imagen.",
    ahora: "Aparece el logo.",
  });
  assert.ok(coincide(mejora, "whatsapp"));
  assert.ok(coincide(mejora, "aparecia"));
  assert.ok(coincide(mejora, "  LOGO "));
  assert.ok(!coincide(mejora, "intereses"));
  assert.ok(coincide(mejora, ""));
});

test("resaltar marca lo buscado respetando el texto original", () => {
  assert.deepEqual(resaltar("Sesión vencida: la sesión", "sesion"), [
    { texto: "Sesión", resaltado: true },
    { texto: " vencida: la ", resaltado: false },
    { texto: "sesión", resaltado: true },
  ]);
  assert.deepEqual(resaltar("Hola", ""), [{ texto: "Hola", resaltado: false }]);
});

test("fechas y tiempos relativos sin corrimiento de zona horaria", () => {
  const hoy = new Date(2026, 10, 27, 23, 30);
  assert.equal(diaYMes("2026-11-27"), "27/11");
  assert.equal(fechaLarga("2026-11-07"), "7 de noviembre de 2026");
  assert.equal(fechaLarga("2026-11-07", false), "7 de noviembre");
  assert.equal(diasDesde("2026-11-27", hoy), 0);
  assert.equal(haceCuanto("2026-11-27", hoy), "hoy");
  assert.equal(haceCuanto("2026-11-26", hoy), "ayer");
  assert.equal(haceCuanto("2026-11-20", hoy), "hace 7 días");
  assert.equal(haceCuanto("2026-11-06", hoy), "hace 3 semanas");
  assert.equal(haceCuanto("2026-06-24", hoy), "hace 5 meses");
});
