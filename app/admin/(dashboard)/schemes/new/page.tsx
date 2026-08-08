import type { Metadata } from "next";
import { ListingForm } from "../../listings/ListingForm";

export const metadata: Metadata = { title: "New Government Scheme" };

export default function NewGovernmentSchemesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New Government Scheme</h1>
      <ListingForm fixedCategory="yojana" />
    </div>
  );
}
