import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  getFavorites,
  getSavedLocation,
  getTransportFilter,
  saveFavorites,
  saveLocation,
  saveTransportFilter,
} from "../utils/storage";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilterState] = useState("all");
  const [location, setLocationState] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setFilterState(getTransportFilter());
    setLocationState(getSavedLocation());
    setReady(true);
  }, []);

  const setFilter = useCallback((value) => {
    setFilterState(value);
    saveTransportFilter(value);
  }, []);

  const setLocation = useCallback((value) => {
    setLocationState(value);
    if (value) saveLocation(value);
  }, []);

  const toggleFavorite = useCallback((favorite) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === favorite.id);
      const next = exists
        ? current.filter((item) => item.id !== favorite.id)
        : [...current, { ...favorite, savedAt: Date.now() }];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.some((item) => item.id === id), [favorites]);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      filter,
      setFilter,
      location,
      setLocation,
      ready,
    }),
    [favorites, toggleFavorite, isFavorite, filter, setFilter, location, setLocation, ready],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe usarse dentro de AppProvider");
  return context;
}
