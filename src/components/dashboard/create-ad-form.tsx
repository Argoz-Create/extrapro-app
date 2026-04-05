"use client";

import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { createJob, saveJobDraft } from "@/lib/actions/jobs";
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

type FormValues = {
  profession_id: string;
  city_id: string;
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
};

const DRAFT_KEY = "extrapro-draft-ad";
const DRAFT_ERROR_KEY = "extrapro-draft-error";

const emptyForm: FormValues = {
  profession_id: "",
  city_id: "",
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

  if (!values.profession_id) {
    errors.profession_id = "Veuillez choisir une profession";
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
  formData.set("profession_id", values.profession_id);
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

  const updateField = useCallback((field: keyof FormValues, value: string | boolean) => {
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

  const showNewCity = values.city_id === "__new__";

  const salaryTypes = [
    { value: "hourly", label: t("job.perHour") },
    { value: "daily", label: t("job.perDay") },
    { value: "flat", label: t("job.perJob") },
  ];

  const cityOptionsWithNew = [
    ...cities,
    { value: "__new__", label: `+ ${t("createAd.addNewCity")}` },
  ];

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
        // redirect() throws — this is expected on success
      }
    });
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

        <Select
          label={t("createAd.profession")}
          name="profession_id"
          options={professions}
          placeholder={t("createAd.selectProfession")}
          value={values.profession_id}
          onChange={(e) => updateField("profession_id", e.target.value)}
          error={fieldErrors.profession_id}
        />

        <div>
          <Select
            label={t("createAd.city")}
            name="city_id"
            options={cityOptionsWithNew}
            placeholder={t("createAd.selectCity")}
            value={values.city_id}
            onChange={(e) => updateField("city_id", e.target.value)}
            error={fieldErrors.city_id}
          />
          {showNewCity && (
            <div className="mt-2 space-y-2 pl-3 border-l-2 border-primary/30">
              <Input
                label={t("createAd.newCityName")}
                name="new_city_name"
                placeholder="Ex: Biarritz"
                value={values.new_city_name}
                onChange={(e) => updateField("new_city_name", e.target.value)}
                error={fieldErrors.new_city_name}
              />
              <Input
                label={t("createAd.newCityPostalCode")}
                name="new_city_postal_code"
                placeholder="64200"
                value={values.new_city_postal_code}
                onChange={(e) => updateField("new_city_postal_code", e.target.value)}
              />
            </div>
          )}
        </div>

        <Input
          label={t("createAd.requiredSkill")}
          name="required_skill"
          placeholder={t("createAd.requiredSkillPlaceholder")}
          value={values.required_skill}
          onChange={(e) => updateField("required_skill", e.target.value)}
          error={fieldErrors.required_skill}
        />

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t("createAd.startDate")}
            name="work_date"
            type="date"
            value={values.work_date}
            onChange={(e) => updateField("work_date", e.target.value)}
            error={fieldErrors.work_date}
          />
          <Input
            label={t("createAd.endDate")}
            name="work_end_date"
            type="date"
            value={values.work_end_date}
            onChange={(e) => updateField("work_end_date", e.target.value)}
            error={fieldErrors.work_end_date}
          />
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

      {/* Solidarity message */}
      <div className="bg-green-50 border border-green-200 rounded-[10px] p-3 text-center">
        <p className="text-sm text-green-800">
          {t("solidarity.publishMessage")}
        </p>
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
      </div>
    </form>
  );
}
