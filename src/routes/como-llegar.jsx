import { createFileRoute } from "@tanstack/react-router";

import { RoutePlanner } from "../pages/RoutePlanner/RoutePlanner";

export const Route = createFileRoute("/como-llegar")({
  head: () => ({
    meta: [
      { title: "Cómo llegar — MovilidadBA" },
      {
        name: "description",
        content: "Elegí origen y destino en Buenos Aires y compará opciones de transporte público.",
      },
      { property: "og:title", content: "Cómo llegar — MovilidadBA" },
      { property: "og:description", content: "Planificá tu viaje en transporte público." },
    ],
  }),
  component: RoutePlanner,
});
