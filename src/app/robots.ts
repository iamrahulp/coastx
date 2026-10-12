import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/partner", "/booking/", "/profile", "/trips", "/pass/"] }, sitemap: "/sitemap.xml" };
}