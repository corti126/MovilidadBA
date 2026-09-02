import { Loader2, Search } from "lucide-react";

import "./SearchBar.css";

export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar",
  label,
  loading = false,
  id = "mba-search",
  onFocus,
}) {
  return (
    <div className="mba-search">
      <label className="mba-visually-hidden" htmlFor={id}>
        {label || placeholder}
      </label>
      <Search size={18} className="mba-search__icon" aria-hidden="true" />
      <input
        id={id}
        type="search"
        className="mba-search__input"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={onFocus}
        onChange={(event) => onChange(event.target.value)}
      />
      {loading ? <Loader2 size={17} className="mba-search__spinner" aria-hidden="true" /> : null}
    </div>
  );
}
