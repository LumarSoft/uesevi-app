"use client";

import PanelPagosDetalle from "@/modules/Admin/PanelPagos/Detalle";

export default function PanelPagosDetallePage({
  params,
}: {
  params: { idEmpresa: string };
}) {
  return (
    <div className="container mx-auto p-6">
      <PanelPagosDetalle idEmpresa={params.idEmpresa} />
    </div>
  );
}
