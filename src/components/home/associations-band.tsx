import { getLanguage } from "@/lib/i18n/get-language";

const ASSOCIATIONS = [
  "La Croix-Rouge française",
  "Les petits frères des pauvres",
  "Les restos du cœur",
  "L'institut Pasteur pour les enfants",
  "La ligue contre le cancer · enfant",
  "L'arche",
  "L'association pour la sauvegarde de l'enfance en difficulté",
  "Karité pour un sourire",
  "SOS villages d'enfants",
  "La ligue de l'enseignement",
  "Le baiser de l'ange",
];

export async function AssociationsBand() {
  const language = await getLanguage();

  const translations = {
    eyebrow: language === "fr" ? "Notre engagement" : "Our cause",
    title:
      language === "fr"
        ? "Onze associations soutenues — automatiquement, à chaque mission."
        : "Eleven charities — funded automatically, every booking.",
    subhead:
      language === "fr"
        ? "Pas de marketing, pas de campagne. Une part fixe de chaque mission rémunérée part directement à une association partenaire."
        : "No marketing, no campaign. A fixed share of every paid booking goes directly to a partner charity.",
  };

  return (
    <section className="border-b border-gray-200 bg-[#09090B] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section eyebrow */}
        <div className="mb-6">
          <span className="font-mono text-xs font-bold uppercase text-[#FF3B30]">
            {translations.eyebrow}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-[Manrope,Inter,sans-serif] max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
          {translations.title}
        </h2>

        {/* Subhead */}
        <p className="mt-4 max-w-2xl text-gray-400">
          {translations.subhead}
        </p>

        {/* Associations grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-6">
          {ASSOCIATIONS.map((name, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/50 px-4 py-3 transition-colors hover:border-gray-700 hover:bg-gray-900"
            >
              <span className="text-lg text-[#FF3B30]">♥</span>
              <span className="font-medium text-white">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
