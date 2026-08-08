"use client";

import { useEffect, useId, useMemo, useState } from "react";

/** Today's date as YYYY-MM-DD, for use as a date input default. */
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function AgeCalculator() {
  const [dob, setDob] = useState("");
  // Start empty and fill in on mount (client-only) instead of calling
  // `new Date()` in the initial state — doing it in useState ran during
  // SSR too, so the pre-rendered date could differ from the client's by
  // the time hydration ran (e.g. right around midnight), causing a
  // hydration mismatch.
  const [asOn, setAsOn] = useState("");
  const dobId = useId();
  const asOnId = useId();

  useEffect(() => {
    setAsOn(todayIso());
  }, []);

  const result = useMemo(() => {
    if (!dob || !asOn) return null;
    const birth = new Date(dob);
    const ref = new Date(asOn);
    if (isNaN(birth.getTime()) || isNaN(ref.getTime()) || birth > ref) return null;

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
      days += prevMonth;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }, [dob, asOn]);

  return (
    <div className="card-surface p-6">
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">Age Calculator</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        Check your exact age as on any exam&apos;s cutoff date.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label htmlFor={dobId} className="block text-sm">
          <span className="field-label">Date of birth</span>
          <input
            id={dobId}
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="field-input"
          />
        </label>
        <label htmlFor={asOnId} className="block text-sm">
          <span className="field-label">Age as on</span>
          <input
            id={asOnId}
            type="date"
            value={asOn}
            onChange={(e) => setAsOn(e.target.value)}
            className="field-input"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-paper p-4 dark:bg-ink-900" role="status" aria-live="polite">
        {result ? (
          <p className="font-mono text-sm text-ink-700 dark:text-paper">
            <strong className="text-lg text-saffron-600 dark:text-saffron-300">{result.years}</strong> years,{" "}
            <strong className="text-lg text-saffron-600 dark:text-saffron-300">{result.months}</strong> months,{" "}
            <strong className="text-lg text-saffron-600 dark:text-saffron-300">{result.days}</strong> days
          </p>
        ) : (
          <p className="text-sm text-ink-400">Enter a valid date of birth to see the result.</p>
        )}
      </div>
    </div>
  );
}

function PercentageCalculator() {
  const [obtained, setObtained] = useState("");
  const [total, setTotal] = useState("");
  const obtainedId = useId();
  const totalId = useId();

  const percent = useMemo(() => {
    const o = parseFloat(obtained);
    const t = parseFloat(total);
    if (!o || !t || t === 0) return null;
    return ((o / t) * 100).toFixed(2);
  }, [obtained, total]);

  return (
    <div className="card-surface p-6">
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">Marks Percentage Calculator</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">Quickly convert marks obtained into a percentage.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label htmlFor={obtainedId} className="block text-sm">
          <span className="field-label">Marks obtained</span>
          <input
            id={obtainedId}
            type="number"
            inputMode="decimal"
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            placeholder="e.g. 462"
            className="field-input"
          />
        </label>
        <label htmlFor={totalId} className="block text-sm">
          <span className="field-label">Total marks</span>
          <input
            id={totalId}
            type="number"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder="e.g. 500"
            className="field-input"
          />
        </label>
      </div>

      <div className="mt-5 rounded-xl bg-paper p-4 dark:bg-ink-900" role="status" aria-live="polite">
        {percent ? (
          <p className="font-mono text-2xl font-semibold text-emerald-600 dark:text-emerald-300">{percent}%</p>
        ) : (
          <p className="text-sm text-ink-400">Enter both values to calculate your percentage.</p>
        )}
      </div>
    </div>
  );
}

function DeadlineTracker() {
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [items, setItems] = useState<{ label: string; date: string }[]>([]);
  const labelId = useId();
  const dateId = useId();

  function addItem() {
    if (!label.trim() || !date) return;
    setItems((prev) => [...prev, { label: label.trim(), date }].sort((a, b) => a.date.localeCompare(b.date)));
    setLabel("");
    setDate("");
  }

  function daysLeft(dateStr: string) {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <div className="card-surface p-6">
      <h3 className="font-display text-lg font-semibold text-ink-800 dark:text-paper">Application Deadline Tracker</h3>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
        Add closing dates you&apos;re tracking and see days remaining.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor={labelId} className="sr-only">
          Deadline label
        </label>
        <input
          id={labelId}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="e.g. SSC CGL 2026"
          className="field-input flex-1"
        />
        <label htmlFor={dateId} className="sr-only">
          Deadline date
        </label>
        <input
          id={dateId}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="field-input sm:w-auto"
        />
        <button type="button" onClick={addItem} className="btn-primary" disabled={!label.trim() || !date}>
          Track
        </button>
      </div>

      <ul className="mt-5 space-y-2" aria-live="polite">
        {items.length === 0 && <p className="text-sm text-ink-400">No deadlines tracked yet.</p>}
        {items.map((item, idx) => {
          const left = daysLeft(item.date);
          return (
            <li
              key={`${item.label}-${idx}`}
              className="flex items-center justify-between rounded-lg bg-paper px-4 py-3 text-sm dark:bg-ink-900"
            >
              <span className="text-ink-700 dark:text-paper">{item.label}</span>
              <span
                className={`font-mono text-xs ${
                  left < 0
                    ? "text-ink-400"
                    : left <= 3
                    ? "text-rust-500"
                    : "text-emerald-600 dark:text-emerald-300"
                }`}
              >
                {left < 0 ? "Closed" : left === 0 ? "Closes today" : `${left} days left`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ToolsClient() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AgeCalculator />
      <PercentageCalculator />
      <div className="lg:col-span-2">
        <DeadlineTracker />
      </div>
    </div>
  );
}
