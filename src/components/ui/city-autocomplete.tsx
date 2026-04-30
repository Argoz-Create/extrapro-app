"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export type CityResult = {
  nom: string;
  codesPostaux: string[];
  codeDepartement: string;
  codeRegion: string;
  code: string; // INSEE code
};

type CityAutocompleteProps = {
  label?: string;
  placeholder?: string;
  value: string; // display name of selected city
  postalCode?: string;
  onSelect: (city: CityResult) => void;
  onClear: () => void;
  error?: string;
  existingCities?: { value: string; label: string }[];
  onSelectExisting?: (cityId: string) => void;
};

export function CityAutocomplete({
  label,
  placeholder = "Rechercher une ville...",
  value,
  onSelect,
  onClear,
  error,
  existingCities = [],
  onSelectExisting,
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<CityResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(!!value);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync external value changes
  useEffect(() => {
    if (value && value !== query) {
      setQuery(value);
      setIsSelected(true);
    }
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchCities = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(searchQuery)}&fields=nom,codesPostaux,codeDepartement,codeRegion,code&boost=population&limit=7`
        );
        if (res.ok) {
          const data: CityResult[] = await res.json();
          setResults(data);
        }
      } catch {
        // API unreachable - fail silently
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    setIsSelected(false);
    setIsOpen(true);

    // Clear previous selection
    if (isSelected) {
      onClear();
    }

    // Debounce API calls
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchCities(val);
    }, 300);
  }

  function handleSelectCity(city: CityResult) {
    setQuery(city.nom);
    setIsSelected(true);
    setIsOpen(false);
    setResults([]);
    onSelect(city);
  }

  function handleSelectExistingCity(cityId: string, cityName: string) {
    setQuery(cityName);
    setIsSelected(true);
    setIsOpen(false);
    setResults([]);
    onSelectExisting?.(cityId);
  }

  function handleFocus() {
    if (!isSelected && query.length >= 2) {
      setIsOpen(true);
    }
  }

  function handleClear() {
    setQuery("");
    setIsSelected(false);
    setResults([]);
    onClear();
  }

  // Filter existing cities that match the query
  const matchingExisting = query.length >= 2
    ? existingCities.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasResults = results.length > 0 || matchingExisting.length > 0;

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={[
            "w-full bg-white border border-transparent rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary",
            "outline-none transition-all duration-150",
            "focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/10",
            error ? "border-red-400 focus:border-red-400 focus:ring-red-400/10" : "",
            isSelected ? "pr-8" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />

        {isSelected && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-sm"
          >
            {"\u2715"}
          </button>
        )}

        {isLoading && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">
            ...
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Dropdown */}
      {isOpen && hasResults && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border-light bg-white shadow-lg max-h-60 overflow-y-auto">
          {/* Existing cities from DB */}
          {matchingExisting.length > 0 && (
            <>
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-text-tertiary bg-gray-50">
                Villes existantes
              </p>
              {matchingExisting.map((city) => (
                <button
                  key={city.value}
                  type="button"
                  onClick={() => handleSelectExistingCity(city.value, city.label)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors border-b border-border-light/50 last:border-b-0"
                >
                  <span className="font-medium text-text-primary">{city.label}</span>
                </button>
              ))}
            </>
          )}

          {/* API results */}
          {results.length > 0 && (
            <>
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase text-text-tertiary bg-gray-50">
                Toutes les villes de France
              </p>
              {results.map((city) => (
                <button
                  key={city.code}
                  type="button"
                  onClick={() => handleSelectCity(city)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 transition-colors border-b border-border-light/50 last:border-b-0"
                >
                  <span className="font-medium text-text-primary">{city.nom}</span>
                  <span className="ml-2 text-xs text-text-tertiary">
                    {city.codesPostaux[0]} — Dept. {city.codeDepartement}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      {/* No results message */}
      {isOpen && !hasResults && query.length >= 2 && !isLoading && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border-light bg-white shadow-lg px-3 py-3 text-sm text-text-tertiary text-center">
          Aucune ville trouvee
        </div>
      )}
    </div>
  );
}
