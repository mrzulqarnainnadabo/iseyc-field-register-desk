import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/gtg-config";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getPublicSiteUrl(), lastModified: new Date("2026-11-27"), changeFrequency: "weekly", priority: 1 }];
}
