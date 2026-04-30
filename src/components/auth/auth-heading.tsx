"use client";

import { useTranslation } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

type AuthHeadingProps = {
  translationKey: TranslationKey;
};

export function AuthHeading({ translationKey }: AuthHeadingProps) {
  const { t } = useTranslation();

  return (
    <h1 className="text-2xl font-display font-bold text-text-primary text-center mb-6">
      {t(translationKey)}
    </h1>
  );
}
