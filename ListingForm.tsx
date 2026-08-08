"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { Listing, Category } from "@prisma/client";
import { saveListing, type ListingFormState } from "@/lib/actions/listings";
import { categories, statuses, categoryLabels, statusLabels } from "@/lib/validation/listing";
import { SpinnerIcon } from "@/components/icons";

const initialState: ListingFormState = {};

function toDateInputValue(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

export function ListingForm({
  listing,
  fixedCategory,
}: {
  listing?: Listing;
  /** Set on the per-category "New" pages (/admin/jobs/new, etc.) so the
   * category is locked instead of shown as a free <select>. */
  fixedCategory?: Category;
}) {
  const [state, formAction, pending] = useActionState(saveListing, initialState);
  const effectiveCategory = listing?.category ?? fixedCategory;

  return (
    <form action={formAction} className="mt-6 max-w-2xl space-y-5">
      {listing ? <input type="hidden" name="id" defaultValue={listing.id} /> : null}

      {state.error ? (
        <p role="alert" className="field-error">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="field-label">
            Title
          </label>
          <input id="title" name="title" defaultValue={listing?.title} required className="field-input" />
          {state.fieldErrors?.title ? <span className="field-error">{state.fieldErrors.title}</span> : null}
        </div>

        <div>
          <label htmlFor="org" className="field-label">
            Organisation
          </label>
          <input id="org" name="org" defaultValue={listing?.org} required className="field-input" />
          {state.fieldErrors?.org ? <span className="field-error">{state.fieldErrors.org}</span> : null}
        </div>

        <div>
          <label htmlFor="slug" className="field-label">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={listing?.slug}
            required
            placeholder="ssc-cgl-2026"
            className="field-input"
          />
          {state.fieldErrors?.slug ? <span className="field-error">{state.fieldErrors.slug}</span> : null}
        </div>

        <div>
          <label htmlFor="category" className="field-label">
            Category
          </label>
          {fixedCategory && !listing ? (
            <>
              <input type="hidden" name="category" value={fixedCategory} />
              <p className="field-input flex items-center bg-ink-50 dark:bg-ink-700/40">
                {categoryLabels[fixedCategory]}
              </p>
            </>
          ) : (
            <select
              id="category"
              name="category"
              defaultValue={effectiveCategory ?? categories[0]}
              required
              className="field-input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          )}
          {state.fieldErrors?.category ? <span className="field-error">{state.fieldErrors.category}</span> : null}
        </div>

        <div>
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={listing?.status ?? statuses[0]}
            required
            className="field-input"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          {state.fieldErrors?.status ? <span className="field-error">{state.fieldErrors.status}</span> : null}
        </div>

        <div>
          <label htmlFor="vacancies" className="field-label">
            Vacancies
          </label>
          <input
            id="vacancies"
            name="vacancies"
            type="number"
            min={0}
            defaultValue={listing?.vacancies ?? ""}
            className="field-input"
          />
          {state.fieldErrors?.vacancies ? <span className="field-error">{state.fieldErrors.vacancies}</span> : null}
        </div>

        <div>
          <label htmlFor="postedOn" className="field-label">
            Posted on
          </label>
          <input
            id="postedOn"
            name="postedOn"
            type="date"
            defaultValue={toDateInputValue(listing?.postedOn)}
            required
            className="field-input"
          />
          {state.fieldErrors?.postedOn ? <span className="field-error">{state.fieldErrors.postedOn}</span> : null}
        </div>

        <div>
          <label htmlFor="closingOn" className="field-label">
            Closing on
          </label>
          <input
            id="closingOn"
            name="closingOn"
            type="date"
            defaultValue={toDateInputValue(listing?.closingOn)}
            className="field-input"
          />
          {state.fieldErrors?.closingOn ? <span className="field-error">{state.fieldErrors.closingOn}</span> : null}
        </div>

        <div>
          <label htmlFor="qualification" className="field-label">
            Qualification
          </label>
          <input
            id="qualification"
            name="qualification"
            defaultValue={listing?.qualification ?? ""}
            className="field-input"
          />
        </div>

        <div>
          <label htmlFor="tags" className="field-label">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={listing?.tags ?? ""}
            placeholder="Central Govt, Graduate Level"
            className="field-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="field-label">
          Summary
        </label>
        <textarea
          id="summary"
          name="summary"
          rows={4}
          defaultValue={listing?.summary}
          required
          className="field-input"
        />
        {state.fieldErrors?.summary ? <span className="field-error">{state.fieldErrors.summary}</span> : null}
      </div>

      <div>
        <label htmlFor="featuredImageUrl" className="field-label">
          Featured image URL
        </label>
        <input
          id="featuredImageUrl"
          name="featuredImageUrl"
          defaultValue={listing?.featuredImageUrl ?? ""}
          placeholder="/uploads/example.jpg"
          className="field-input"
        />
        <p className="mt-1 text-xs text-ink-400 dark:text-ink-300">
          Upload a file in the{" "}
          <Link href="/admin/media" className="text-saffron-600 hover:underline dark:text-saffron-300">
            Media Library
          </Link>{" "}
          and paste its URL here.
        </p>
      </div>

      <fieldset className="rounded-2xl border border-ink-100 p-4 dark:border-ink-600/50">
        <legend className="px-1 text-sm font-semibold text-ink-700 dark:text-ink-100">SEO</legend>
        <p className="mb-4 text-xs text-ink-400 dark:text-ink-300">
          Optional. Falls back to the Title and Summary above when left blank. The Slug field above is also
          the SEO-facing URL slug.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="seoTitle" className="field-label">
              SEO title
            </label>
            <input
              id="seoTitle"
              name="seoTitle"
              defaultValue={listing?.seoTitle ?? ""}
              maxLength={70}
              className="field-input"
            />
            {state.fieldErrors?.seoTitle ? <span className="field-error">{state.fieldErrors.seoTitle}</span> : null}
          </div>
          <div>
            <label htmlFor="seoDescription" className="field-label">
              Meta description
            </label>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={listing?.seoDescription ?? ""}
              maxLength={160}
              className="field-input"
            />
            {state.fieldErrors?.seoDescription ? (
              <span className="field-error">{state.fieldErrors.seoDescription}</span>
            ) : null}
          </div>
        </div>
      </fieldset>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending && <SpinnerIcon width={14} height={14} />}
        {pending ? "Saving…" : listing ? "Save changes" : "Create"}
      </button>
    </form>
  );
}
