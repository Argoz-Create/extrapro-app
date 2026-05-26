import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";

// Conditions Générales d'Utilisation (CGU). Template — lawyer review
// REQUIRED before going live. Placeholders in [BRACKETS] must be
// replaced with the publishing entity's real legal details.

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — URJAYA",
  description:
    "Conditions générales d'utilisation de la plateforme URJAYA de recrutement d'extras pour la restauration et l'hôtellerie.",
};

export default function ConditionsPage() {
  return (
    <div className="green-theme min-h-screen bg-background">
      <TopBar />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Dernière mise à jour : [DATE À COMPLÉTER]
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-primary">
          <section>
            <h2 className="text-lg font-semibold">Article 1 — Présentation du service</h2>
            <p className="mt-2">
              URJAYA est une plateforme de mise en relation entre des établissements de
              restauration et d&apos;hôtellerie (les « Employeurs ») et des travailleurs
              indépendants ou occasionnels (les « Extras ») recherchant des missions de
              courte durée. Le service est accessible à l&apos;adresse{" "}
              <span className="font-mono">www.extra-pro.com</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 2 — Acceptation des conditions</h2>
            <p className="mt-2">
              L&apos;utilisation du service implique l&apos;acceptation pleine et entière
              des présentes Conditions générales. Les Employeurs acceptent expressément ces
              conditions lors de la création de leur compte. Les Extras les acceptent par
              leur navigation sur le site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 3 — Inscription des Employeurs</h2>
            <p className="mt-2">
              L&apos;inscription est ouverte aux personnes morales ou aux entrepreneurs
              individuels exerçant légalement une activité de restauration ou d&apos;hôtellerie.
              L&apos;Employeur s&apos;engage à fournir des informations exactes lors de
              l&apos;inscription et à les maintenir à jour.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 4 — Publication d&apos;annonces</h2>
            <p className="mt-2">
              L&apos;Employeur est seul responsable du contenu et de la légalité des annonces
              qu&apos;il publie. Il s&apos;engage à respecter la réglementation française du
              travail, notamment les dispositions applicables aux contrats de courte durée et
              aux extras de la restauration. URJAYA se réserve le droit de retirer toute
              annonce manifestement illégale ou contraire aux présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 5 — Utilisation par les Extras</h2>
            <p className="mt-2">
              La consultation des annonces et la prise de contact avec un Employeur ne
              nécessitent pas d&apos;inscription. L&apos;Extra entre en relation directe avec
              l&apos;Employeur par téléphone ; toute relation contractuelle entre l&apos;Extra
              et l&apos;Employeur se forme en dehors de la plateforme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 6 — Comportements interdits</h2>
            <p className="mt-2">
              Sont notamment interdits : la publication d&apos;annonces frauduleuses ou
              trompeuses, le harcèlement, la publicité non sollicitée, l&apos;utilisation du
              service à des fins illégales, toute tentative de contournement des mesures de
              sécurité.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 7 — Rôle d&apos;URJAYA</h2>
            <p className="mt-2">
              URJAYA agit exclusivement en qualité de prestataire technique de mise en
              relation. URJAYA n&apos;est ni l&apos;employeur des Extras, ni partie aux
              relations qui peuvent naître entre Employeurs et Extras, et ne saurait être
              tenue responsable de l&apos;exécution ou de l&apos;inexécution de ces relations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 8 — Tarification</h2>
            <p className="mt-2">
              La consultation des annonces et la prise de contact sont gratuites pour les
              Extras. Les conditions tarifaires applicables aux Employeurs sont communiquées
              au moment de l&apos;inscription ou de la publication d&apos;annonces. Toute
              modification fait l&apos;objet d&apos;une information préalable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 9 — Données personnelles</h2>
            <p className="mt-2">
              Le traitement des données personnelles est régi par la{" "}
              <a href="/confidentialite" className="underline hover:text-text-secondary">
                Politique de confidentialité
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 10 — Propriété intellectuelle</h2>
            <p className="mt-2">
              La marque URJAYA, le nom de domaine, la charte graphique, le code source et
              l&apos;ensemble des contenus éditoriaux du site sont la propriété exclusive de
              [NOM DE L&apos;ÉDITEUR] ou de ses partenaires. Toute reproduction est interdite
              sans autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 11 — Suspension et résiliation</h2>
            <p className="mt-2">
              URJAYA se réserve le droit de suspendre ou de résilier l&apos;accès d&apos;un
              Employeur en cas de manquement aux présentes conditions, sans préjudice
              d&apos;éventuels dommages-intérêts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 12 — Modifications</h2>
            <p className="mt-2">
              URJAYA peut modifier les présentes conditions à tout moment. Les utilisateurs
              en sont informés par tout moyen approprié. La poursuite de l&apos;utilisation
              du service après modification vaut acceptation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Article 13 — Droit applicable</h2>
            <p className="mt-2">
              Les présentes conditions sont régies par le droit français. Tout litige est
              soumis à la compétence des tribunaux du ressort de [VILLE — siège social de
              l&apos;éditeur].
            </p>
          </section>

          <div className="mt-10 rounded-md border border-border bg-surface p-4 text-xs text-text-tertiary">
            <strong className="text-text-secondary">Document à valider par un juriste</strong>{" "}
            avant le lancement public. Les sections marquées [PLACEHOLDER] doivent être
            complétées selon la structure juridique de l&apos;éditeur (TZORSM, Dov Avigdir, ou
            entité dédiée Urjaya).
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
