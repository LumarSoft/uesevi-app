import { IContratos } from "../types/Querys/IContratos";
import { IDeclaracion } from "../types/Querys/IDeclaracion";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterDeclaraciones = (
  fecha: { from: Date | null; to: Date | null } | undefined,
  empresa: number | null,
  empleado: number | null,
  contratos: IContratos[],
  declaraciones: IDeclaracion[] | IOldDeclaracion[]
) => {
  let declaracionesFiltradas = declaraciones.filter((declaracion) => {
    return "empresa_id" in declaracion || "old_empresa_id" in declaracion;
  });


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
