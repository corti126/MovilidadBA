import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { LocationPicker } from "../components/LocationPicker/LocationPicker";
import { MapPage } from "../pages/Map/Map";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Mapa del transporte — MovilidadBA" },
      {
        name: "description",
        content: "Mapa en vivo con los colectivos que circulan cerca tuyo en Buenos Aires.",
      },
      { property: "og:title", content: "Mapa del transporte — MovilidadBA" },
      { property: "og:description", content: "Vehículos y paradas cerca tuyo, en un mapa simple." },
    ],
  }),
  component: MapRoute,
});

function MapRoute() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MapPage onOpenLocation={() => setOpen(true)} />
      <LocationPicker open={open} onClose={() => setOpen(false)} />
    </>
  );
}
