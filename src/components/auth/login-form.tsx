"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";
import Link from "next/link";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, {
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
        label={t("auth.email")}
        name="email"
        type="email"
        placeholder="vous@exemple.com"
        required
      />

      <Input
        label={t("auth.password")}
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />

      <Button type="submit" fullWidth loading={pending}>
        {t("auth.signIn")}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          className="text-sm text-primary hover:underline"
        >
          {t("auth.forgotPassword")}
        </button>
        <p className="text-sm text-text-secondary">
          {t("auth.noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            {t("auth.createAccount")}
          </Link>
        </p>
      </div>
    </form>
  );
}
