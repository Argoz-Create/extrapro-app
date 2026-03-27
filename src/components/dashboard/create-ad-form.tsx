"use client";

import { useState, useActionState } from "react";
import { createJob } from "@/lib/actions/jobs";
import { CHARITY_NAME } from "@/lib/utils/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

type SelectOption = {
  value: string;
  label: string;
};

type CreateAdFormProps = {
  professions: SelectOption[];
  cities: SelectOption[];
};

export function CreateAdForm({ professions, cities }: CreateAdFormProps) {
  const [state, formAction, pending] = useActionState(createJob, {
    error: null,
  });
  const { t } = useTranslation();
  const [showNewCity, setShowNewCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const salaryTypes = [
    { value: "hourly", label: t("job.perHour") },
    { value: "daily", label: t("job.perDay") },
    { value: "flat", label: t("job.perJob") },
  ];

  const cityOptionsWithNew = [
    ...cities,
    { value: "__new__", label: `+ ${t("createAd.addNewCity")}` },
  ];

  function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setSelectedCity(value);
    setShowNewCity(value === "__new__");
  }

  return (
    <form action={formAction} className="space-y-6">
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
          defaultValue=""
        />

        <div>
          <Select
            label={t("createAd.city")}
            name="city_id"
            options={cityOptionsWithNew}
            placeholder={t("createAd.selectCity")}
            required
            defaultValue=""
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
        />

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startDate")}
            name="work_date"
            type="date"
            required
          />
          <Input
            label={t("createAd.endDate")}
            name="work_end_date"
            type="date"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startTime")}
            name="start_time"
            type="time"
            required
          />
          <Input
            label={t("createAd.endTime")}
            name="end_time"
            type="time"
            required
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
          />
          <Select
            label={t("createAd.salaryType")}
            name="salary_type"
            options={salaryTypes}
            defaultValue="hourly"
          />
        </div>

        <Textarea
          label={t("createAd.description")}
          name="description"
          placeholder={t("createAd.descriptionPlaceholder")}
          rows={3}
          maxLength={500}
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
        />

        <Input
          label={t("createAd.contactName")}
          name="contact_name"
          placeholder="Jean Dupont"
        />

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_urgent"
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="text-sm text-text-secondary">
            {t("createAd.urgent")}
          </span>
        </label>
      </div>

      {/* Solidarity message */}
      <div className="bg-green-50 border border-green-200 rounded-[10px] p-3 text-center">
        <p className="text-sm text-green-800">
          {t("solidarity.publishMessage")}
        </p>
      </div>

      <Button type="submit" fullWidth loading={pending}>
        {t("createAd.publish")}
      </Button>
    </form>
  );
}
