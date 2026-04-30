"use client";

import React, { useState, useCallback, useMemo } from "react";
import type { Profession } from "@/lib/types/database";
import { useTranslation } from "@/lib/i18n/context";

type MultiProfessionPickerProps = {
  professions: Profession[];
  value: string[];
  onChange: (ids: string[]) => void;
  customProfession: string;
  onCustomChange: (text: string) => void;
  max?: number;
  error?: string;
  label: string;
  hint?: string;
};

export const MultiProfessionPicker = ({
  professions,
  value,
  onChange,
  customProfession,
  onCustomChange,
  max = 5,
  error,
  label,
  hint,
}: MultiProfessionPickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState("");

  // Group professions by category
  const groupedProfessions = useMemo(() => {
    const groups: Record<string, Profession[]> = {};
    professions
      .filter((p) => p.is_active)
      .sort((a, b) => a.name_fr.localeCompare(b.name_fr))
      .forEach((p) => {
        if (!groups[p.category]) groups[p.category] = [];
        groups[p.category].push(p);
      });
    return groups;
  }, [professions]);

  // Filter based on search
  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedProfessions;

    const searchLower = search.toLowerCase();
    const result: Record<string, Profession[]> = {};

    Object.entries(groupedProfessions).forEach(([category, profs]) => {
      const filtered = profs.filter((p) =>
        p.name_fr.toLowerCase().includes(searchLower) ||
        p.name_en.toLowerCase().includes(searchLower)
      );
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    });

    return result;
  }, [groupedProfessions, search]);

  const handleSelectProfession = useCallback(
    (professionId: string) => {
      if (value.includes(professionId)) {
        onChange(value.filter((id) => id !== professionId));
      } else if (value.length < max) {
        onChange([...value, professionId]);
      }
    },
    [value, onChange, max]
  );

  const handleRemoveSelected = useCallback(
    (professionId: string) => {
      onChange(value.filter((id) => id !== professionId));
    },
    [value, onChange]
  );

  const handleAddCustom = useCallback(() => {
    if (customInput.trim()) {
      onCustomChange(customInput.trim());
      setCustomInput("");
      setShowCustomInput(false);
    }
  }, [customInput, onCustomChange]);

  const handleRemoveCustom = useCallback(() => {
    onCustomChange("");
  }, [onCustomChange]);

  const isFull = value.length + (customProfession ? 1 : 0) >= max;

  const categoryLabels: Record<string, string> = {
    kitchen: t("profession.category.kitchen"),
    service: t("profession.category.service"),
    hotel: t("profession.category.hotel"),
    events: t("profession.category.events"),
    support: t("profession.category.support"),
  };

  // Get selected profession objects
  const selectedProfessions = value
    .map((id) => professions.find((p) => p.id === id))
    .filter(Boolean) as Profession[];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      {hint && (
        <p className="text-xs text-text-tertiary mb-2">{hint}</p>
      )}

      {/* Selected pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedProfessions.map((prof) => (
          <div
            key={prof.id}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full"
          >
            <span className="text-sm">{prof.icon}</span>
            <span className="text-sm text-primary font-medium">{prof.name_fr}</span>
            <button
              type="button"
              onClick={() => handleRemoveSelected(prof.id)}
              className="ml-1 text-primary/60 hover:text-primary transition-colors"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        ))}
        {customProfession && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-text-tertiary/10 border border-text-tertiary/20 rounded-full">
            <span className="text-sm text-text-tertiary font-medium">{customProfession}</span>
            <span className="text-xs text-text-tertiary italic">{t("profession.suggested")}</span>
            <button
              type="button"
              onClick={handleRemoveCustom}
              className="ml-1 text-text-tertiary/60 hover:text-text-tertiary transition-colors"
              aria-label="Remove"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder={t("createAd.searchRoles")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white border border-transparent rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-150 focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/10 mb-3"
      />

      {/* Grouped list */}
      <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
        {Object.entries(filteredGroups).map(([category, profs]) => (
          <div key={category}>
            <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide px-2 py-1 mb-1.5">
              {categoryLabels[category] || category}
            </div>
            <div className="flex flex-wrap gap-2 px-2">
              {profs.map((prof) => {
                const isSelected = value.includes(prof.id);
                const isDisabled = isFull && !isSelected;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => !isDisabled && handleSelectProfession(prof.id)}
                    disabled={isDisabled}
                    className={[
                      "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-150",
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : isDisabled
                        ? "bg-gray-100 text-text-tertiary border-gray-200 cursor-not-allowed opacity-50"
                        : "bg-white border-border text-text-primary hover:border-primary hover:bg-primary/5",
                    ].join(" ")}
                  >
                    <span className="text-sm">{prof.icon}</span>
                    <span className="text-sm font-medium">{prof.name_fr}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom profession input toggle */}
      {!showCustomInput && (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          disabled={isFull && !customProfession}
          className={[
            "text-sm font-medium py-2 px-2 rounded transition-colors",
            isFull && !customProfession
              ? "text-text-tertiary cursor-not-allowed opacity-50"
              : "text-primary hover:text-primary/80",
          ].join(" ")}
        >
          + {t("createAd.addCustomRole")}
        </button>
      )}

      {/* Custom profession inline input */}
      {showCustomInput && (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddCustom();
              if (e.key === "Escape") {
                setShowCustomInput(false);
                setCustomInput("");
              }
            }}
            placeholder={t("createAd.customRolePlaceholder")}
            disabled={isFull && !customProfession}
            autoFocus
            className="flex-1 bg-white border border-transparent rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-150 focus:bg-white focus:border-primary focus:ring-[3px] focus:ring-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleAddCustom}
            disabled={!customInput.trim() || (isFull && !customProfession)}
            className="px-4 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("createAd.customRoleSubmit")}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomInput("");
            }}
            className="px-4 py-2.5 bg-text-tertiary/10 text-text-tertiary font-medium rounded-xl hover:bg-text-tertiary/20 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
