import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://kolabostudios.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/galleries`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/galleries/weddings`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/galleries/engagement`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/galleries/maternity`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/galleries/minis`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/galleries/holiday-minis`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE}/retouch-services`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/retouch-services/portfolio`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/retouch-services/checkout`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  // If you have dynamic routes (e.g., retouch-services/[service]), add them here:
  const services = ["basic-retouch", "standard-retouch", "premium-retouch", "custom-retouch"];
  services.forEach((slug) => {
    routes.push({ url: `${SITE}/retouch-services/${slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  });

  return routes;
}
