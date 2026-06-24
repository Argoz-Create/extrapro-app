import type { Metadata } from "next";
import { TopBar } from "@/components/layout/top-bar";
import { Footer } from "@/components/layout/footer";

// Politique de confidentialité (RGPD). Template — DPO / lawyer review
// REQUIRED before going live. The cookie banner links here; if this page
// 404s, the consent flow is non-compliant with the CNIL recommandations.

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité d'URJAYA : données collectées, finalités, droits des personnes, cookies.",
};

export default function ConfidentialitePage() {
  return (
    <div className="green-theme min-h-screen bg-background">
      <TopBar />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-3xl font-bold text-text-primary">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-sm text-text-tertiary">
          Dernière mise à jour : [DATE À COMPLÉTER]
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-text-primary">
          <section>
            <p>
              URJAYA s&apos;engage à protéger la vie privée de ses utilisateurs et à
              traiter leurs données personnelles dans le respect du Règlement général sur la
              protection des données (RGPD) et de la loi Informatique et Libertés.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">1. Responsable du traitement</h2>
            <p className="mt-2">
              [NOM DE L&apos;ÉDITEUR], [FORME JURIDIQUE], dont le siège social est situé au
              [ADRESSE COMPLÈTE]. Contact :{" "}
              <a href="mailto:contact@extra-pro.com" className="underline hover:text-text-secondary">
                contact@extra-pro.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">2. Données collectées</h2>
            <p className="mt-2">Nous collectons les données suivantes :</p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Données de compte Employeur</strong> : adresse e-mail, mot de passe
                (haché), nom de l&apos;entreprise, type d&apos;établissement, numéro de
                téléphone, nom du contact.
              </li>
              <li>
                <strong>Données d&apos;annonces</strong> : ville, métier(s) recherché(s),
                date(s) de mission, horaires, rémunération proposée, description, coordonnées
                de contact pour l&apos;annonce.
              </li>
              <li>
                <strong>Données de navigation</strong> : adresse IP, type de navigateur, pages
                consultées, durée des sessions (collectées via Google Analytics 4 après consentement).
              </li>
              <li>
                <strong>Données techniques</strong> : journaux d&apos;erreur (via Sentry) sans
                identifiant personnel.
              </li>
            </ul>
            <p className="mt-2">
              Aucune donnée n&apos;est collectée auprès des Extras qui consultent les annonces
              sans s&apos;inscrire, à l&apos;exception des données de navigation strictement
              nécessaires au fonctionnement du site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">3. Finalités du traitement</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Fourniture et amélioration du service de mise en relation.</li>
              <li>Sécurité, prévention de la fraude et lutte contre les abus.</li>
              <li>Mesure d&apos;audience anonymisée et amélioration de l&apos;expérience.</li>
              <li>Communications de service (confirmations, mises à jour).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">4. Base légale</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Exécution du contrat</strong> pour le fonctionnement du service auprès
                des Employeurs inscrits.
              </li>
              <li>
                <strong>Consentement</strong> pour les cookies de mesure d&apos;audience
                (Google Analytics) — révocable à tout moment via le bandeau de gestion des
                cookies.
              </li>
              <li>
                <strong>Intérêt légitime</strong> pour la sécurité, la prévention des fraudes
                et le suivi technique.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">5. Destinataires</h2>
            <p className="mt-2">
              Les données sont accessibles aux personnes habilitées d&apos;URJAYA et aux
              sous-traitants techniques suivants :
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Supabase Inc.</strong> (base de données et authentification, Singapour
                / États-Unis).
              </li>
              <li>
                <strong>Vercel Inc.</strong> (hébergement applicatif, États-Unis — région
                Paris pour les serveurs).
              </li>
              <li>
                <strong>Google Ireland Ltd.</strong> (mesure d&apos;audience via Google
                Analytics 4) — après consentement uniquement.
              </li>
              <li>
                <strong>Functional Software Inc. (Sentry)</strong> (suivi des erreurs
                techniques, États-Unis).
              </li>
            </ul>
            <p className="mt-2">
              Les transferts hors de l&apos;Union européenne sont encadrés par des clauses
              contractuelles types validées par la Commission européenne.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">6. Durée de conservation</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Compte Employeur : 3 ans après la dernière activité.</li>
              <li>Annonces actives : durée de l&apos;annonce + 1 an d&apos;archivage.</li>
              <li>Journaux techniques : 6 mois.</li>
              <li>Données d&apos;audience anonymisées : 14 mois maximum.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold">7. Vos droits</h2>
            <p className="mt-2">
              Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification,
              d&apos;effacement, de portabilité, de limitation et d&apos;opposition au
              traitement de vos données. Vous pouvez retirer votre consentement aux cookies à
              tout moment.
            </p>
            <p className="mt-2">
              Pour exercer ces droits, écrivez à{" "}
              <a href="mailto:contact@extra-pro.com" className="underline hover:text-text-secondary">
                contact@extra-pro.com
              </a>
              . En cas de réponse insatisfaisante, vous pouvez déposer une réclamation auprès
              de la Commission Nationale de l&apos;Informatique et des Libertés (CNIL),{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-text-secondary"
              >
                www.cnil.fr
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">8. Cookies</h2>
            <p className="mt-2">
              URJAYA utilise des cookies strictement nécessaires au fonctionnement du site
              (préférence de langue, session d&apos;authentification, consentement aux cookies).
              Avec votre accord, nous utilisons également Google Analytics 4 pour mesurer
              l&apos;audience. Vous pouvez accepter ou refuser ces cookies via le bandeau qui
              s&apos;affiche lors de votre première visite, et modifier votre choix à tout
              moment en effaçant le cookie <span className="font-mono">urjaya-consent</span>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">9. Sécurité</h2>
            <p className="mt-2">
              Les mots de passe sont stockés sous forme hachée. Les communications avec le
              site sont chiffrées en TLS (HTTPS). L&apos;accès aux données est restreint aux
              personnes habilitées et journalisé.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold">10. Modifications</h2>
            <p className="mt-2">
              Cette politique peut être mise à jour pour refléter des évolutions
              réglementaires ou techniques. La date en haut de la page indique la dernière
              version applicable.
            </p>
          </section>

          <div className="mt-10 rounded-md border border-border bg-surface p-4 text-xs text-text-tertiary">
            <strong className="text-text-secondary">
              Document à valider par un DPO ou un juriste RGPD
            </strong>{" "}
            avant le lancement public. Les durées de conservation et la liste des sous-traitants
            doivent être confirmées par rapport à l&apos;implémentation réelle.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
