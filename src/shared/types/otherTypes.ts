import { IEmpresa } from "./Querys/IEmpresa";
import { IDashboard } from "./Querys/IDashboard";

export type FetchDataResult =
  | { data: IEmpresa[] | IDashboard[] }
  | { error: string };
