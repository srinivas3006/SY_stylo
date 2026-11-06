import type { MetadataRoute } from "next";
import { salonConfig } from "@/config/salon";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: salonConfig.siteUrl, changeFrequency: "monthly", priority: 1 }];
}
