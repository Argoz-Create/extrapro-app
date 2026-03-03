"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/context";
import type { Profession, City } from "@/lib/types/database";

type JobFiltersProps = {
  professions: Profession[];
  cities: City[];
  currentFilters: { profession?: string; city?: string };
};

export function JobFilters({ professions, cities, currentFilters }: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`?${params.toString()}`);
  }

  const professionOptions = [
    { value: "", label: t("filter.allProfessions") },
    ...professions.map((p) => ({
      value: p.id,
      label: `${p.icon} ${p.name_fr}`,
    })),
  ];

  const cityOptions = [
    { value: "", label: t("filter.allCities") },
    ...cities.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  return (
    <div className="flex gap-3">
      <Select
        options={professionOptions}
        value={currentFilters.profession ?? ""}
        onChange={(e) => updateFilter("profession", e.target.value)}
      />
      <Select
        options={cityOptions}
        value={currentFilters.city ?? ""}
        onChange={(e) => updateFilter("city", e.target.value)}
      />
    </div>
  );
}
