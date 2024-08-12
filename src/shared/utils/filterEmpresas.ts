export function filterEmpresas(data: any[]) {
  const empresas = data.map((item) => item.nombre_empresa)
  const empresasFiltradas = empresas.filter((item, index) => empresas.indexOf(item) === index)
  return empresasFiltradas.map((item) => ({ value: item, label: item }))
}