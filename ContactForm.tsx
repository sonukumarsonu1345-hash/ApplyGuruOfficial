"use client";

import { useId, useState, type FormEvent } from "react";
import { SpinnerIcon } from "@/components/icons";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  subject: "General enquiry",
  message: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.message.trim()) errors.message = "Please add a short message.";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted" | "error">("idle");
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setStatus("submitting");
    try {
      // No backend is wired up yet — this simulates the request so the
      // loading and error states are real and testable once an API route
      // is added later, instead of flipping straight to "submitted".
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          Math.random() < 0.05 ? reject(new Error("network")) : resolve();
        }, 700);
      });
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <div className="card-surface flex flex-col items-start gap-3 p-8" role="status">
        <span className="tag bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          Message sent
        </span>
        <h3 className="font-display text-xl font-semibold text-ink-800 dark:text-paper">
          Thanks &mdash; we&apos;ve got it.
        </h3>
        <p className="text-sm text-ink-500 dark:text-ink-300">
          Our team will reply to your email within 24&ndash;48 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(initialState);
            setErrors({});
            setStatus("idle");
          }}
          className="btn-secondary mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card-surface space-y-5 p-8">
      {status === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-rust-200 bg-rust-50 px-4 py-3 text-sm text-rust-600 dark:border-rust-500/40 dark:bg-rust-500/10 dark:text-rust-200"
        >
          Something went wrong sending your message. Please try again.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label htmlFor={nameId} className="block text-sm">
          <span className="field-label">Full name</span>
          <input
            id={nameId}
            required
            type="text"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            disabled={status === "submitting"}
            className="field-input"
          />
          {errors.name && (
            <span id={`${nameId}-error`} className="field-error">
              {errors.name}
            </span>
          )}
        </label>
        <label htmlFor={emailId} className="block text-sm">
          <span className="field-label">Email</span>
          <input
            id={emailId}
            required
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            disabled={status === "submitting"}
            className="field-input"
          />
          {errors.email && (
            <span id={`${emailId}-error`} className="field-error">
              {errors.email}
            </span>
          )}
        </label>
      </div>

      <label htmlFor={subjectId} className="block text-sm">
        <span className="field-label">Subject</span>
        <select
          id={subjectId}
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          disabled={status === "submitting"}
          className="field-input"
        >
          <option>General enquiry</option>
          <option>Report an incorrect listing</option>
          <option>Partnership</option>
          <option>Feedback</option>
        </select>
      </label>

      <label htmlFor={messageId} className="block text-sm">
        <span className="field-label">Message</span>
        <textarea
          id={messageId}
          required
          rows={5}
          placeholder="Tell us what's on your mind..."
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          disabled={status === "submitting"}
          className="field-input resize-none"
        />
        {errors.message && (
          <span id={`${messageId}-error`} className="field-error">
            {errors.message}
          </span>
        )}
      </label>

      <button type="submit" className="btn-primary w-full sm:w-fit" disabled={status === "submitting"}>
        {status === "submitting" && <SpinnerIcon width={14} height={14} />}
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
