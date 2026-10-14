import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import "./styles.css";

// Esta entrada se usa cuando MovilidadBA se ejecuta como una SPA de Vite con
// un index.html que contiene <div id="root"></div>. TanStack Start usa su
// propia entrada y puede convivir con este archivo sin importarlo.
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('No se encontró el elemento #root. Agregá <div id="root"></div> al index.html.');
}

const router = getRouter();
const root = createRoot(rootElement);

// RootShell usa esta marca para distinguir este montaje del documento SSR.
document.documentElement.dataset.mbaSpa = "true";

root.render(
  <RouterProvider router={router} />,
);