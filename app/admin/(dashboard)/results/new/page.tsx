import type { Metadata } from "next";
import { ListingForm } from "../../listings/ListingForm";

export const metadata: Metadata = { title: "New Result" };

export default function NewResultsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New Result</h1>
      <ListingForm fixedCategory="result" />
    </div>
  );
}
