"use client";

import { useActionState } from "react";
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

  const salaryTypes = [
    { value: "hourly", label: t("job.perHour") },
    { value: "daily", label: t("job.perDay") },
  ];

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-[10px]">
          {state.error}
        </div>
      )}

      <Select
        label={t("createAd.profession")}
        name="profession_id"
        options={professions}
        placeholder={t("createAd.selectProfession")}
        required
        defaultValue=""
      />

      <Input
        label={t("createAd.workDate")}
        name="work_date"
        type="date"
        required
      />

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

      <Select
        label={t("createAd.city")}
        name="city_id"
        options={cities}
        placeholder={t("createAd.selectCity")}
        required
        defaultValue=""
      />

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

      <Input
        label={t("createAd.requiredSkill")}
        name="required_skill"
        placeholder={t("createAd.requiredSkillPlaceholder")}
      />

      <Textarea
        label={t("createAd.description")}
        name="description"
        placeholder={t("createAd.descriptionPlaceholder")}
        rows={3}
        maxLength={500}
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
