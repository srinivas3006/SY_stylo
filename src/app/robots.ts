import type { MetadataRoute } from "next";
import { salonConfig } from "@/config/salon";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${salonConfig.siteUrl}/sitemap.xml`,
  };
}
