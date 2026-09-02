import { createFileRoute, useParams } from "@tanstack/react-router";

import { LineDetail } from "../pages/LineDetail/LineDetail";

export const Route = createFileRoute("/lines/$mode/$id")({
  head: () => ({
    meta: [
      { title: "Detalle de la línea — MovilidadBA" },
      {
        name: "description",
        content: "Estado del servicio, próximos arribos y alertas de la línea elegida.",
      },
      { property: "og:title", content: "Detalle de la línea — MovilidadBA" },
      { property: "og:description", content: "Estado y próximos servicios de la línea." },
    ],
  }),
  component: LineDetailRoute,
});

function LineDetailRoute() {
  const { mode, id } = useParams({ from: "/lines/$mode/$id" });
  return <LineDetail mode={mode} id={id} />;
}
