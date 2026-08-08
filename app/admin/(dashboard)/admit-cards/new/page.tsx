import type { Metadata } from "next";
import { ListingForm } from "../../listings/ListingForm";

export const metadata: Metadata = { title: "New Admit Card" };

export default function NewAdmitCardsPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New Admit Card</h1>
      <ListingForm fixedCategory="admit_card" />
    </div>
  );
}
