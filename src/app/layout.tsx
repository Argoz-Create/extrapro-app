import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter, Manrope } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/context";
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

export const metadata: Metadata = {
  title: "EXTRAPRO — Recrutement en restauration",
  description:
    "Trouvez des extras en restauration et hotellerie. Publiez et consultez des annonces gratuitement.",
  openGraph: {
    title: "EXTRAPRO — Recrutement en restauration",
    description:
      "Trouvez des extras en restauration et hotellerie. Publiez et consultez des annonces gratuitement.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Manrope:wght@200..800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#FF3B30",
              color: "white",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
