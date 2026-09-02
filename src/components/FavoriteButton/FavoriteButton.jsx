import { Heart } from "lucide-react";

import { useFavorites } from "../../hooks/useFavorites";
import "./FavoriteButton.css";

export function FavoriteButton({ favorite }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(favorite.id);

  return (
    <button
      type="button"
      className={"mba-favorite" + (active ? " is-active" : "")}
      aria-pressed={active}
      aria-label={active ? "Quitar de favoritos" : "Guardar en favoritos"}
      onClick={(event) => {
        event.stopPropagation();
        toggleFavorite(favorite);
      }}
    >
      <Heart size={18} aria-hidden="true" fill={active ? "currentColor" : "none"} />
    </button>
  );
}
