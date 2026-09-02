import { createFileRoute } from "@tanstack/react-router";

import { Lines } from "../pages/Lines/Lines";

export const Route = createFileRoute("/lines/")({
  head: () => ({
    meta: [
      { title: "Líneas de subte y tren — MovilidadBA" },
      {
        name: "description",
        content: "Estado en vivo de las líneas de subte y de los servicios ferroviarios del AMBA.",
      },
      { property: "og:title", content: "Líneas de subte y tren — MovilidadBA" },
      { property: "og:description", content: "Estado, recorridos y alertas de subtes y trenes." },
    ],
  }),
  component: Lines,
});
