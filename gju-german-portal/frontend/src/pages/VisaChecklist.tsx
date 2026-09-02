import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckSquare } from "lucide-react";
import { fetchVisaSteps, getErrorMessage } from "../api/client";
import { useToast } from "../components/Toast";
import type { VisaStep } from "../types";

const CHECKS_KEY = "gju-visa-checks";
const DATE_KEY = "gju-departure-date";

function loadChecks(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(CHECKS_KEY) || "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function VisaChecklist() {
  const { notify } = useToast();
  const [steps, setSteps] = useState<VisaStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>(loadChecks);
  const [departure, setDeparture] = useState(localStorage.getItem(DATE_KEY) || "");

  useEffect(() => {
    fetchVisaSteps()
      .then(setSteps)
      .catch((error) => notify(getErrorMessage(error), "error"))
      .finally(() => setLoading(false));
  }, [notify]);

  useEffect(() => {
    localStorage.setItem(CHECKS_KEY, JSON.stringify(checks));
  }, [checks]);

  useEffect(() => {
    if (departure) localStorage.setItem(DATE_KEY, departure);
  }, [departure]);

  const done = steps.filter((step) => checks[String(step.id)]).length;
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0;

  const countdown = useMemo(() => {
    if (!departure) return null;
    const target = new Date(`${departure}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    return diff;
  }, [departure]);

  function dueDate(weeksBefore: number): string | null {
    if (!departure) return null;
    const target = new Date(`${departure}T00:00:00`);
    target.setDate(target.getDate() - weeksBefore * 7);
    return target.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gju-crimson dark:text-gju-gold">
        German Embassy Amman
      </p>
      <h1 className="mt-1 font-display text-4xl text-slate-900 dark:text-white">Visa Checklist</h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-300">
        National D-visa preparation for GJU students: Sperrkonto, incoming insurance, documents, and the Abdoun appointment.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-[1fr_280px]">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>
              {done}/{steps.length || "—"} · {progress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
            <div className="h-full bg-gju-crimson transition-all dark:bg-gju-gold" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <label className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="h-4 w-4" /> Target departure
          </span>
          <input
            type="date"
            value={departure}
            onChange={(event) => setDeparture(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
          />
          <p className="mt-2 text-xs text-stone-500">
            {countdown === null
              ? "Set a date to generate recommended deadlines."
              : countdown >= 0
                ? `${countdown} days until departure.`
                : `${Math.abs(countdown)} days after the stored date.`}
          </p>
        </label>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-stone-200/70 dark:bg-white/10" />
          ))}
        </div>
      ) : (
        <ol className="mt-6 space-y-3">
          {steps.map((step) => {
            const checked = Boolean(checks[String(step.id)]);
            const due = dueDate(step.recommended_weeks_before);
            return (
              <li key={step.id}>
                <label
                  className={`flex cursor-pointer gap-4 rounded-2xl border p-5 transition ${
                    checked
                      ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                      : "border-stone-200 bg-white dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setChecks((current) => ({ ...current, [String(step.id)]: !current[String(step.id)] }))
                    }
                    className="mt-1 h-5 w-5 accent-gju-crimson"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-stone-400">Step {step.step_number}</span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] dark:bg-white/10">{step.category}</span>
                      {due ? (
                        <span className="text-[11px] text-gju-crimson dark:text-gju-gold">Start by {due}</span>
                      ) : (
                        <span className="text-[11px] text-stone-400">{step.recommended_weeks_before} weeks before departure</span>
                      )}
                    </div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{step.description}</p>
                  </div>
                  <CheckSquare className={`mt-1 h-5 w-5 shrink-0 ${checked ? "text-emerald-600" : "text-stone-300"}`} />
                </label>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
