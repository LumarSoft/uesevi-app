import { IOldContratos } from "../types/Querys/IOldContratos";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterOldDeclaraciones = (
  fecha: { from: Date; to: Date } | undefined,
  empresa: number | null,
  empleado: number | null,
  contratos: IOldContratos[],
  declaraciones: IOldDeclaracion[]
) => {
  console.log(fecha, empresa, empleado);

  let declaracionesFiltradas: IOldDeclaracion[] = [...declaraciones];

  // Primero filtramos por la fecha
  if (fecha) {
    declaracionesFiltradas = declaracionesFiltradas.filter((declaracion) => {
      const fechaDeclaracion = new Date(declaracion.fecha);
      return fechaDeclaracion >= fecha.from && fechaDeclaracion <= fecha.to;
    });
  }
  
  console.log(declaracionesFiltradas);

  // Luego filtramos por la empresa
  if (empresa) {
    declaracionesFiltradas = declaracionesFiltradas.filter(
      (declaracion) => declaracion.old_empresa_id === empresa
    );
  }
  console.log(declaracionesFiltradas);

  // Luego filtramos por empleado
  if (empleado) {
    const contrato = contratos.find(
      (contrato) => contrato.empleado_id === empleado
    );
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
