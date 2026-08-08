export type Category = "job" | "result" | "admit-card" | "scholarship" | "yojana";

export interface Post {
  id: string;
  category: Category;
  title: string;
  org: string;
  postedOn: string;
  closingOn?: string;
  vacancies?: number;
  qualification?: string;
  status: "open" | "closing-soon" | "closed" | "released" | "upcoming";
  tags: string[];
  summary: string;
}

export const posts: Post[] = [
  {
    id: "ssc-cgl-2026",
    category: "job",
    title: "SSC Combined Graduate Level (CGL) Recruitment 2026",
    org: "Staff Selection Commission",
    postedOn: "2026-07-24",
    closingOn: "2026-08-20",
    vacancies: 3842,
    qualification: "Bachelor's Degree",
    status: "open",
    tags: ["Central Govt", "Graduate Level"],
    summary: "Tier-I online exam for group B and C posts across central ministries and departments.",
  },
  {
    id: "railway-alp-2026",
    category: "job",
    title: "Railway Assistant Loco Pilot (ALP) Recruitment",
    org: "Railway Recruitment Board",
    postedOn: "2026-07-20",
    closingOn: "2026-08-05",
    vacancies: 1610,
    qualification: "ITI / Diploma",
    status: "closing-soon",
    tags: ["Railway", "Technical"],
    summary: "Direct recruitment for Assistant Loco Pilot posts across all railway zones.",
  },
  {
    id: "ibps-po-2026",
    category: "job",
    title: "IBPS Probationary Officer (PO) CRP XVI",
    org: "Institute of Banking Personnel Selection",
    postedOn: "2026-07-15",
    closingOn: "2026-08-10",
    vacancies: 4135,
    qualification: "Bachelor's Degree",
    status: "open",
    tags: ["Banking", "Officer"],
    summary: "Common recruitment process for probationary officers in participating public sector banks.",
  },
  {
    id: "up-police-constable-2026",
    category: "job",
    title: "UP Police Constable Civil Recruitment",
    org: "Uttar Pradesh Police Recruitment Board",
    postedOn: "2026-07-10",
    closingOn: "2026-07-30",
    vacancies: 26000,
    qualification: "12th Pass",
    status: "closing-soon",
    tags: ["State Govt", "Police"],
    summary: "State-wide recruitment drive for constable posts under UP Police.",
  },
  {
    id: "aiims-nursing-officer-2026",
    category: "job",
    title: "AIIMS Nursing Officer Recruitment",
    org: "All India Institute of Medical Sciences",
    postedOn: "2026-06-28",
    closingOn: "2026-07-18",
    vacancies: 712,
    qualification: "B.Sc Nursing",
    status: "closed",
    tags: ["Medical", "Central Govt"],
    summary: "Recruitment for nursing officer posts across AIIMS campuses nationwide.",
  },
  {
    id: "ssc-cgl-2025-result",
    category: "result",
    title: "SSC CGL 2025 Tier-II Result Declared",
    org: "Staff Selection Commission",
    postedOn: "2026-07-27",
    status: "released",
    tags: ["Central Govt"],
    summary: "Final result and category-wise cutoff marks for CGL 2025 Tier-II examination.",
  },
  {
    id: "rrb-ntpc-2025-result",
    category: "result",
    title: "RRB NTPC CBT-2 Result and Merit List",
    org: "Railway Recruitment Board",
    postedOn: "2026-07-22",
    status: "released",
    tags: ["Railway"],
    summary: "Zone-wise merit list published for the second stage computer based test.",
  },
  {
    id: "bihar-teacher-2025-result",
    category: "result",
    title: "Bihar Teacher Eligibility Test (TET) Result",
    org: "Bihar School Examination Board",
    postedOn: "2026-07-18",
    status: "released",
    tags: ["State Govt", "Teaching"],
    summary: "Subject-wise result and qualifying cutoff for the 2025 teacher eligibility test.",
  },
  {
    id: "neet-ug-2026-result",
    category: "result",
    title: "NEET UG 2026 Result and Rank Card",
    org: "National Testing Agency",
    postedOn: "2026-06-14",
    status: "released",
    tags: ["Medical Entrance"],
    summary: "All India rank card and category-wise scorecards for NEET UG 2026 aspirants.",
  },
  {
    id: "ssc-chsl-2026-admit",
    category: "admit-card",
    title: "SSC CHSL Tier-I Admit Card 2026",
    org: "Staff Selection Commission",
    postedOn: "2026-07-29",
    status: "released",
    tags: ["Central Govt"],
    summary: "Download region-wise e-admit cards for the CHSL Tier-I computer based exam.",
  },
  {
    id: "ibps-clerk-2026-admit",
    category: "admit-card",
    title: "IBPS Clerk Prelims Admit Card",
    org: "Institute of Banking Personnel Selection",
    postedOn: "2026-07-26",
    status: "released",
    tags: ["Banking"],
    summary: "Call letters available for download for the preliminary examination.",
  },
  {
    id: "up-tet-2026-admit",
    category: "admit-card",
    title: "UP TET 2026 Admit Card",
    org: "UP Basic Education Board",
    postedOn: "2026-08-01",
    status: "upcoming",
    tags: ["State Govt", "Teaching"],
    summary: "Admit cards expected to be released one week before the examination date.",
  },
  {
    id: "gate-2027-admit",
    category: "admit-card",
    title: "GATE 2027 Admit Card",
    org: "Indian Institute of Science",
    postedOn: "2026-07-30",
    status: "upcoming",
    tags: ["Engineering Entrance"],
    summary: "Candidates can download hall tickets from the official GATE portal soon.",
  },
  {
    id: "nsp-pre-matric-2026",
    category: "scholarship",
    title: "National Means-cum-Merit Scholarship 2026",
    org: "National Scholarship Portal",
    postedOn: "2026-07-12",
    closingOn: "2026-08-31",
    status: "open",
    tags: ["Merit Based", "Class 9-12"],
    summary: "Financial assistance of up to ₹12,000 per year for meritorious students from economically weaker sections.",
  },
  {
    id: "post-matric-sc-2026",
    category: "scholarship",
    title: "Post Matric Scholarship for SC Students",
    org: "Ministry of Social Justice and Empowerment",
    postedOn: "2026-07-05",
    closingOn: "2026-09-15",
    status: "open",
    tags: ["SC/ST", "Higher Education"],
    summary: "Covers tuition fees and maintenance allowance for SC students pursuing post-matric courses.",
  },
  {
    id: "pragati-girls-2026",
    category: "scholarship",
    title: "AICTE Pragati Scholarship for Girls",
    org: "All India Council for Technical Education",
    postedOn: "2026-06-20",
    closingOn: "2026-08-15",
    status: "closing-soon",
    tags: ["Girls", "Technical Education"],
    summary: "Support of ₹50,000 per year for girl students enrolled in AICTE approved technical courses.",
  },
  {
    id: "minority-merit-2026",
    category: "scholarship",
    title: "Minority Merit-cum-Means Scholarship",
    org: "Ministry of Minority Affairs",
    postedOn: "2026-06-01",
    closingOn: "2026-07-31",
    status: "closing-soon",
    tags: ["Minority", "Professional Courses"],
    summary: "Assistance for minority community students pursuing technical and professional degrees.",
  },
  {
    id: "ayushman-bharat",
    category: "yojana",
    title: "Ayushman Bharat - PMJAY Health Coverage",
    org: "National Health Authority",
    postedOn: "2026-01-10",
    status: "open",
    tags: ["Healthcare", "Family"],
    summary: "Health cover of ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
  },
  {
    id: "pm-kisan",
    category: "yojana",
    title: "PM-KISAN Samman Nidhi",
    org: "Ministry of Agriculture and Farmers Welfare",
    postedOn: "2026-02-24",
    status: "open",
    tags: ["Farmers", "Direct Benefit"],
    summary: "Income support of ₹6,000 per year to eligible farmer families in three equal instalments.",
  },
  {
    id: "pmay-urban",
    category: "yojana",
    title: "Pradhan Mantri Awas Yojana (Urban) 2.0",
    org: "Ministry of Housing and Urban Affairs",
    postedOn: "2026-03-18",
    status: "open",
    tags: ["Housing", "Urban"],
    summary: "Interest subsidy and assistance for pucca house construction for eligible urban households.",
  },
  {
    id: "sukanya-samriddhi",
    category: "yojana",
    title: "Sukanya Samriddhi Yojana",
    org: "Ministry of Finance",
    postedOn: "2026-04-02",
    status: "open",
    tags: ["Girl Child", "Savings"],
    summary: "Small savings scheme offering attractive interest for the education and marriage needs of a girl child.",
  },
  {
    id: "mudra-yojana",
    category: "yojana",
    title: "Pradhan Mantri MUDRA Yojana",
    org: "Ministry of Finance",
    postedOn: "2026-04-20",
    status: "open",
    tags: ["Entrepreneurship", "Loans"],
    summary: "Collateral-free loans up to ₹20 lakh for non-corporate, non-farm small and micro enterprises.",
  },
];

export const categoryMeta: Record<
  Category,
  { label: string; href: string; accent: string; badge: string }
> = {
  job: { label: "Latest Jobs", href: "/jobs", accent: "saffron", badge: "bg-saffron-100 text-saffron-700 dark:bg-saffron-400/15 dark:text-saffron-300" },
  result: { label: "Results", href: "/results", accent: "emerald", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300" },
  "admit-card": { label: "Admit Card", href: "/admit-card", accent: "ink", badge: "bg-ink-100 text-ink-700 dark:bg-ink-500/20 dark:text-ink-100" },
  scholarship: { label: "Scholarship", href: "/scholarship", accent: "plum", badge: "bg-plum-100 text-plum-700 dark:bg-plum-400/15 dark:text-plum-200" },
  yojana: { label: "Yojana", href: "/yojana", accent: "rust", badge: "bg-rust-100 text-rust-700 dark:bg-rust-400/15 dark:text-rust-200" },
};

export function getByCategory(category: Category) {
  return posts.filter((p) => p.category === category);
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export const stats = {
  jobsOpen: posts.filter((p) => p.category === "job" && p.status !== "closed").length,
  resultsOut: posts.filter((p) => p.category === "result").length,
  admitCards: posts.filter((p) => p.category === "admit-card").length,
  scholarships: posts.filter((p) => p.category === "scholarship").length,
};
