"use client";

import { useActionState, useRef } from "react";
import { uploadMedia, type MediaFormState } from "@/lib/actions/media";
import { SpinnerIcon } from "@/components/icons";

const initialState: MediaFormState = {};

export function MediaUploadForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="card-surface flex flex-wrap items-end gap-4 p-5"
    >
      <div className="min-w-[220px] flex-1">
        <label htmlFor="file" className="field-label">
          File (image or PDF, 8MB max)
        </label>
        <input id="file" name="file" type="file" accept="image/*,application/pdf" required className="field-input" />
      </div>
      <div className="min-w-[220px] flex-1">
        <label htmlFor="altText" className="field-label">
          Alt text (optional)
        </label>
        <input id="altText" name="altText" className="field-input" placeholder="Describes the image" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending && <SpinnerIcon width={14} height={14} />}
        {pending ? "Uploading…" : "Upload"}
      </button>
      {state.error ? (
        <p role="alert" className="field-error w-full">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
