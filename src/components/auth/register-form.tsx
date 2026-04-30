"use client";

import { useActionState } from "react";
import { signUp } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { COMPANY_TYPES } from "@/lib/utils/constants";
import { useTranslation } from "@/lib/i18n/context";
import Link from "next/link";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, {
    error: null,
  });
  const { t } = useTranslation();

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">
          {state.error}
        </div>
      )}

      <Input
        label={t("auth.companyName")}
        name="company_name"
        placeholder="Restaurant Le Marais"
        required
      />

      <Select
        label={t("auth.companyType")}
        name="company_type"
        options={[...COMPANY_TYPES]}
        placeholder={t("auth.companyType")}
        required
        defaultValue=""
      />

      <Input
        label={t("auth.contactName")}
        name="contact_name"
        placeholder="Jean Dupont"
        required
      />

      <Input
        label={t("auth.email")}
        name="email"
        type="email"
        placeholder="vous@exemple.com"
        required
      />

      <Input
        label={t("auth.phone")}
        name="phone"
        type="tel"
        placeholder="06 XX XX XX XX"
        required
      />

      <Input
        label={t("auth.password")}
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="accept_terms"
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
          required
        />
        <span className="text-sm text-text-secondary">
          {t("auth.acceptTerms")}{" "}
          <Link href="/terms" className="text-primary hover:underline">
            {t("auth.termsOfService")}
          </Link>{" "}
          {t("auth.and")}{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            {t("auth.privacyPolicy")}
          </Link>
        </span>
      </label>

      <Button type="submit" fullWidth loading={pending}>
        {t("auth.signUp")}
      </Button>

      <p className="text-center text-sm text-text-secondary">
        {t("auth.hasAccount")}{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          {t("auth.signIn")}
        </Link>
      </p>
    </form>
  );
}
