import { getLanguage } from "@/lib/i18n/get-language";

export async function PricingStrip() {
  const language = await getLanguage();

  const translations = {
    pill1: language === "fr" ? "Gratuit pour parcourir" : "Free to browse",
    pill2: language === "fr" ? "Sans abonnement" : "No subscription",
    pill3: language === "fr" ? "Sans engagement" : "No commitment",
  };

  const pills = [translations.pill1, translations.pill2, translations.pill3];

  return (
    <section className="border-b border-gray-200 bg-white py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
          {pills.map((pill, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900"
            >
              {/* Checkmark SVG */}
              <svg
                className="h-3.5 w-3.5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{pill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
