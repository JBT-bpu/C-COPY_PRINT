import type { MetadataRoute } from "next";
import { getLocalSlugs } from "@/lib/blog-data";
import { CATEGORIES } from "@/content/services";

const SITE_URL = "https://www.ccopy.co.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogRoutes = getLocalSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const serviceRoutes = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/services/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...serviceRoutes,
    ...blogRoutes,
  ];
}
