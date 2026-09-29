import { IInfoDeclaracion } from "@/shared/types/Querys/IInfoDeclaracion";

export const esVersionReemplazada = (declaracion: Pick<IInfoDeclaracion, "es_version_anterior" | "estado">) =>
  Number(declaracion.es_version_anterior) === 1 || declaracion.estado === 3;
