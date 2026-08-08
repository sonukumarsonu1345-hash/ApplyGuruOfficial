import type { Category } from "./data";

export interface CategoryPageContent {
  eyebrow: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
}

/**
 * The five category routes (/jobs, /results, /admit-card, /scholarship,
 * /yojana) rendered identical page shells with only this copy differing.
 * Centralising it here lets each route file stay a thin, honest wrapper
 * instead of ~25 lines of copy-pasted JSX and metadata.
 */
export const categoryPageContent: Record<Category, CategoryPageContent> = {
  job: {
    eyebrow: "Latest Jobs",
    title: "Government job notifications, tracked daily",
    description:
      "Central ministries, railways, banks, police and state boards — filter by status to find the vacancy that fits you.",
    metaTitle: "Latest Government Jobs",
    metaDescription:
      "Browse the latest central and state government job notifications with vacancies, eligibility and closing dates.",
  },
  result: {
    eyebrow: "Results",
    title: "Results and merit lists, the moment they're out",
    description:
      "From SSC and Railways to state boards and entrance exams — check declared results and cutoffs in one place.",
    metaTitle: "Exam Results",
    metaDescription: "Latest government exam results, merit lists and category-wise cutoffs.",
  },
  "admit-card": {
    eyebrow: "Admit Card",
    title: "Hall tickets, released and upcoming",
    description: "Track admit card release dates across boards so you're never caught checking the wrong week.",
    metaTitle: "Admit Card",
    metaDescription: "Download the latest government exam admit cards and hall tickets.",
  },
  scholarship: {
    eyebrow: "Scholarship",
    title: "Scholarships for every stage of study",
    description:
      "Merit-based, means-based and community-specific scholarships from central and state governments.",
    metaTitle: "Scholarships",
    metaDescription:
      "Merit and means-based government scholarships for school, college and professional students.",
  },
  yojana: {
    eyebrow: "Yojana",
    title: "Welfare schemes worth knowing about",
    description:
      "Healthcare cover, income support, housing assistance and savings schemes — see what you may be eligible for.",
    metaTitle: "Yojana — Government Schemes",
    metaDescription: "Central government Yojana welfare schemes for families, farmers, women and entrepreneurs.",
  },
};
