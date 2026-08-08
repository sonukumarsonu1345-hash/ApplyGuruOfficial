import { z } from "zod";
import type { Category, ListingStatus } from "@prisma/client";

// Single source of truth for the allowed values, reused by both the
// <select> options in ListingForm and the zod schema below. These mirror
// the `Category` / `ListingStatus` enums in prisma/schema.prisma.
export const categories: Category[] = ["job", "result", "admit_card", "scholarship", "yojana"];
export const statuses: ListingStatus[] = ["open", "closing_soon", "closed", "released", "upcoming"];

export const categoryLabels: Record<Category, string> = {
  job: "Job",
  result: "Result",
  admit_card: "Admit Card",
  scholarship: "Scholarship",
  yojana: "Government Scheme",
};

export const statusLabels: Record<ListingStatus, string> = {
  open: "Open",
  closing_soon: "Closing soon",
  closed: "Closed",
  released: "Released",
  upcoming: "Upcoming",
};

// Form fields arrive as strings (FormData has no concept of numbers/dates),
// so this schema validates the raw string shape. Conversion to
// Date/number happens in lib/actions/listings.ts after a successful parse.
export const listingSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  category: z.enum(categories as [Category, ...Category[]]),
  title: z.string().trim().min(3, "Title is required"),
  org: z.string().trim().min(2, "Organisation is required"),
  postedOn: z.string().trim().min(1, "Posted date is required"),
  closingOn: z.string().trim().optional(),
  vacancies: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  status: z.enum(statuses as [ListingStatus, ...ListingStatus[]]),
  tags: z.string().trim().optional(),
  summary: z.string().trim().min(10, "Summary should be at least 10 characters"),
  featuredImageUrl: z.string().trim().optional(),
  // SEO fields — both optional; the app falls back to title/summary when
  // left blank (see lib/actions/listings.ts).
  seoTitle: z.string().trim().max(70, "Keep the SEO title under 70 characters").optional(),
  seoDescription: z.string().trim().max(160, "Keep the meta description under 160 characters").optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
