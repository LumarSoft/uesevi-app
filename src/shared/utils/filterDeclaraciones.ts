import { IDeclaracion } from "../types/Querys/IDeclaracion";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterDeclaraciones = (
  empresa: number | null,
  declaraciones: (IDeclaracion | IOldDeclaracion)[],
  salaryEmployee: { declaracion_id: number }[]
): (IDeclaracion | IOldDeclaracion)[] => {
  // Verifica el tipo de las declaraciones y realiza el filtrado correspondiente
  let declaracionesFiltradas: (IDeclaracion | IOldDeclaracion)[];

  if (declaraciones.length > 0) {
    const primeraDeclaracion = declaraciones[0];

    if ("empresa_id" in primeraDeclaracion) {
      declaracionesFiltradas = declaraciones as IDeclaracion[];
    } else if ("old_empresa_id" in primeraDeclaracion) {
      declaracionesFiltradas = declaraciones as IOldDeclaracion[];
    } else {
      return [];
    }
  } else {
    return [];
  }

  // Filtrar por empresa si se ha proporcionado
  if (empresa !== null) {
    declaracionesFiltradas = declaracionesFiltradas.filter((declaracion) => {
      if ("old_empresa_id" in declaracion) {
        return declaracion.old_empresa_id === empresa;
      } else if ("empresa_id" in declaracion) {
        return declaracion.empresa_id === empresa;
      }
      return false;
    });
  }

  // Filtrar por declaraciones que coincidan con los IDs en salaryEmployee
  if (salaryEmployee && salaryEmployee.length > 0) {
    const salaryDeclaracionIds = new Set(salaryEmployee.map(s => s.declaracion_id));
    declaracionesFiltradas = declaracionesFiltradas.filter(declaracion =>
      salaryDeclaracionIds.has(declaracion.id)
    );
  }

  console.log(declaracionesFiltradas);

  return declaracionesFiltradas;
};
