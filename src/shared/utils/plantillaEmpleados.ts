import ExcelJS from "exceljs";
import { fetchData } from "@/services/mysql/functions";
import { ICategoria } from "@/shared/types/Querys/ICategory";

/**
 * Plantilla de importación de empleados.
 *
 * IMPORTANTE: NO se genera un archivo nuevo. Se carga el archivo original
 * `public/importar-ejemplo.xlsx` y se le inyecta ÚNICAMENTE el desplegable
 * (data validation) de la columna "Categoría". Así el cliente recibe el MISMO
 * formato de siempre (cabeceras, estilos, filas de ejemplo, nombre de hoja) y
 * lo único que cambia es el desplegable de categorías.
 */
const PLANTILLA_ORIGEN = "/importar-ejemplo.xlsx";
const NOMBRE_DESCARGA = "importar-ejemplo.xlsx";

// Cabecera (normalizada) de la columna que lleva el desplegable.
const HEADER_CATEGORIA = "categora";
const ULTIMA_FILA = 1000; // rango al que se aplica la validación (fila 2..1000)

const normalizar = (v: unknown) =>
  String(v ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");

const colLetter = (n: number) => {
  let s = "";
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

/** Trae las categorías reales del sistema (GET /category). */
export async function obtenerCategorias(): Promise<string[]> {
  const result = await fetchData("category");
  if (result?.ok && Array.isArray(result.data)) {
    return result.data
      .map((c: ICategoria) => c?.nombre)
      .filter((n: string): n is string => Boolean(n));
  }
  return [];
}

/**
 * Descarga la plantilla original con un desplegable de categorías reales del
 * sistema en la columna "Categoría". Mantiene intacto el resto del archivo.
 */
export async function descargarPlantillaEmpleados(): Promise<void> {
  const [categorias, originalBuffer] = await Promise.all([
    obtenerCategorias(),
    fetch(PLANTILLA_ORIGEN).then((r) => {
      if (!r.ok) throw new Error("No se pudo cargar la plantilla base.");
      return r.arrayBuffer();
    }),
  ]);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(originalBuffer);

  const sheet = workbook.worksheets[0];

  // Solo agregamos el desplegable si hay categorías para ofrecer.
  if (categorias.length > 0 && sheet) {
    // Ubicar la columna "Categoría" por su cabecera (fila 1), normalizada.
    let colCategoria = 0;
    sheet.getRow(1).eachCell((cell, colNumber) => {
      if (normalizar(cell.value) === HEADER_CATEGORIA) colCategoria = colNumber;
    });

    if (colCategoria > 0) {
      // Hoja auxiliar OCULTA (veryHidden) con los nombres de categoría. Se
      // referencia por rango para no chocar con el límite de ~255 caracteres
      // de las listas inline. veryHidden evita que aparezca como pestaña.
      const listas = workbook.addWorksheet("Listas");
      categorias.forEach((nombre, i) => {
        listas.getCell(`A${i + 1}`).value = nombre;
      });
      listas.state = "veryHidden";

      const letra = colLetter(colCategoria);
      const rango = `Listas!$A$1:$A$${categorias.length}`;
      for (let row = 2; row <= ULTIMA_FILA; row++) {
        sheet.getCell(`${letra}${row}`).dataValidation = {
          type: "list",
          allowBlank: false,
          formulae: [rango],
          showErrorMessage: true,
          errorStyle: "error",
          errorTitle: "Categoría inválida",
          error: "Seleccione una categoría de la lista desplegable.",
        };
      }
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = NOMBRE_DESCARGA;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
