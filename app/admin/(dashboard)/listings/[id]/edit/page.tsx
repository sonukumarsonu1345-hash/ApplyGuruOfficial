import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingForm } from "../../ListingForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit listing" };

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-800 dark:text-paper">Edit listing</h1>
      <ListingForm listing={listing} />
    </div>
  );
}
