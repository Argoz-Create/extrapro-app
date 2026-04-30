import type { LucideIcon } from "lucide-react";
import { Zap, Phone, CheckCircle2, Heart, Search, Clock, Banknote } from "lucide-react";
import { getLanguage } from "@/lib/i18n/get-language";

interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
}

export async function HowItWorks() {
  const language = await getLanguage();

  const translations = {
    eyebrow: language === "fr" ? "Le fonctionnement" : "How it works",
    title:
      language === "fr"
        ? "Une mission ouverte. Un appel. C'est tout."
        : "One ad. One call. That's it.",
    employer: {
      tag: language === "fr" ? "Côté employeur" : "For employers",
      title: language === "fr" ? "Recrutez en 5 minutes" : "Hire in 5 minutes",
      steps: [
        {
          icon: Zap,
          title:
            language === "fr" ? "Publiez votre annonce" : "Post your ad",
          body:
            language === "fr"
              ? "30 secondes, depuis le téléphone"
              : "30 seconds, from your phone",
        },
        {
          icon: Phone,
          title: language === "fr" ? "Recevez les appels" : "Get calls",
          body:
            language === "fr"
              ? "Directement, sans intermédiaire"
              : "Direct, no middleman",
        },
        {
          icon: CheckCircle2,
          title:
            language === "fr" ? "Confirmez la mission" : "Confirm the booking",
          body:
            language === "fr"
              ? "Vous décidez qui vient"
              : "You choose who shows up",
        },
        {
          icon: Heart,
          title:
            language === "fr" ? "Une asso est financée" : "A charity gets funded",
          body:
            language === "fr"
              ? "Une part de chaque mission"
              : "A share of every booking",
        },
      ],
    },
    worker: {
      tag: language === "fr" ? "Côté extra" : "For workers",
      title:
        language === "fr"
          ? "Trouvez du travail en 10 secondes"
          : "Find work in 10 seconds",
      steps: [
        {
          icon: Search,
          title: language === "fr" ? "Parcourez les annonces" : "Browse ads",
          body: language === "fr" ? "Sans inscription" : "No sign-up",
        },
        {
          icon: Phone,
          title:
            language === "fr" ? "Appelez l'employeur" : "Call the employer",
          body: language === "fr" ? "D'un seul tap" : "One tap",
        },
        {
          icon: Clock,
          title:
            language === "fr"
              ? "Travaillez le jour même"
              : "Work the same day",
          body: language === "fr" ? "Le plus souvent" : "Usually",
        },
        {
          icon: Banknote,
          title: language === "fr" ? "Payé sur place" : "Paid on site",
          body:
            language === "fr"
              ? "Selon l'accord trouvé"
              : "Per agreement",
        },
      ],
    },
  };

  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-xs font-bold uppercase text-text-tertiary">
            {translations.eyebrow}
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold text-text-primary md:text-4xl">
            {translations.title}
          </h2>
        </div>

        {/* Two-column grid */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Employer column */}
          <div>
            {/* Column header */}
            <div className="mb-8">
              <span className="inline-block rounded-full bg-primary-soft px-3 py-1 font-mono text-xs font-bold uppercase text-primary">
                {translations.employer.tag}
              </span>
              <h3 className="font-display mt-3 text-xl font-bold text-text-primary">
                {translations.employer.title}
              </h3>
            </div>

            {/* Steps */}
            <div className="space-y-0">
              {translations.employer.steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 py-4 ${
                      idx < translations.employer.steps.length - 1
                        ? "border-b border-border-light"
                        : ""
                    }`}
                  >
                    <span className="font-mono text-sm text-text-tertiary" style={{ minWidth: "32px" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div style={{ minWidth: "32px" }} className="flex justify-center">
                      <StepIcon className="h-5 w-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-display text-base font-semibold text-text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-secondary">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Worker column */}
          <div>
            {/* Column header */}
            <div className="mb-8">
              <span className="inline-block rounded-full bg-success-soft px-3 py-1 font-mono text-xs font-bold uppercase text-success-dark">
                {translations.worker.tag}
              </span>
              <h3 className="font-display mt-3 text-xl font-bold text-text-primary">
                {translations.worker.title}
              </h3>
            </div>

            {/* Steps */}
            <div className="space-y-0">
              {translations.worker.steps.map((step, idx) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-4 py-4 ${
                      idx < translations.worker.steps.length - 1
                        ? "border-b border-border-light"
                        : ""
                    }`}
                  >
                    <span className="font-mono text-sm text-text-tertiary" style={{ minWidth: "32px" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div style={{ minWidth: "32px" }} className="flex justify-center">
                      <StepIcon className="h-5 w-5 text-primary" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="font-display text-base font-semibold text-text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm text-text-secondary">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
