import { Link } from "@tanstack/react-router";
import { MapPin, Moon, Sun } from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import { IconButton } from "../IconButton/IconButton";
import "./Header.css";

export function Header({ onLocationClick }) {
  const { location } = useApp();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mba-header">
      <div className="mba-header__inner">
        <Link to="/" className="mba-header__brand" aria-label="MovilidadBA, ir al inicio">
          <span className="mba-header__mark" aria-hidden="true">
            MB
          </span>
          <span className="mba-header__name">
            Movilidad<strong>BA</strong>
          </span>
        </Link>

        <div className="mba-header__actions">
          <button type="button" className="mba-header__location" onClick={onLocationClick}>
            <MapPin size={15} aria-hidden="true" />
            <span>{location?.label || "Elegir ubicación"}</span>
          </button>
          <IconButton
            icon={theme === "dark" ? Sun : Moon}
            label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
            onClick={toggleTheme}
          />
        </div>
      </div>
    </header>
  );
}
