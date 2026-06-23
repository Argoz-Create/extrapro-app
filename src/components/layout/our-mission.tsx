"use client";

import { Buildings, UserCircle, Check, HeartStraight } from "@phosphor-icons/react";
import { useTranslation } from "@/lib/i18n/context";

const ASSOCIATIONS = [
  "La Croix-Rouge française",
  "Les petits frères des pauvres",
  "Les Restos du Cœur",
  "L'Institut Pasteur pour les enfants",
  "La Ligue contre le cancer · enfant",
  "L'Arche",
  "Sauvegarde de l'enfance en difficulté",
  "Karité pour un sourire",
  "SOS Villages d'Enfants",
  "La Ligue de l'enseignement",
  "Le Baiser de l'Ange",
];

function AudienceCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border-light bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
          {icon}
        </span>
        <h3 className="text-base font-bold text-text-primary">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
            <Check
              size={18}
              weight="bold"
              className="mt-0.5 flex-shrink-0 text-primary"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OurMission() {
  const { t } = useTranslation();

  return (
    <section className="border-y border-border-light bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Two audiences */}
        <h2 className="text-center text-xl font-bold text-text-primary">
          {t("audience.title")}
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <AudienceCard
            icon={<Buildings size={22} weight="duotone" />}
            title={t("audience.estabTitle")}
            items={[
              t("audience.estab1"),
              t("audience.estab2"),
              t("audience.estab3"),
            ]}
          />
          <AudienceCard
            icon={<UserCircle size={22} weight="duotone" />}
            title={t("audience.extraTitle")}
            items={[
              t("audience.extra1"),
              t("audience.extra2"),
              t("audience.extra3"),
            ]}
          />
        </div>

        <p className="mt-5 text-center text-sm font-semibold tracking-wide text-primary-dark">
          {t("audience.tagline")}
        </p>

        {/* Solidarity */}
        <div className="mt-8 rounded-2xl bg-primary/5 p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary-dark">
            <HeartStraight size={26} weight="duotone" />
          </span>
          <h3 className="mt-3 text-lg font-bold text-text-primary">
            {t("mission.title")}
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
            {t("mission.text")}
          </p>

          {/* Partner charities */}
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-text-tertiary">
            {t("mission.partnersLabel")}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {ASSOCIATIONS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-light bg-white px-3 py-1.5 text-xs font-medium text-text-secondary"
              >
                <HeartStraight
                  size={12}
                  weight="fill"
                  className="flex-shrink-0 text-primary"
                />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
