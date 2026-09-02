import { createFileRoute } from "@tanstack/react-router";

import { Promotions } from "../pages/Promotions/Promotions";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promos de transporte — MovilidadBA" },
      {
        name: "description",
        content: "Beneficios y descuentos en subte, tren y colectivos de Buenos Aires.",
      },
      { property: "og:title", content: "Promos de transporte — MovilidadBA" },
      { property: "og:description", content: "Descuentos y beneficios del transporte público." },
    ],
  }),
  component: Promotions,
});
