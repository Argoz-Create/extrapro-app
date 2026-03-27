"use client";

import { useTranslation } from "@/lib/i18n/context";

type ListingsHeaderProps = {
  count: number;
};

export function ListingsHeader({ count }: ListingsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 flex items-center justify-between">
      <h2 className="text-base font-semibold text-text-primary">
        {t("landing.availableListings")}
      </h2>
      <span className="text-sm text-text-tertiary">
        {count > 0 ? count : ""}
      </span>
    </div>
  );
}
