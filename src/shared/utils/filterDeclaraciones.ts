import { IContratos } from "../types/Querys/IContratos";
import { IDeclaracion } from "../types/Querys/IDeclaracion";
import { IOldDeclaracion } from "../types/Querys/IOldDeclaracion";

export const filterDeclaraciones = (
  fecha: { from: Date; to: Date } | undefined,
  empresa: number | null,
  empleado: number | null,
  contratos: IContratos[],
  declaraciones: IDeclaracion[] | IOldDeclaracion[]
) => {
  console.log(fecha, empresa, empleado);

  let declaracionesFiltradas: IDeclaracion[] = declaraciones.filter(
    (declaracion): declaracion is IDeclaracion => {
      return "empresa_id" in declaracion;
    }
  );

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
      (declaracion) => declaracion.empresa_id === empresa
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
        (declaracion) => declaracion.empresa_id === contrato.empresa_id
      );
    } else {
      declaracionesFiltradas = []; // Si no hay contrato, el empleado no tiene declaraciones
    }
  }

  console.log(declaracionesFiltradas);

  return declaracionesFiltradas;
};
