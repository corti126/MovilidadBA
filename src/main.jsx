import React from "react"; // O podés usar react standard si prefieres
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css"; // O tu archivo de estilos principal

const router = getRouter();

const rootElement = document.getElementById("root");
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}