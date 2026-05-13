import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /designideas is an internal design preview; /dashboard, /api,
        // /auth and /maintenance carry no public crawl value.
        disallow: ["/dashboard", "/api", "/auth", "/maintenance", "/designideas"],
      },
    ],
    sitemap: "https://www.extra-pro.com/sitemap.xml",
    host: "https://www.extra-pro.com",
  };
}
