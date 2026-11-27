// Tests de src/shared/utils/vencimientoDeclaracion.ts: días de atraso para el
// interés y cartel del vencimiento de una DDJJ. Fechas inventadas.
import test from "node:test";
import assert from "node:assert/strict";
import {
  diasDeAtrasoParaIntereses,
  situacionVencimiento,
  textoVencimiento,
} from "../src/shared/utils/vencimientoDeclaracion.ts";

// Fechas en hora local, como las ve el navegador.
const local = (y, m, d, h = 12) => new Date(y, m - 1, d, h);
const iso = (fecha) => fecha.toISOString();

const VENCIMIENTO = iso(local(2026, 11, 30, 20)); // 30/11, como guarda la API
const decl = (campos) => ({
  estado: 0,
  vencimiento: VENCIMIENTO,
  fecha_pago: null,
  ...campos,
});

test("sin pago, el atraso se cuenta hasta hoy (como siempre)", () => {
  assert.equal(diasDeAtrasoParaIntereses(decl({}), local(2026, 12, 10, 20)), 10);
  assert.ok(diasDeAtrasoParaIntereses(decl({}), local(2026, 11, 20)) < 0);
});

test("con fecha de pago, el atraso se cuenta hasta el pago, esté aprobada o no", () => {
  const pago = iso(local(2026, 12, 5, 20));
  const hoy = local(2027, 3, 1);
  assert.equal(diasDeAtrasoParaIntereses(decl({ fecha_pago: pago }), hoy), 5);
  assert.equal(
    diasDeAtrasoParaIntereses(decl({ estado: 1, fecha_pago: pago }), hoy),
    5
  );
});

test("aprobada sin fecha de pago: no suma días aunque pase el tiempo", () => {
  for (const hoy of [local(2026, 12, 10), local(2027, 6, 1)]) {
    assert.equal(diasDeAtrasoParaIntereses(decl({ estado: 1 }), hoy), 0);
  }
});

test("los demás estados sin pago siguen sumando (pendiente, parcial, rechazada)", () => {
  for (const estado of [0, 2, 3]) {
    assert.equal(
      diasDeAtrasoParaIntereses(decl({ estado }), local(2026, 12, 3, 20)),
      3,
      `estado ${estado}`
    );
  }
});

test("recién presentada y sin vencer: en término, no 'Vencida: 0 días'", () => {
  const s = situacionVencimiento(decl({}), local(2026, 11, 27, 9));
  assert.deepEqual(s, { tipo: "en_termino", diasRestantes: 3 });
  assert.equal(textoVencimiento(s), "Faltan 3 días");
  assert.equal(
    textoVencimiento(situacionVencimiento(decl({}), local(2026, 11, 29, 9))),
    "Vence mañana"
  );
  assert.equal(
    textoVencimiento(situacionVencimiento(decl({}), local(2026, 11, 30, 9))),
    "Vence hoy"
  );
});

test("el mismo día del vencimiento sigue en término aunque ya pasó la hora", () => {
  // La API manda la fecha sin hora: vence a las 00:00 de ese día.
  const venceALaMedianoche = decl({ vencimiento: iso(local(2026, 11, 30, 0)) });
  assert.equal(
    textoVencimiento(situacionVencimiento(venceALaMedianoche, local(2026, 11, 30, 15))),
    "Vence hoy"
  );
  assert.deepEqual(
    situacionVencimiento(venceALaMedianoche, local(2026, 12, 1, 9)),
    { tipo: "vencida", dias: 1 }
  );
});

test("el cartel no depende del huso del servidor que serializa la fecha", () => {
  // DATE 30/11 serializado por una API en UTC y por una en Argentina.
  for (const vencimiento of ["2026-11-30T00:00:00.000Z", "2026-11-30T03:00:00.000Z"]) {
    const d = decl({ vencimiento });
    assert.equal(textoVencimiento(situacionVencimiento(d, local(2026, 11, 29, 10))), "Vence mañana", vencimiento);
    assert.equal(textoVencimiento(situacionVencimiento(d, local(2026, 11, 30, 18))), "Vence hoy", vencimiento);
    assert.equal(situacionVencimiento(d, local(2026, 12, 1, 10)).tipo, "vencida", vencimiento);
  }
});

test("vencida sin pago muestra los días de atraso", () => {
  const s = situacionVencimiento(decl({}), local(2026, 12, 4, 21));
  assert.deepEqual(s, { tipo: "vencida", dias: 4 });
  assert.equal(textoVencimiento(s), "Vencida: 4 días");
});

test("aprobada y pagada a tiempo no cambian", () => {
  const hoy = local(2027, 1, 15);
  assert.deepEqual(situacionVencimiento(decl({ estado: 1 }), hoy), {
    tipo: "aprobada",
  });
  const pagada = decl({ fecha_pago: iso(local(2026, 11, 28)) });
  assert.deepEqual(situacionVencimiento(pagada, hoy), { tipo: "pagada_a_tiempo" });
  assert.equal(textoVencimiento({ tipo: "aprobada" }), null);
});

test("pagada tarde: vencida con los días hasta el pago", () => {
  const s = situacionVencimiento(
    decl({ fecha_pago: iso(local(2026, 12, 12, 20)) }),
    local(2027, 1, 15)
  );
  assert.deepEqual(s, { tipo: "vencida", dias: 12 });
});
