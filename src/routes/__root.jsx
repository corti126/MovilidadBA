import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { BottomNavigation } from "../components/BottomNavigation/BottomNavigation";
import { Header } from "../components/Header/Header";
import { LocationPicker } from "../components/LocationPicker/LocationPicker";
import { OfflineState } from "../components/OfflineState/OfflineState";
import { AppProvider } from "../context/AppContext";
import { ThemeProvider } from "../context/ThemeContext";
import { reportLovableError } from "../lib/lovable-error-reporting";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { name: "theme-color", content: "#1478d4" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "MovilidadBA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootShell({ children }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  const [locationOpen, setLocationOpen] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <Header onLocationClick={() => setLocationOpen(true)} />
          {!online ? (
            <div className="mba-page" style={{ paddingTop: 12, paddingBottom: 0 }}>
              <OfflineState />
            </div>
          ) : null}
          <main>
            <Outlet />
          </main>
          <BottomNavigation />
          <LocationPicker open={locationOpen} onClose={() => setLocationOpen(false)} />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function NotFound() {
  return (
    <div className="mba-page" style={{ paddingTop: 60, textAlign: "center" }}>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>No encontramos esta pantalla</h1>
      <p style={{ marginTop: 8, color: "var(--text-soft)" }}>Volvé al inicio para seguir viajando.</p>
    </div>
  );
}

function RootError({ error, reset }) {
  useEffect(() => {
    reportLovableError(error, { boundary: "movilidadba_root" });
  }, [error]);

  return (
    <div className="mba-page" style={{ paddingTop: 60, textAlign: "center" }}>
      <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Algo no cargó bien</h1>
      <p style={{ marginTop: 8, color: "var(--text-soft)" }}>
        Probá de nuevo en unos segundos.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: 16,
          minHeight: 44,
          padding: "0 20px",
          borderRadius: 999,
          border: "none",
          background: "var(--brand-500)",
          color: "#fff",
          fontWeight: 600,
        }}
      >
        Reintentar
      </button>
    </div>
  );
}
