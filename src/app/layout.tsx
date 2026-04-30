import type { Metadata } from "next";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
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
