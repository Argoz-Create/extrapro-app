import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter, Manrope } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
import { StickyMobileCTA } from "@/components/home/sticky-mobile-cta";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { AnalyticsScripts } from "@/components/layout/analytics-scripts";
import { getLanguage } from "@/lib/i18n/get-language";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Note: DM Mono is loaded via the Google Fonts link in globals.css
// and referenced via CSS variable in the @theme block

const SITE_URL = "https://www.urjaya.fr";
const SITE_TITLE = "URJAYA — Recruter des extras qualifiés, partout en France";
const SITE_DESCRIPTION =
  "Recrutez des extras qualifiés partout en France en quelques minutes. 100% gratuit, sans engagement — et chaque mise en relation soutient une association caritative française.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — URJAYA",
  },
  description: SITE_DESCRIPTION,
  applicationName: "URJAYA",
  keywords: [
    "recrutement extras",
    "extra restauration",
    "personnel qualifié",
    "recrutement urgent",
    "extras événementiel",
    "recrutement gratuit",
    "URJAYA",
    "France",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "URJAYA",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "URJAYA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "URJAYA",
      url: SITE_URL,
      logo: `${SITE_URL}/urjaya-logo.png`,
      description: SITE_DESCRIPTION,
      areaServed: { "@type": "Country", name: "France" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "URJAYA",
      description: SITE_DESCRIPTION,
      inLanguage: "fr-FR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Service",
      name: "Recrutement d'extras qualifiés",
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "France" },
      serviceType: "Mise en relation employeurs / extras",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getLanguage();
  return (
    <html lang={language}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Manrope:wght@200..800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          {/* StickyMobileCTA + CookieConsent must live INSIDE LanguageProvider —
              they're client components that call useTranslation(). Placing them
              outside the provider broke prerendering on every page that didn't
              short-circuit (caught first on /a-propos during build). */}
          <StickyMobileCTA />
          <CookieConsent />
        </LanguageProvider>
        <AnalyticsScripts />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              // Green to match the production homepage palette. Toaster
              // lives at <body> level (outside the .green-theme scope),
              // so a CSS var wouldn't pick up the override — hardcoded.
              background: "#22C55E",
              color: "white",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
