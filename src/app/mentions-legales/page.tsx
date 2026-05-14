import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";

// Mentions légales (LCEN art. 6 III). Mandatory for any site published
// from France. The publisher, director, host and contact must all be
// reachable from this page. Template — placeholders must be filled in
// with the publishing entity's real legal details before launch.

export const metadata: Metadata = {
  title: "Mentions légales — EXTRAPRO",
  description: "Mentions légales du site EXTRAPRO conformément à la LCEN.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="green-theme min-h-screen bg-background">
      <TopBar />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">Mentions légales</h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Conformément aux dispositions de l&apos;article 6 III de la loi n° 2004-575 du 21
          juin 2004 pour la confiance dans l&apos;économie numérique.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-primary">
          <section>
            <h2 className="text-lg font-semibold">Éditeur du site</h2>
            <p className="mt-2">
              [NOM DE L&apos;ÉDITEUR]<br />
              [FORME JURIDIQUE] au capital de [MONTANT] €<br />
              SIREN : [NUMÉRO SIREN]<br />
              Numéro de TVA intracommunautaire : [TVA]<br />
              Siège social : [ADRESSE COMPLÈTE]<br />
              Téléphone : [TÉLÉPHONE]<br />
              E-mail :{" "}
              <a href="mailto:contact@extra-pro.com" className="underline hover:text-text-secondary">
                contact@extra-pro.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Directeur de la publication</h2>
            <p className="mt-2">[NOM DU DIRECTEUR DE LA PUBLICATION]</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Hébergeur applicatif</h2>
            <p className="mt-2">
              Vercel Inc.<br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis<br />
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-secondary"
              >
                vercel.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Hébergeur de la base de données</h2>
            <p className="mt-2">
              Supabase Inc.<br />
              970 Toa Payoh North #07-04<br />
              Singapour 318992<br />
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-secondary"
              >
                supabase.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble du contenu du site (textes, graphismes, logos, code source,
              architecture) est la propriété exclusive de l&apos;éditeur ou de ses partenaires.
              Toute reproduction, représentation ou diffusion, totale ou partielle, sans
              autorisation préalable, est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">Signalement de contenu</h2>
            <p className="mt-2">
              Tout contenu manifestement illégal peut être signalé à l&apos;adresse{" "}
              <a href="mailto:abuse@extra-pro.com" className="underline hover:text-text-secondary">
                abuse@extra-pro.com
              </a>
              .
            </p>
          </section>

          <div className="mt-10 rounded-md border border-border bg-surface p-4 text-xs text-text-tertiary">
            <strong className="text-text-secondary">
              Document obligatoire — à compléter impérativement avant le lancement public.
            </strong>{" "}
            La LCEN expose le directeur de la publication à des sanctions en cas
            d&apos;informations incomplètes ou inexactes. Vérifier également l&apos;adresse{" "}
            <span className="font-mono">contact@extra-pro.com</span> et la boîte{" "}
            <span className="font-mono">abuse@extra-pro.com</span> avant publication.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
