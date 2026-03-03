import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/i18n/context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EXTRAPRO — Recrutement solidaire en restauration",
  description:
    "Trouvez des extras en restauration. Chaque recrutement soutient Les Restos du Coeur.",
  openGraph: {
    title: "EXTRAPRO — Recrutement solidaire en restauration",
    description:
      "Trouvez des extras en restauration. Chaque recrutement soutient Les Restos du Coeur.",
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
      <body className={`${inter.className} antialiased`}>
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
