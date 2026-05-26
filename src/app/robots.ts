import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /designideas is an internal design preview; /dashboard, /api
        // and /auth carry no public crawl value.
        disallow: ["/dashboard", "/api", "/auth", "/designideas"],
      },
    ],
    // Stays on extra-pro.com until urjaya.fr DNS + Vercel cutover.
    sitemap: "https://www.extra-pro.com/sitemap.xml",
    host: "https://www.extra-pro.com",
  };
}
