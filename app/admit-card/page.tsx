import type { Metadata } from "next";
import { CategoryPage } from "@/components/CategoryPage";
import { categoryPageContent } from "@/lib/category-pages";

const content = categoryPageContent["admit-card"];

export const metadata: Metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/admit-card" },
};

export default function AdmitCardPage() {
  return <CategoryPage category="admit-card" />;
}
