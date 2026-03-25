"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/context";
import type { Profession, City, Region, Department } from "@/lib/types/database";

type JobFiltersProps = {
  professions: Profession[];
  cities: City[];
  regions: Region[];
  departments: Department[];
  currentFilters: {
    profession?: string;
    city?: string;
    region?: string;
    department?: string;
  };
};

export function JobFilters({
  professions,
  cities,
  regions,
  departments,
  currentFilters,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  function updateFilter(key: string, value: string, clearKeys?: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Clear dependent filters when parent changes
    if (clearKeys) {
      clearKeys.forEach((k) => params.delete(k));
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

  const regionOptions = [
    { value: "", label: t("filter.allRegions") },
    ...regions.map((r) => ({
      value: r.id,
      label: r.name,
    })),
  ];

  // Filter departments by selected region
  const filteredDepartments = currentFilters.region
    ? departments.filter((d) => d.region_id === currentFilters.region)
    : departments;

  const departmentOptions = [
    { value: "", label: t("filter.allDepartments") },
    ...filteredDepartments.map((d) => ({
      value: d.id,
      label: d.name,
    })),
  ];

  // Filter cities by selected department or region
  const filteredCities = currentFilters.department
    ? cities.filter((c) => c.department_id === currentFilters.department)
    : currentFilters.region
      ? cities.filter((c) => c.region_id === currentFilters.region)
      : cities;

  const cityOptions = [
    { value: "", label: t("filter.allCities") },
    ...filteredCities.map((c) => ({
      value: c.id,
      label: c.name,
    })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Select
          options={professionOptions}
          value={currentFilters.profession ?? ""}
          onChange={(e) => updateFilter("profession", e.target.value)}
        />
        <Select
          options={regionOptions}
          value={currentFilters.region ?? ""}
          onChange={(e) =>
            updateFilter("region", e.target.value, ["department", "city"])
          }
        />
      </div>
      <div className="flex gap-3">
        <Select
          options={departmentOptions}
          value={currentFilters.department ?? ""}
          onChange={(e) =>
            updateFilter("department", e.target.value, ["city"])
          }
        />
        <Select
          options={cityOptions}
          value={currentFilters.city ?? ""}
          onChange={(e) => updateFilter("city", e.target.value)}
        />
      </div>
    </div>
  );
}
