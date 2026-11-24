// Tests del buscador de afiliados (src/modules/Admin/Usuarios/Afiliados/helpers.ts).
//
// Corren con el runner que trae Node, sin dependencias: `pnpm test`.
// Los nombres y los documentos son inventados: el repo es público y acá no va
// ningún dato de personas reales.
import test from "node:test";
import assert from "node:assert/strict";
import {
  buscarAfiliados,
  dniDeCuil,
  formatearCuil,
  formatearDni,
  indexarAfiliados,
  interpretarBusqueda,
  nombreCompleto,
  normalizarTexto,
} from "../src/modules/Admin/Usuarios/Afiliados/helpers.ts";

// En el mismo orden alfabético en que los devuelve la API.
const AFILIADOS = [
  ["ACOSTA", "Martin Ezequiel", "20301112223"],
  ["ANAYA", "Gustavo", "20330001115"],
  ["CASTAÑO", "NORBERTO JOSÉ", "20266667771"],
  ["D'ANGELO", "ALBERTO", "20287776665"],
  ["DEL VALLE", "Susana Beatriz", "27295554443"],
  ["GOMEZ", "Ana Laura", "27312223334"],
  ["Jimenez Díaz", "Fabián", "20356667778"],
  ["LOPEZ", "Analía", "27323300019"],
  ["MARTIN", "Oscar Alberto", "20278889990"],
  ["Martínez", "Ramiro", "20361112227"],
  ["MARTINEZ", "JUAN TADEO", "23256667779"],
  ["NUÑEZ", "Martina", "27367778889"],
  ["PEREZ MARTINEZ", "Luis", "20221113334"],
  ["SANMARTIN", "Hugo", "20071234563"],
].map(([apellido, nombre, cuil], i) => ({
  empleado_id: i + 1,
  id: 100 + i,
  apellido,
  nombre,
  cuil,
  categoria_id: 1,
  categoria: "Vigilador General",
  empresa_id: 1,
  nombre_empresa: "EMPRESA DE PRUEBA SRL",
}));

const INDICE = indexarAfiliados(AFILIADOS);
const buscar = (texto) => buscarAfiliados(INDICE, texto).map(nombreCompleto);

test("sin nada escrito devuelve todos, en el orden original", () => {
  assert.deepEqual(buscarAfiliados(INDICE, ""), AFILIADOS);
  assert.deepEqual(buscarAfiliados(INDICE, "   "), AFILIADOS);
  assert.deepEqual(buscarAfiliados(INDICE, " , . - "), AFILIADOS);
});

test("nombre y apellido encuentran a la persona, en cualquier orden y formato", () => {
  for (const texto of [
    "ramiro martinez",
    "martinez ramiro",
    "Ramiro Martínez",
    "MARTÍNEZ, RAMIRO",
    "  ramiro   martinez  ",
    "rami mart",
  ]) {
    assert.deepEqual(buscar(texto), ["Martínez, Ramiro"], texto);
  }
});

test("todas las palabras tienen que coincidir", () => {
  assert.deepEqual(buscar("ramiro gomez"), []);
  assert.deepEqual(buscar("martinez pedro"), []);
});

test("no importan mayúsculas ni tildes, ni de un lado ni del otro", () => {
  assert.deepEqual(buscar("fabian"), ["Jimenez Díaz, Fabián"]);
  assert.deepEqual(buscar("FABIÁN DIAZ"), ["Jimenez Díaz, Fabián"]);
  assert.deepEqual(buscar("castano"), ["CASTAÑO, NORBERTO JOSÉ"]);
  assert.deepEqual(buscar("Castaño"), ["CASTAÑO, NORBERTO JOSÉ"]);
  assert.deepEqual(buscar("nunez"), ["NUÑEZ, Martina"]);
});

// Padrón aparte para las eñes y las tildes: la misma persona "tipo" cargada de
// todas las formas en que aparece en la base real.
const CON_SIGNOS = [
  ["AGUERO", "Ángel"],
  ["CENTURIÒN", "NESTOR"], // tilde al revés (así está cargado)
  ["GÜEMES", "Raúl"],
  ["MUNOZ", "Jose"], // cargado sin eñe ni tilde
  ["MUÑOZ", "JOSÉ"],
  ["Muñoz", "josé maría"],
  ["MU¥OZ", "ANSELMO"], // Ñ rota (DOS)
  ["MUÐOZ", "JOSE ANTONIO"], // Ñ rota (carácter vecino)
  ["MUÃ‘OZ", "RICARDO"], // Ñ rota (UTF-8 leído como Windows-1252)
  ["MUÃ\u0091OZ", "DARIO"], // ídem, leído como Latin-1
  ["Pena", "Raul"],
  ["PEÑA", "ANGEL"],
].map(([apellido, nombre], i) => ({
  empleado_id: i + 1,
  id: i + 1,
  apellido,
  nombre,
  cuil: String(20300000000 + i),
  categoria_id: 1,
  categoria: "Vigilador General",
  empresa_id: 1,
  nombre_empresa: "EMPRESA DE PRUEBA SRL",
}));
const INDICE_SIGNOS = indexarAfiliados(CON_SIGNOS);
const apellidos = (texto) =>
  buscarAfiliados(INDICE_SIGNOS, texto).map((afiliado) => afiliado.apellido);

test("eñe: da lo mismo escribirla o no, y que esté cargada o no", () => {
  const todosLosMunoz = ["MUNOZ", "MUÑOZ", "Muñoz", "MU¥OZ", "MUÐOZ", "MUÃ‘OZ", "MUÃ\u0091OZ"];
  for (const texto of [
    "muñoz",
    "munoz",
    "MUÑOZ",
    "MUNOZ",
    "Muñoz",
    "mun\u0303oz", // "ñ" descompuesta: n + virgulilla suelta (pegado de PDF)
    "MUN\u0303OZ",
  ]) {
    assert.deepEqual(apellidos(texto), todosLosMunoz, texto);
  }
  // Parcial, terminando justo en la eñe.
  assert.deepEqual(apellidos("muñ"), todosLosMunoz);
  assert.deepEqual(apellidos("mun"), todosLosMunoz);

  assert.deepEqual(apellidos("peña"), ["Pena", "PEÑA"]);
  assert.deepEqual(apellidos("pena"), ["Pena", "PEÑA"]);
  assert.deepEqual(apellidos("PEÑA ANGEL"), ["PEÑA"]);
});

test("tildes: da lo mismo escribirlas o no, y que estén cargadas o no", () => {
  // "José" está cargado como "Jose", "JOSÉ", "josé maría" y "JOSE ANTONIO".
  const losJose = ["MUNOZ", "MUÑOZ", "Muñoz", "MUÐOZ"];
  for (const texto of ["jose", "josé", "JOSE", "JOSÉ", "Jose\u0301"]) {
    assert.deepEqual(apellidos(texto), losJose, texto);
  }
  for (const texto of ["jose maria", "José María", "MARÍA JOSÉ", "maria jose"]) {
    assert.deepEqual(apellidos(texto), ["Muñoz"], texto);
  }
  for (const texto of ["raul", "raúl", "RAÚL", "Raul"]) {
    assert.deepEqual(apellidos(texto), ["GÜEMES", "Pena"], texto);
  }
  for (const texto of ["angel", "ángel", "Ángel", "ANGEL", "ÁNGEL"]) {
    assert.deepEqual(apellidos(texto), ["AGUERO", "PEÑA"], texto);
  }
});

test("diéresis y tilde al revés", () => {
  for (const texto of ["guemes", "güemes", "GÜEMES", "Guemes"]) {
    assert.deepEqual(apellidos(texto), ["GÜEMES"], texto);
  }
  for (const texto of ["aguero", "agüero", "AGÜERO"]) {
    assert.deepEqual(apellidos(texto), ["AGUERO"], texto);
  }
  // Cargado como "CENTURIÒN" (acento grave): se encuentra con cualquier tilde o sin ella.
  for (const texto of ["centurion", "centurión", "CENTURIÓN", "centuriòn"]) {
    assert.deepEqual(apellidos(texto), ["CENTURIÒN"], texto);
  }
});

test("escribir con tilde encuentra lo que está cargado sin tilde", () => {
  // En el padrón principal "MARTINEZ, JUAN TADEO" y "PEREZ MARTINEZ" no tienen tilde.
  assert.deepEqual(buscar("martínez"), buscar("martinez"));
  assert.deepEqual(buscar("MARTÍNEZ"), buscar("martinez"));
  assert.deepEqual(buscar("pérez"), ["PEREZ MARTINEZ, Luis"]);
  assert.deepEqual(buscar("gómez"), ["GOMEZ, Ana Laura"]);
  assert.deepEqual(buscar("lópez analia"), ["LOPEZ, Analía"]);
  assert.deepEqual(buscar("jiménez díaz"), ["Jimenez Díaz, Fabián"]);
  assert.deepEqual(buscar("núñez"), ["NUÑEZ, Martina"]);
});

test("por apellido: primero el apellido, después el segundo apellido", () => {
  assert.deepEqual(buscar("martinez"), [
    "Martínez, Ramiro",
    "MARTINEZ, JUAN TADEO",
    "PEREZ MARTINEZ, Luis",
  ]);
});

test("orden: apellido antes que nombre, exacto antes que parcial, 'en el medio' al final", () => {
  assert.deepEqual(buscar("martin"), [
    "MARTIN, Oscar Alberto", // apellido exacto
    "Martínez, Ramiro", // apellido que empieza igual
    "MARTINEZ, JUAN TADEO",
    "PEREZ MARTINEZ, Luis",
    "ACOSTA, Martin Ezequiel", // nombre exacto
    "NUÑEZ, Martina", // nombre que empieza igual
    "SANMARTIN, Hugo", // en el medio de una palabra
  ]);

  assert.deepEqual(buscar("ana"), [
    "ANAYA, Gustavo",
    "GOMEZ, Ana Laura",
    "LOPEZ, Analía",
    "DEL VALLE, Susana Beatriz",
  ]);
});

test("una sola letra: primero los apellidos que empiezan con esa letra", () => {
  assert.deepEqual(buscar("m").slice(0, 6), [
    "MARTIN, Oscar Alberto", // el apellido empieza con M
    "Martínez, Ramiro",
    "MARTINEZ, JUAN TADEO",
    "PEREZ MARTINEZ, Luis", // segunda palabra del apellido
    "ACOSTA, Martin Ezequiel", // nombre
    "NUÑEZ, Martina",
  ]);
  // "DEL VALLE" tiene una palabra que empieza con V; en "Gustavo" la V está en
  // el medio, así que sale al final.
  assert.deepEqual(buscar("v"), ["DEL VALLE, Susana Beatriz", "ANAYA, Gustavo"]);
  assert.deepEqual(buscar("d").slice(0, 3), [
    "D'ANGELO, ALBERTO", // "dangelo"
    "DEL VALLE, Susana Beatriz",
    "Jimenez Díaz, Fabián", // segunda palabra del apellido
  ]);
});

test("apóstrofos y apellidos compuestos escritos de corrido", () => {
  for (const texto of ["d'angelo", "dangelo", "D’Angelo", "angelo"]) {
    assert.deepEqual(buscar(texto), ["D'ANGELO, ALBERTO"], texto);
  }
  assert.deepEqual(buscar("delvalle"), ["DEL VALLE, Susana Beatriz"]);
  assert.deepEqual(buscar("delva"), ["DEL VALLE, Susana Beatriz"]);
  assert.deepEqual(buscar("del valle susana"), ["DEL VALLE, Susana Beatriz"]);
});

test("no pega palabras largas: 'Martin Ezequiel' no es 'martinez'", () => {
  assert.ok(!buscar("martinez").includes("ACOSTA, Martin Ezequiel"));
  assert.deepEqual(buscar("martinezequiel"), []);
  assert.deepEqual(buscar("juancarlos"), []);
});

test("por DNI, con o sin puntos o espacios", () => {
  for (const texto of ["36111222", "36.111.222", "36 111 222", " 36111222 "]) {
    assert.deepEqual(buscar(texto), ["Martínez, Ramiro"], texto);
  }
});

test("por CUIL, con o sin guiones", () => {
  for (const texto of ["20361112227", "20-36111222-7", "20 36111222 7", "20/36111222/7"]) {
    assert.deepEqual(buscar(texto), ["Martínez, Ramiro"], texto);
  }
});

test("DNI de 7 dígitos: con o sin el cero adelante", () => {
  for (const texto of ["7123456", "07123456", "7.123.456"]) {
    assert.deepEqual(buscar(texto), ["SANMARTIN, Hugo"], texto);
  }
});

test("número parcial: primero los documentos que empiezan así", () => {
  assert.deepEqual(buscar("3611"), ["Martínez, Ramiro"]);
  // "33000" es el comienzo del DNI de Anaya (33.000.111) y además está en el
  // medio del CUIL de López (27-32330001-9): primero el que empieza así.
  assert.deepEqual(buscar("33000"), ["ANAYA, Gustavo", "LOPEZ, Analía"]);
  assert.deepEqual(buscar("88888888"), []);
});

test("nombre y documento juntos", () => {
  assert.deepEqual(buscar("martinez 25666777"), ["MARTINEZ, JUAN TADEO"]);
  assert.deepEqual(buscar("25666777 juan"), ["MARTINEZ, JUAN TADEO"]);
  assert.deepEqual(buscar("ramiro 25666777"), []);
});

test("texto que no es ni nombre ni documento no trae nada", () => {
  assert.deepEqual(buscar("zzz"), []);
  assert.deepEqual(buscar("abc123"), []);
});

test("interpretarBusqueda junta todos los dígitos en un solo número", () => {
  assert.deepEqual(interpretarBusqueda("Pérez 30.123.456"), {
    palabras: ["perez"],
    numero: "30123456",
  });
  assert.deepEqual(interpretarBusqueda("20-30123456-7"), {
    palabras: [],
    numero: "20301234567",
  });
  assert.deepEqual(interpretarBusqueda(""), { palabras: [], numero: "" });
});

test("normalizarTexto", () => {
  assert.equal(normalizarTexto("  MARTÍNEZ,  Ramiro "), "martinez ramiro");
  assert.equal(normalizarTexto("Nuñez-Güemes"), "nunez guemes");
  assert.equal(normalizarTexto("D'Angelo"), "dangelo");
  assert.equal(normalizarTexto("D‘Angelo"), "dangelo");
  assert.equal(normalizarTexto("ÁÉÍÓÚ áéíóú ÀÈÌÒÙ Ü ü Ñ ñ"), "aeiou aeiou aeiou u u n n");
  // Tilde y eñe "descompuestas" (letra + marca suelta).
  assert.equal(normalizarTexto("Mun\u0303oz Jose\u0301"), "munoz jose");
  // Las tres formas de la Ñ mal codificada que hay en la base, y sus minúsculas.
  assert.equal(normalizarTexto("MU¥OZ"), "munoz");
  assert.equal(normalizarTexto("LUDUEÐA"), "luduena");
  assert.equal(normalizarTexto("ACUÃ‘A"), "acuna");
  assert.equal(normalizarTexto("ACUÃ\u0091A"), "acuna");
  assert.equal(normalizarTexto("mu¤oz muðoz muÃ±oz"), "munoz munoz munoz");
  assert.equal(normalizarTexto(null), "");
});

test("formato de CUIL y DNI", () => {
  assert.equal(formatearCuil("20361112227"), "20-36111222-7");
  assert.equal(formatearCuil("123"), "123");
  assert.equal(dniDeCuil("20361112227"), "36111222");
  assert.equal(dniDeCuil("20071234563"), "7123456");
  assert.equal(dniDeCuil("123"), "");
  assert.equal(formatearDni("36111222"), "36.111.222");
  assert.equal(formatearDni("7123456"), "7.123.456");
});

test("nombreCompleto", () => {
  assert.equal(nombreCompleto({ apellido: "GOMEZ", nombre: "Ana" }), "GOMEZ, Ana");
  assert.equal(nombreCompleto({ apellido: "GOMEZ ANA", nombre: "" }), "GOMEZ ANA");
});

test("rinde con un padrón grande: 5.000 afiliados en pocos milisegundos", () => {
  const muchos = Array.from({ length: 5000 }, (_, i) => ({
    ...AFILIADOS[i % AFILIADOS.length],
    empleado_id: i + 1,
    cuil: String(20000000000 + i * 7919).slice(0, 11),
  }));
  const indice = indexarAfiliados(muchos);

  const inicio = performance.now();
  for (const texto of ["m", "ma", "mar", "mart", "martinez ramiro", "3611", "20361112227"]) {
    buscarAfiliados(indice, texto);
  }
  const porBusqueda = (performance.now() - inicio) / 7;

  assert.ok(porBusqueda < 50, `cada búsqueda tardó ${porBusqueda.toFixed(1)} ms`);
});
