import { Link } from "@tanstack/react-router";
import { Heart, Map, Star, Route as RouteIcon, Compass } from "lucide-react";

import "./BottomNavigation.css";

const ITEMS = [
  { to: "/", label: "Cerca", icon: Compass },
  { to: "/favorites", label: "Favoritos", icon: Heart },
  { to: "/map", label: "Mapa", icon: Map },
  { to: "/promotions", label: "Promos", icon: Star },
  { to: "/lines", label: "Líneas", icon: RouteIcon },
];

export function BottomNavigation() {
  return (
    <nav className="mba-nav" aria-label="Navegación principal">
      <ul className="mba-nav__list">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "mba-nav__link is-active", "aria-current": "page" }}
                inactiveProps={{ className: "mba-nav__link" }}
              >
                <Icon size={21} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
