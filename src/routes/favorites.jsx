import { createFileRoute } from "@tanstack/react-router";

import { Favorites } from "../pages/Favorites/Favorites";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favoritos — MovilidadBA" },
      {
        name: "description",
        content: "Tus líneas, paradas y lugares guardados del transporte de Buenos Aires.",
      },
      { property: "og:title", content: "Favoritos — MovilidadBA" },
      { property: "og:description", content: "Tus líneas y lugares guardados, siempre a mano." },
    ],
  }),
  component: Favorites,
});
