import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/gtg-config";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/staff", "/api/"] }], sitemap: getPublicSiteUrl() + "/sitemap.xml" };
}
