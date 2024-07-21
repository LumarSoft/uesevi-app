import { IEmpresa } from "./Querys/IEmpresa";
import { IDashboard } from "./Querys/IDashboard";

export type FetchDataResult = { data: IEmpresa[] } | { error: string };
export type FetchDataResultDashboard = { data: IDashboard } | { error: string };