import type { Metadata } from "next";
import { ListingForm } from "../ListingForm";

export const metadata: Metadata = { title: "New listing" };

export default function NewListingPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">New listing</h1>
      <ListingForm />
    </div>
  );
}
