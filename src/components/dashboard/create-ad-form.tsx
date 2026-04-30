"use client";

import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { createJob, saveJobDraft } from "@/lib/actions/jobs";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import type { CityResult } from "@/components/ui/city-autocomplete";
import { MultiProfessionPicker } from "@/components/ui/multi-profession-picker";
import { useTranslation } from "@/lib/i18n/context";
import type { Profession } from "@/lib/types/database";

type SelectOption = {
  value: string;
  label: string;
};

type CreateAdFormProps = {
  professions: Profession[];
  cities: SelectOption[];
};

type FormValues = {
  profession_ids: string[];
  custom_profession: string;
  city_id: string;
  city_display_name: string;
  new_city_name: string;
  new_city_postal_code: string;
  required_skill: string;
  work_date: string;
  work_end_date: string;
  start_time: string;
  end_time: string;
  salary: string;
  salary_type: string;
  description: string;
  contact_phones: string[];
  contact_name: string;
  contact_email: string;
  contact_whatsapp: string;
  is_urgent: boolean;
  is_single_day: boolean;
};

const DRAFT_KEY = "extrapro-draft-ad";
const DRAFT_ERROR_KEY = "extrapro-draft-error";

const emptyForm: FormValues = {
  profession_ids: [],
  custom_profession: "",
  city_id: "",
  city_display_name: "",
  new_city_name: "",
  new_city_postal_code: "",
  required_skill: "",
  work_date: "",
  work_end_date: "",
  start_time: "",
  end_time: "",
  salary: "",
  salary_type: "hourly",
  description: "",
  contact_phones: [""],
  contact_name: "",
  contact_email: "",
  contact_whatsapp: "",
  is_urgent: false,
  is_single_day: true,
};

// Read from localStorage synchronously on init so values survive component remounts
function getInitialValues(): FormValues {
  if (typeof window === "undefined") return emptyForm;
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old contact_phone string to contact_phones array
      if (parsed.contact_phone && !parsed.contact_phones) {
        parsed.contact_phones = parsed.contact_phone.split(",").map((p: string) => p.trim()).filter(Boolean);
        if (parsed.contact_phones.length === 0) parsed.contact_phones = [""];
        delete parsed.contact_phone;
      }
      return { ...emptyForm, ...parsed };
    }
  } catch {
    // ignore
  }
  return emptyForm;
}

function getInitialError(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const err = localStorage.getItem(DRAFT_ERROR_KEY);
    if (err) {
      // Clear it after reading so it doesn't persist across reloads
      localStorage.removeItem(DRAFT_ERROR_KEY);
      return err;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveDraftToStorage(values: FormValues) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  } catch {
    // ignore
  }
}

function clearDraftFromStorage() {
  try {
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(DRAFT_ERROR_KEY);
  } catch {
    // ignore
  }
}

function saveErrorToStorage(error: string) {
  try {
    localStorage.setItem(DRAFT_ERROR_KEY, error);
  } catch {
    // ignore
  }
}

const frenchPhoneRegex =
  /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

function validateForm(values: FormValues): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!values.profession_ids || values.profession_ids.length === 0) {
    if (!values.custom_profession) {
      errors.profession_ids = "Veuillez choisir une profession";
    }
  }
  if (!values.city_id) {
    errors.city_id = "Veuillez choisir une ville";
  }
  if (values.city_id === "__new__" && !values.new_city_name.trim()) {
    errors.new_city_name = "Nom de la ville requis";
  }
  if (!values.work_date) {
    errors.work_date = "La date de travail est requise";
  } else {
    const today = new Date().toISOString().split("T")[0];
    if (values.work_date < today) {
      errors.work_date = "La date doit etre aujourd'hui ou dans le futur";
    }
  }
  if (values.work_end_date && values.work_date && values.work_end_date < values.work_date) {
    errors.work_end_date = "La date de fin doit etre apres la date de debut";
  }
  if (!values.start_time) {
    errors.start_time = "L'heure de debut est requise";
  }
  if (!values.end_time) {
    errors.end_time = "L'heure de fin est requise";
  }
  if (values.start_time && values.end_time && values.end_time === values.start_time) {
    errors.end_time = "L'heure de fin ne peut pas etre identique a l'heure de debut";
  }
  if (!values.salary || parseFloat(values.salary) <= 0) {
    errors.salary = "Le salaire doit etre positif";
  }
  const validPhones = values.contact_phones.filter((p) => p.trim() !== "");
  if (validPhones.length === 0) {
    errors.contact_phones = "Le telephone est requis";
  } else {
    for (const phone of validPhones) {
      if (!frenchPhoneRegex.test(phone.trim())) {
        errors.contact_phones = "Numero de telephone francais invalide";
        break;
      }
    }
  }
  if (values.required_skill && values.required_skill.length > 200) {
    errors.required_skill = "Maximum 200 caracteres";
  }
  if (values.description && values.description.length > 500) {
    errors.description = "Maximum 500 caracteres";
  }

  return errors;
}

function buildFormData(values: FormValues): FormData {
  const formData = new FormData();
  // Add all selected profession IDs
  for (const id of values.profession_ids) {
    formData.append("profession_id", id);
  }
  // Add custom profession if present
  if (values.custom_profession) {
    formData.set("custom_profession", values.custom_profession);
  }
  formData.set("city_id", values.city_id);
  if (values.new_city_name) formData.set("new_city_name", values.new_city_name);
  if (values.new_city_postal_code) formData.set("new_city_postal_code", values.new_city_postal_code);
  formData.set("work_date", values.work_date);
  if (values.work_end_date) formData.set("work_end_date", values.work_end_date);
  formData.set("start_time", values.start_time);
  formData.set("end_time", values.end_time);
  formData.set("salary", values.salary);
  formData.set("salary_type", values.salary_type);
  if (values.description) formData.set("description", values.description);
  const phones = values.contact_phones.filter((p) => p.trim() !== "").join(",");
  formData.set("contact_phone", phones);
  if (values.contact_name) formData.set("contact_name", values.contact_name);
  if (values.contact_email) formData.set("contact_email", values.contact_email);
  if (values.contact_whatsapp) formData.set("contact_whatsapp", values.contact_whatsapp);
  if (values.required_skill) formData.set("required_skill", values.required_skill);
  if (values.is_urgent) formData.set("is_urgent", "on");
  return formData;
}

export function CreateAdForm({ professions, cities: initialCities }: CreateAdFormProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isDraftPending, startDraftTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(getInitialError);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [cities] = useState(initialCities);

  // Initialize values from localStorage synchronously to survive remounts
  const [values, setValues] = useState<FormValues>(getInitialValues);

  // Save to localStorage whenever values change
  useEffect(() => {
    const hasAnyValue = Object.entries(values).some(
      ([key, val]) => key !== "salary_type" && key !== "is_urgent" && key !== "contact_phones" && val !== "" && val !== false
    ) || values.contact_phones.some((p) => p.trim() !== "");
    if (hasAnyValue) {
      saveDraftToStorage(values);
    }
  }, [values]);

  const updateField = useCallback((field: keyof FormValues, value: string | boolean | string[]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, []);

  const salaryTypes = [
    { value: "hourly", label: t("job.perHour") },
    { value: "daily", label: t("job.perDay") },
    { value: "flat", label: t("job.perJob") },
  ];

  function handleCitySelect(city: CityResult) {
    setValues((prev) => ({
      ...prev,
      city_id: "__new__",
      city_display_name: city.nom,
      new_city_name: city.nom,
      new_city_postal_code: city.codesPostaux[0] || "",
    }));
    setFieldErrors((prev) => {
      if (prev.city_id) {
        const next = { ...prev };
        delete next.city_id;
        return next;
      }
      return prev;
    });
  }

  function handleExistingCitySelect(cityId: string) {
    const cityLabel = cities.find((c) => c.value === cityId)?.label || "";
    setValues((prev) => ({
      ...prev,
      city_id: cityId,
      city_display_name: cityLabel,
      new_city_name: "",
      new_city_postal_code: "",
    }));
    setFieldErrors((prev) => {
      if (prev.city_id) {
        const next = { ...prev };
        delete next.city_id;
        return next;
      }
      return prev;
    });
  }

  function handleCityClear() {
    setValues((prev) => ({
      ...prev,
      city_id: "",
      city_display_name: "",
      new_city_name: "",
      new_city_postal_code: "",
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setServerError(null);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const el = formRef.current?.querySelector(`[name="${firstErrorField}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setFieldErrors({});
    setServerError(null);

    // Save values to localStorage before server call (in case of remount)
    saveDraftToStorage(values);

    const formData = buildFormData(values);

    startTransition(async () => {
      try {
        const result = await createJob({ error: null }, formData);
        if (result?.error) {
          // Save error to localStorage too so it survives remount
          saveErrorToStorage(result.error);
          setServerError(result.error);
          if (result.fieldErrors) {
            setFieldErrors(result.fieldErrors);
          }
        } else {
          // Success - clear draft
          clearDraftFromStorage();
        }
      } catch {
        // redirect() throws on success — clear the stored draft
        // so the next visit to /new starts fresh.
        clearDraftFromStorage();
      }
    });
  }

  function handleClearForm() {
    if (typeof window !== "undefined" && !window.confirm(t("createAd.clearFormConfirm"))) {
      return;
    }
    clearDraftFromStorage();
    setValues(emptyForm);
    setFieldErrors({});
    setServerError(null);
  }

  function handleSaveDraft() {
    // Save values to localStorage before server call
    saveDraftToStorage(values);

    const formData = buildFormData(values);

    startDraftTransition(async () => {
      try {
        const result = await saveJobDraft({ error: null }, formData);
        if (result?.error) {
          setServerError(result.error);
        } else {
          clearDraftFromStorage();
        }
      } catch {
        // redirect() throws — this is expected on success
        clearDraftFromStorage();
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
      {serverError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-[10px]">
          {serverError}
        </div>
      )}

      {/* ===== PUBLIC SECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border-light">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">{t("createAd.publicSection")}</span>
          <span className="text-xs text-text-tertiary">{t("createAd.publicSectionHint")}</span>
        </div>

        <MultiProfessionPicker
          professions={professions}
          value={values.profession_ids}
          onChange={(ids) => updateField("profession_ids", ids)}
          customProfession={values.custom_profession}
          onCustomChange={(text) => updateField("custom_profession", text)}
          max={5}
          error={fieldErrors.profession_ids}
          label={t("createAd.roles")}
          hint={t("createAd.rolesHint")}
        />

        <CityAutocomplete
          label={t("createAd.city")}
          placeholder={t("createAd.searchCity")}
          value={values.city_display_name}
          onSelect={handleCitySelect}
          onClear={handleCityClear}
          existingCities={cities}
          onSelectExisting={handleExistingCitySelect}
          error={fieldErrors.city_id}
        />

        <Input
          label={t("createAd.requiredSkill")}
          name="required_skill"
          placeholder={t("createAd.requiredSkillPlaceholder")}
          value={values.required_skill}
          onChange={(e) => updateField("required_skill", e.target.value)}
          error={fieldErrors.required_skill}
        />

        {/* Date range — end date is optional (blank = single-day) */}
        <div>
          {/* Single-day toggle */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-primary/5 border border-primary/10 rounded-[10px]">
            <input
              type="checkbox"
              id="is_single_day"
              checked={values.is_single_day}
              onChange={(e) => {
                updateField("is_single_day", e.target.checked);
                if (e.target.checked) {
                  updateField("work_end_date", "");
                }
              }}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="is_single_day" className="flex-1 cursor-pointer">
              <span className="block text-sm font-medium text-text-primary">{t("createAd.singleDay")}</span>
              <span className="block text-xs text-text-tertiary">{t("createAd.singleDayHint")}</span>
            </label>
          </div>

          <div className={values.is_single_day ? "grid grid-cols-1 gap-3" : "grid grid-cols-2 gap-3"}>
            <Input
              label={values.is_single_day ? t("createAd.workDate") : t("createAd.startDate")}
              name="work_date"
              type="date"
              value={values.work_date}
              onChange={(e) => updateField("work_date", e.target.value)}
              error={fieldErrors.work_date}
            />
            {!values.is_single_day && (
              <Input
                label={t("createAd.endDate")}
                name="work_end_date"
                type="date"
                min={values.work_date || undefined}
                value={values.work_end_date}
                onChange={(e) => updateField("work_end_date", e.target.value)}
                error={fieldErrors.work_end_date}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startTime")}
            name="start_time"
            type="time"
            value={values.start_time}
            onChange={(e) => updateField("start_time", e.target.value)}
            error={fieldErrors.start_time}
          />
          <Input
            label={t("createAd.endTime")}
            name="end_time"
            type="time"
            value={values.end_time}
            onChange={(e) => updateField("end_time", e.target.value)}
            error={fieldErrors.end_time}
          />
        </div>

        {/* Until midnight quick-select chips */}
        <div>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => updateField("end_time", "18:00")}
              className="px-3 py-1.5 bg-text-tertiary/10 text-text-primary text-sm font-medium rounded-full hover:bg-text-tertiary/20 transition-colors"
            >
              {t("createAd.endTime.quick6pm")}
            </button>
            <button
              type="button"
              onClick={() => updateField("end_time", "22:00")}
              className="px-3 py-1.5 bg-text-tertiary/10 text-text-primary text-sm font-medium rounded-full hover:bg-text-tertiary/20 transition-colors"
            >
              {t("createAd.endTime.quick10pm")}
            </button>
            <button
              type="button"
              onClick={() => updateField("end_time", "23:59")}
              className="px-3 py-1.5 bg-text-tertiary/10 text-text-primary text-sm font-medium rounded-full hover:bg-text-tertiary/20 transition-colors"
            >
              {t("createAd.endTime.quickMidnight")}
            </button>
          </div>
          <p className="text-xs text-text-tertiary">
            {t("createAd.endTime.midnightHint")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.salary")}
            name="salary"
            type="number"
            placeholder="14"
            min="1"
            step="0.5"
            value={values.salary}
            onChange={(e) => updateField("salary", e.target.value)}
            error={fieldErrors.salary}
          />
          <Select
            label={t("createAd.salaryType")}
            name="salary_type"
            options={salaryTypes}
            value={values.salary_type}
            onChange={(e) => updateField("salary_type", e.target.value)}
          />
        </div>

        <Textarea
          label={t("createAd.description")}
          name="description"
          placeholder={t("createAd.descriptionPlaceholder")}
          rows={3}
          maxLength={500}
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          error={fieldErrors.description}
        />
      </div>

      {/* ===== PRIVATE SECTION ===== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-border-light">
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">{t("createAd.privateSection")}</span>
          <span className="text-xs text-text-tertiary">{t("createAd.privateSectionHint")}</span>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            {t("createAd.contactPhone")}
          </label>
          {values.contact_phones.map((phone, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                name={`contact_phone_${index}`}
                type="tel"
                placeholder="06 XX XX XX XX"
                value={phone}
                onChange={(e) => {
                  const newPhones = [...values.contact_phones];
                  newPhones[index] = e.target.value;
                  setValues((prev) => ({ ...prev, contact_phones: newPhones }));
                  setFieldErrors((prev) => {
                    if (prev.contact_phones) {
                      const next = { ...prev };
                      delete next.contact_phones;
                      return next;
                    }
                    return prev;
                  });
                }}
              />
              {values.contact_phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newPhones = values.contact_phones.filter((_, i) => i !== index);
                    setValues((prev) => ({ ...prev, contact_phones: newPhones }));
                  }}
                  className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap"
                >
                  {t("createAd.removePhone")}
                </button>
              )}
            </div>
          ))}
          {fieldErrors.contact_phones && (
            <p className="text-xs text-red-500">{fieldErrors.contact_phones}</p>
          )}
          <button
            type="button"
            onClick={() => {
              setValues((prev) => ({ ...prev, contact_phones: [...prev.contact_phones, ""] }));
            }}
            className="text-xs text-primary hover:text-primary-dark font-medium"
          >
            + {t("createAd.addPhone")}
          </button>
        </div>

        <Input
          label={t("createAd.contactName")}
          name="contact_name"
          placeholder="Jean Dupont"
          value={values.contact_name}
          onChange={(e) => updateField("contact_name", e.target.value)}
        />

        <Input
          label={t("createAd.contactEmail")}
          name="contact_email"
          type="email"
          placeholder="contact@example.com"
          value={values.contact_email}
          onChange={(e) => updateField("contact_email", e.target.value)}
          error={fieldErrors.contact_email}
        />

        <Input
          label={t("createAd.contactWhatsapp")}
          name="contact_whatsapp"
          type="tel"
          placeholder="+33 6 XX XX XX XX"
          value={values.contact_whatsapp}
          onChange={(e) => updateField("contact_whatsapp", e.target.value)}
        />

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_urgent"
            checked={values.is_urgent}
            onChange={(e) => updateField("is_urgent", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          />
          <span className="text-sm text-text-secondary">
            {t("createAd.urgent")}
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="submit" fullWidth loading={isPending}>
          {t("createAd.publish")}
        </Button>
        <Button
          type="button"
          variant="outline"
          fullWidth
          loading={isDraftPending}
          onClick={handleSaveDraft}
        >
          {t("ad.saveDraft")}
        </Button>
        <button
          type="button"
          onClick={handleClearForm}
          className="mt-1 text-xs text-text-tertiary hover:text-text-primary self-center"
        >
          {t("createAd.clearForm")}
        </button>
      </div>
    </form>
  );
}
