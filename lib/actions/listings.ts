"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/authz";
import { listingSchema } from "@/lib/validation/listing";
import { categoryConfigFor } from "@/lib/admin-categories";
import type { Category } from "@prisma/client";

export type ListingFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function readListingFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? ""),
    category: String(formData.get("category") ?? ""),
    title: String(formData.get("title") ?? ""),
    org: String(formData.get("org") ?? ""),
    postedOn: String(formData.get("postedOn") ?? ""),
    closingOn: String(formData.get("closingOn") ?? ""),
    vacancies: String(formData.get("vacancies") ?? ""),
    qualification: String(formData.get("qualification") ?? ""),
    status: String(formData.get("status") ?? ""),
    tags: String(formData.get("tags") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    featuredImageUrl: String(formData.get("featuredImageUrl") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  };
}

function fieldErrorsFrom(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

/**
 * Creates or updates a Listing depending on whether the form's hidden
 * "id" field is present. Shared by both the "new" and "edit" admin routes
 * (across all five category sections, via the same <ListingForm>), so
 * slug-uniqueness and validation logic only exist in one place.
 *
 * Both ADMIN and EDITOR can call this — content creation/editing is a
 * shared staff privilege; only deletion is admin-only (see deleteListing).
 */
export async function saveListing(_prevState: ListingFormState, formData: FormData): Promise<ListingFormState> {
  const session = await requireStaff();

  const id = String(formData.get("id") ?? "").trim();
  const raw = readListingFields(formData);
  const parsed = listingSchema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }

  const data = parsed.data;

  const slugOwner = await prisma.listing.findUnique({ where: { slug: data.slug } });
  if (slugOwner && slugOwner.id !== id) {
    return { fieldErrors: { slug: "A listing with this slug already exists" } };
  }

  const postedOn = new Date(data.postedOn);
  if (Number.isNaN(postedOn.getTime())) {
    return { fieldErrors: { postedOn: "Enter a valid date" } };
  }

  const closingOn = data.closingOn ? new Date(data.closingOn) : null;
  if (closingOn && Number.isNaN(closingOn.getTime())) {
    return { fieldErrors: { closingOn: "Enter a valid date" } };
  }

  const vacancies = data.vacancies ? Number(data.vacancies) : null;
  if (vacancies !== null && (!Number.isFinite(vacancies) || vacancies < 0)) {
    return { fieldErrors: { vacancies: "Enter a non-negative number" } };
  }

  const payload = {
    slug: data.slug,
    category: data.category,
    title: data.title,
    org: data.org,
    postedOn,
    closingOn,
    vacancies,
    qualification: data.qualification || null,
    status: data.status,
    tags: data.tags ?? "",
    summary: data.summary,
    featuredImageUrl: data.featuredImageUrl || null,
    // Blank SEO fields are stored as null so the public-facing renderer
    // (when the frontend is later wired to this table) can fall back to
    // title/summary — see the model comment in schema.prisma.
    seoTitle: data.seoTitle || null,
    seoDescription: data.seoDescription || null,
  };

  if (id) {
    await prisma.listing.update({ where: { id }, data: payload });
  } else {
    await prisma.listing.create({ data: { ...payload, createdById: session.user.id } });
  }

  const routeSegment = categoryConfigFor(data.category as Category)?.route ?? "listings";
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/${routeSegment}`);
  redirect(`/admin/${routeSegment}`);
}

/** Admin-only: Editors can create/edit content but cannot delete it. */
export async function deleteListing(id: string) {
  await requireAdmin();
  const listing = await prisma.listing.delete({ where: { id } });
  const routeSegment = categoryConfigFor(listing.category)?.route ?? "listings";
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/${routeSegment}`);
}
