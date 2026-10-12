import type { MetadataRoute } from "next";
import { experiences } from "@/data/experiences";
import { getSiteUrl } from "@/lib/site-url.mjs";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl().origin;
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/explore`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/map`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/plan`, changeFrequency: "weekly", priority: 0.7 },
    ...experiences.map((experience) => ({ url: `${base}/experiences/${experience.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}