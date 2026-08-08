import type { Metadata } from "next";
import { ListingForm } from "../../listings/ListingForm";

export const metadata: Metadata = { title: "New Job" };

export default function NewJobsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New Job</h1>
      <ListingForm fixedCategory="job" />
    </div>
  );
}
