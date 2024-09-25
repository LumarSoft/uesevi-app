import { IOldContratos } from "../types/Querys/IOldContratos";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterOldDeclaraciones = (
  fecha: { from: Date | null; to: Date | null } | undefined,
  empresa: number | null,
  empleado: number | null,
  contratos: IOldContratos[],
  declaraciones: IOldDeclaracion[]
) => {
  console.log(fecha, empresa, empleado);

  let declaracionesFiltradas: IOldDeclaracion[] = [...declaraciones];

  // Filtrar por fecha solo si se han proporcionado ambas fechas
  if (fecha && fecha.from !== null && fecha.to !== null) {
    declaracionesFiltradas = declaracionesFiltradas.filter((declaracion) => {
      const fechaDeclaracion = new Date(declaracion.fecha);
      return fecha.from !== null && fecha.to !== null && fechaDeclaracion >= fecha.from && fechaDeclaracion <= fecha.to;
    });
  }

  console.log(declaracionesFiltradas);

  // Filtrar por empresa si se ha proporcionado
  if (empresa !== null) {
    declaracionesFiltradas = declaracionesFiltradas.filter(
      (declaracion) => declaracion.old_empresa_id === empresa
    );
  }
  console.log(declaracionesFiltradas);

  // Filtrar por empleado si se ha proporcionado
  if (empleado !== null) {
    const contrato = contratos.find(
      (contrato) => contrato.empleado_id === empleado
    );
    console.log(contrato);
    if (contrato) {
      declaracionesFiltradas = declaracionesFiltradas.filter(
        (declaracion) => declaracion.old_empresa_id === contrato.empresa_id
      );
    } else {
      declaracionesFiltradas = []; // Si no hay contrato, el empleado no tiene declaraciones
    }
  }

  console.log(declaracionesFiltradas);

  return declaracionesFiltradas;
};