import type { Category } from "@prisma/client";

/**
 * Maps each `Category` enum value (the DB/schema name) to the admin route
 * segment and display label used in the dashboard nav and page headings.
 *
 * The DB enum keeps `admit_card`/`yojana` (matching the existing public
 * site's `Category` union in lib/data.ts, just with hyphens swapped for
 * underscores since Postgres enum members can't contain hyphens) while the
 * admin UI presents the task's requested names — "Admit Cards",
 * "Government Schemes" — as labels only. The public frontend is untouched
 * and keeps using its own "Yojana" wording.
 */
export const adminCategories: { category: Category; route: string; label: string; singular: string }[] = [
  { category: "job", route: "jobs", label: "Jobs", singular: "Job" },
  { category: "result", route: "results", label: "Results", singular: "Result" },
  { category: "admit_card", route: "admit-cards", label: "Admit Cards", singular: "Admit Card" },
  { category: "scholarship", route: "scholarships", label: "Scholarships", singular: "Scholarship" },
  { category: "yojana", route: "schemes", label: "Government Schemes", singular: "Government Scheme" },
];

export function categoryConfigFor(category: Category) {
  return adminCategories.find((c) => c.category === category);
}

export function categoryConfigForRoute(route: string) {
  return adminCategories.find((c) => c.route === route);
}
