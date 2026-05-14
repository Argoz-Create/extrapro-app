"use client";

import { Lightning, Heart, Sparkle } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

export function OurMission() {
  const { t } = useTranslation();

  return (
    <section className="bg-white border-y border-border-light px-4 py-8">
      <div className="mx-auto max-w-lg">
        <h2 className="text-lg font-bold text-text-primary text-center">
          {t("mission.title")}
        </h2>
        <p className="mt-3 text-sm text-text-secondary text-center leading-relaxed">
          {t("mission.text")}
        </p>

        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-[10px] bg-primary/5 p-3 flex flex-col items-center">
            <Lightning size={20} weight="duotone" className="text-primary-dark" />
            <p className="mt-1 text-xs font-medium text-primary-dark">
              {t("mission.solidarity")}
            </p>
          </div>
          <div className="rounded-[10px] bg-green-50 p-3 flex flex-col items-center">
            <Heart size={20} weight="duotone" className="text-green-700" />
            <p className="mt-1 text-xs font-medium text-green-700">
              {t("mission.free")}
            </p>
          </div>
          <div className="rounded-[10px] bg-amber-50 p-3 flex flex-col items-center">
            <Sparkle size={20} weight="duotone" className="text-amber-700" />
            <p className="mt-1 text-xs font-medium text-amber-700">
              {t("mission.fast")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
