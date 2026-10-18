import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || "https://biesfbd.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/register/thank-you"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
