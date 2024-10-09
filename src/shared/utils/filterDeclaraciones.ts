import { IContratos } from "../types/Querys/IContratos";
import { IDeclaracion } from "../types/Querys/IDeclaracion";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterDeclaraciones = (
  fecha: { from: Date | null; to: Date | null } | undefined,
  empresa: number | null,
  empleado: number | null,
  contratos: IContratos[],
  declaraciones: (IDeclaracion | IOldDeclaracion)[]
): (IDeclaracion | IOldDeclaracion)[] => {
  // Verifica el tipo de las declaraciones y realiza el filtrado correspondiente
  let declaracionesFiltradas: (IDeclaracion | IOldDeclaracion)[];

  // Comprobamos el tipo de la primera declaración para determinar el tipo general
  if (declaraciones.length > 0) {
    const primeraDeclaracion = declaraciones[0];

    // Filtrar por el tipo de declaración
    if ("empresa_id" in primeraDeclaracion) {
      // Es un IDeclaracion
      declaracionesFiltradas = declaraciones as IDeclaracion[];
    } else if ("old_empresa_id" in primeraDeclaracion) {
      // Es un IOldDeclaracion
      declaracionesFiltradas = declaraciones as IOldDeclaracion[];
    } else {
      // Si no coincide con ningún tipo, retornar un array vacío
      return [];
    }
  } else {
    // Si no hay declaraciones, retornar un array vacío
    return [];
  }

  // Filtrar por fecha solo si se han proporcionado ambas fechas
  if (fecha && fecha.from !== undefined && fecha.to !== undefined) {
    declaracionesFiltradas = declaracionesFiltradas.filter((declaracion) => {
      const fechaDeclaracion = new Date(declaracion.fecha);
      return (
        fecha.from !== null &&
        fecha.to !== null &&
        fechaDeclaracion >= fecha.from &&
        fechaDeclaracion <= fecha.to
      );
    });
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

  // Filtrar por empleado si se ha proporcionado
  if (empleado !== null) {
    const contrato = contratos.find(
      (contrato) => contrato.empleado_id === empleado
    );
    if (contrato) {
      declaracionesFiltradas = declaracionesFiltradas.filter(
        (declaracion) => declaracion.empresa_id === contrato.empresa_id
      );
    } else {
      declaracionesFiltradas = []; // Si no hay contrato, el empleado no tiene declaraciones
    }
  }

  return declaracionesFiltradas;
};
