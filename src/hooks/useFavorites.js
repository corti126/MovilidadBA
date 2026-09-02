import { useApp } from "../context/AppContext";

/** Favoritos con IDs estables y payload mínimo. */
export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite } = useApp();
  return { favorites, toggleFavorite, isFavorite };
}

export function favoriteId(kind, id) {
  return kind + ":" + id;
}
