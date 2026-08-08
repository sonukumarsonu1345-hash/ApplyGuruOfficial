import type { Metadata } from "next";
import { ListingForm } from "../../listings/ListingForm";

export const metadata: Metadata = { title: "New Scholarship" };

export default function NewScholarshipsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New Scholarship</h1>
      <ListingForm fixedCategory="scholarship" />
    </div>
  );
}
