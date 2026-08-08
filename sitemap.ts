import type { MetadataRoute } from "next";

const routes = ["", "/jobs", "/results", "/admit-card", "/scholarship", "/yojana", "/tools", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://applyguruofficial.com";
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}
