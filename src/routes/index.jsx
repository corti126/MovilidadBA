import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LocationPicker } from "../components/LocationPicker/LocationPicker";
import { Nearby } from "../pages/Nearby/Nearby";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MovilidadBA — Transporte público de Buenos Aires, simple" },
      {
        name: "description",
        content:
          "Mirá qué colectivos, subtes y trenes tenés cerca en Buenos Aires, con estado del servicio en tiempo real.",
      },
      { property: "og:title", content: "MovilidadBA — Transporte público simple" },
      {
        property: "og:description",
        content: "Lo más útil cerca tuyo: subtes, trenes y colectivos de Buenos Aires.",
      },
    ],
  }),
  component: NearbyRoute,
});

function NearbyRoute() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Nearby onOpenLocation={() => setOpen(true)} />
      <LocationPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
