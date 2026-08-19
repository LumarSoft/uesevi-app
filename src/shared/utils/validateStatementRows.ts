/**
 * Validación del Excel de declaraciones juradas (importación y rectificación).
 *
 * Espeja las reglas del backend (api/utils/employeeImportValidation.js) para
 * que la empresa vea los errores ANTES de enviar el archivo, con el número de
 * fila del Excel. Antes solo se miraban las columnas de la primera fila, así
 * que una fila sin CUIL pasaba el control del front, fallaba en la base y la
 * carga se reportaba como exitosa igual.
 */

import { REQUIRED_COLUMNS } from "@/modules/company/empleados/importacion/constants/excelSchema";

export interface RowError {
  fila: number | null;
  campo: string | null;
  mensaje: string;
}

export const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre",
  apellido: "Apellido",
  cuil: "CUIL",
  adherido_a_sindicato: "Adherido a sindicato",
  categora: "Categoría",
  sueldo_bsico: "Sueldo básico",
  adicionales: "Adicionales",
  suma_no_remunerativa: "Suma no remunerativa",
  ad_remunerativo: "Adicional remunerativo",
};

// El Excel arranca en la fila 2 (la 1 son los encabezados).
export const excelRowNumber = (index: number) => index + 2;

const text = (value: unknown) => String(value ?? "").trim();

/** Deja el CUIL en solo dígitos: acepta "20-12345678-9", "20 12345678 9", etc. */
export const normalizeCuil = (value: unknown) => text(value).replace(/\D/g, "");

const AFILIADO_VALUES = ["si", "sí", "true", "verdadero", "1"];
const NO_AFILIADO_VALUES = ["no", "false", "falso", "0"];

export const isAfiliado = (value: unknown) =>
  AFILIADO_VALUES.includes(text(value).toLowerCase());

export const isValidSindicatoValue = (value: unknown) => {
  const v = text(value).toLowerCase();
  return AFILIADO_VALUES.includes(v) || NO_AFILIADO_VALUES.includes(v);
};

/** Convierte a número aceptando "1234,56" y "$ 1.234,56". null si no es número. */
export const parseAmount = (value: unknown): number | null => {
  if (value === undefined || value === null || text(value) === "") return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;

  let raw = text(value).replace(/\s|\$/g, "");
  if (raw.includes(",")) {
    raw = raw.replace(/\./g, "").replace(",", ".");
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const error = (
  index: number | null,
  field: string | null,
  mensaje: string
): RowError => ({
  fila: index === null ? null : excelRowNumber(index),
  campo: field ? FIELD_LABELS[field] || field : null,
  mensaje,
});

/** Columnas que faltan en TODO el archivo (encabezados mal escritos o ausentes). */
export const getMissingColumns = (rows: any[]): string[] => {
  if (!rows.length) return [];

  // Una columna se considera presente si aparece en alguna fila: si está vacía
  // en todas, el error se reporta después fila por fila.
  const present = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row || {}).forEach((key) => present.add(key));
  });

  return REQUIRED_COLUMNS.filter((col) => !present.has(col)).map(
    (col) => FIELD_LABELS[col] || col
  );
};

/**
 * Valida todas las filas del Excel.
 * @param rows              Filas ya normalizadas (claves sin espacios).
 * @param validCategories   Nombres de categorías del sistema. Si viene vacío no se valida la categoría contra el sistema.
 */
export const validateStatementRows = (
  rows: any[],
  validCategories: string[] = []
): RowError[] => {
  const errors: RowError[] = [];

  if (!rows.length) {
    return [
      error(
        null,
        null,
        "El archivo no contiene datos. Verificá que la primera hoja tenga los empleados y los encabezados correctos."
      ),
    ];
  }

  const missingColumns = getMissingColumns(rows);
  if (missingColumns.length > 0) {
    errors.push(
      error(
        null,
        null,
        `Faltan columnas obligatorias en el archivo: ${missingColumns.join(", ")}`
      )
    );
    return errors;
  }

  const categories = new Map(
    validCategories
      .filter(Boolean)
      .map((name) => [name.trim().toLowerCase(), name])
  );

  const seenCuils = new Map<string, number>();

  rows.forEach((row, index) => {
    const nombre = text(row?.nombre);
    const apellido = text(row?.apellido);
    const cuil = normalizeCuil(row?.cuil);
    const categoria = text(row?.categora);

    if (!nombre) errors.push(error(index, "nombre", "El nombre no puede estar vacío"));
    if (!apellido)
      errors.push(error(index, "apellido", "El apellido no puede estar vacío"));

    if (!cuil) {
      const quien = `${nombre} ${apellido}`.trim();
      errors.push(
        error(
          index,
          "cuil",
          `Falta el CUIL${
            quien ? ` de ${quien}` : ""
          }. Es obligatorio para identificar al empleado.`
        )
      );
    } else if (cuil.length !== 11) {
      errors.push(
        error(
          index,
          "cuil",
          `El CUIL "${text(row?.cuil)}" debe tener 11 dígitos (tiene ${cuil.length})`
        )
      );
    } else if (seenCuils.has(cuil)) {
      errors.push(
        error(
          index,
          "cuil",
          `CUIL duplicado: ${cuil} ya fue declarado en la fila ${seenCuils.get(cuil)}`
        )
      );
    } else {
      seenCuils.set(cuil, excelRowNumber(index));
    }

    if (!categoria) {
      errors.push(error(index, "categora", "La categoría no puede estar vacía"));
    } else if (categories.size > 0 && !categories.has(categoria.toLowerCase())) {
      errors.push(
        error(
          index,
          "categora",
          `La categoría "${categoria}" no existe en el sistema. Revisá las opciones disponibles.`
        )
      );
    }

    if (!isValidSindicatoValue(row?.adherido_a_sindicato)) {
      errors.push(
        error(
          index,
          "adherido_a_sindicato",
          `Valor inválido "${text(row?.adherido_a_sindicato)}". Debe ser Sí o No.`
        )
      );
    }

    const amountFields: { field: string; required: boolean }[] = [
      { field: "sueldo_bsico", required: true },
      { field: "adicionales", required: false },
      { field: "suma_no_remunerativa", required: false },
      { field: "ad_remunerativo", required: false },
    ];

    amountFields.forEach(({ field, required }) => {
      const value = row?.[field];
      const isEmpty = value === undefined || value === null || text(value) === "";

      if (isEmpty) {
        if (required) {
          errors.push(
            error(
              index,
              field,
              `${FIELD_LABELS[field]} es obligatorio y no puede estar vacío`
            )
          );
        }
        return;
      }

      const parsed = parseAmount(value);
      if (parsed === null) {
        errors.push(
          error(
            index,
            field,
            `${FIELD_LABELS[field]} debe ser un número (se recibió "${text(value)}")`
          )
        );
        return;
      }

      if (parsed < 0) {
        errors.push(
          error(index, field, `${FIELD_LABELS[field]} no puede ser negativo`)
        );
      }
    });
  });

  return errors;
};
