"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";

export function SolidarityBanner() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark py-2 px-4">
      <p className="text-white text-sm text-center">
        {t("solidarity.banner")}
      </p>
    </div>
  );
}
