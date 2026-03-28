"use client";

import { useState, useActionState } from "react";
import { updateJob } from "@/lib/actions/jobs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

type SelectOption = {
  value: string;
  label: string;
};

type JobData = {
  id: string;
  profession_id: string;
  city_id: string;
  work_date: string;
  work_end_date: string | null;
  start_time: string;
  end_time: string;
  hourly_rate: number | null;
  daily_rate: number | null;
  flat_rate: number | null;
  contact_phone: string;
  contact_name: string | null;
  required_skill: string | null;
  description: string | null;
  is_urgent: boolean;
};

type EditAdFormProps = {
  professions: SelectOption[];
  cities: SelectOption[];
  job: JobData;
};

function getSalaryType(job: JobData): string {
  if (job.daily_rate) return "daily";
  if (job.flat_rate) return "flat";
  return "hourly";
}

function getSalaryValue(job: JobData): number {
  return job.hourly_rate ?? job.daily_rate ?? job.flat_rate ?? 0;
}

export function EditAdForm({ professions, cities: initialCities, job }: EditAdFormProps) {
  const [state, formAction, pending] = useActionState(updateJob, {
    error: null,
  });
  const { t } = useTranslation();
  const [showNewCity, setShowNewCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState(job.city_id);

  const salaryTypes = [
    { value: "hourly", label: t("job.perHour") },
    { value: "daily", label: t("job.perDay") },
    { value: "flat", label: t("job.perJob") },
  ];

  const cityOptionsWithNew = [
    ...initialCities,
    { value: "__new__", label: `+ ${t("createAd.addNewCity")}` },
  ];

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelectedCity(value);
    setShowNewCity(value === "__new__");
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="job_id" value={job.id} />

      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-[10px]">
          {state.error}
        </div>
      )}

      {/* ===== PUBLIC SECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border-light">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("createAd.publicSection")}</span>
          <span className="text-xs text-text-tertiary">{t("createAd.publicSectionHint")}</span>
        </div>

        <Select
          label={t("createAd.profession")}
          name="profession_id"
          options={professions}
          placeholder={t("createAd.selectProfession")}
          required
          defaultValue={job.profession_id}
        />

        <div>
          <Select
            label={t("createAd.city")}
            name="city_id"
            options={cityOptionsWithNew}
            placeholder={t("createAd.selectCity")}
            required
            value={selectedCity}
            onChange={handleCityChange}
          />
          {showNewCity && (
            <div className="mt-2 space-y-2 pl-3 border-l-2 border-primary/30">
              <Input
                label={t("createAd.newCityName")}
                name="new_city_name"
                placeholder="Ex: Biarritz"
                required
              />
              <Input
                label={t("createAd.newCityPostalCode")}
                name="new_city_postal_code"
                placeholder="64200"
              />
            </div>
          )}
        </div>

        <Input
          label={t("createAd.requiredSkill")}
          name="required_skill"
          placeholder={t("createAd.requiredSkillPlaceholder")}
          defaultValue={job.required_skill ?? ""}
        />

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startDate")}
            name="work_date"
            type="date"
            required
            defaultValue={job.work_date}
          />
          <Input
            label={t("createAd.endDate")}
            name="work_end_date"
            type="date"
            defaultValue={job.work_end_date ?? ""}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startTime")}
            name="start_time"
            type="time"
            required
            defaultValue={job.start_time}
          />
          <Input
            label={t("createAd.endTime")}
            name="end_time"
            type="time"
            required
            defaultValue={job.end_time}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.salary")}
            name="salary"
            type="number"
            placeholder="14"
            min="1"
            step="0.5"
            required
            defaultValue={String(getSalaryValue(job))}
          />
          <Select
            label={t("createAd.salaryType")}
            name="salary_type"
            options={salaryTypes}
            defaultValue={getSalaryType(job)}
          />
        </div>

        <Textarea
          label={t("createAd.description")}
          name="description"
          placeholder={t("createAd.descriptionPlaceholder")}
          rows={3}
          maxLength={500}
          defaultValue={job.description ?? ""}
        />
      </div>

      {/* ===== PRIVATE SECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border-light">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">{t("createAd.privateSection")}</span>
          <span className="text-xs text-text-tertiary">{t("createAd.privateSectionHint")}</span>
        </div>

        <Input
          label={t("createAd.contactPhone")}
          name="contact_phone"
          type="tel"
          placeholder="06 XX XX XX XX"
          required
          defaultValue={job.contact_phone}
        />

        <Input
          label={t("createAd.contactName")}
          name="contact_name"
          placeholder="Jean Dupont"
          defaultValue={job.contact_name ?? ""}
        />

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_urgent"
            defaultChecked={job.is_urgent}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="text-sm text-text-secondary">
            {t("createAd.urgent")}
          </span>
        </label>
      </div>

      <Button type="submit" fullWidth loading={pending}>
        {t("ad.edit")}
      </Button>
    </form>
  );
}
