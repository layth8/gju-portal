import { useState } from "react";
import { Award, BookOpen, CheckCircle2 } from "lucide-react";

const STAGES = [
  {
    id: "a1",
    title: "German I",
    level: "A1",
    hours: "GJU GLC · ~8 ECTS",
    points: [
      "Survival German: introductions, campus life, numbers, and present tense.",
      "Exit goal: A1 (Goethe A1 / ÖSD A1 optional but not required for the Year).",
    ],
  },
  {
    id: "a2",
    title: "German II",
    level: "A2",
    hours: "GJU GLC · ~8 ECTS",
    points: [
      "Past tenses, separable verbs, and everyday administration vocabulary.",
      "You should handle Wohnheim forms, supermarket German, and simple emails.",
    ],
  },
  {
    id: "b1a",
    title: "German III",
    level: "B1.1",
    hours: "GJU GLC",
    points: [
      "Argument structure, relative clauses, and internship-oriented speaking.",
      "Most GJU students sit internal B1 assessments after German III–IV.",
    ],
  },
  {
    id: "b1b",
    title: "German IV",
    level: "B1",
    hours: "B1 track (required)",
    points: [
      "Minimum for many FH partners and the embassy language narrative.",
      "GJU expects successful completion of the B1 track before nomination.",
    ],
  },
  {
    id: "b2",
    title: "B2 / TestDaF",
    level: "B2+",
    hours: "Optional / host-required",
    points: [
      "Needed for lecture-heavy partners (HTW Berlin, TH Köln, HFT Stuttgart, Uni Leipzig).",
      "TestDaF TDN 3–4 in all sections is a common university threshold.",
    ],
  },
];

const CERTS = [
  {
    name: "Goethe-Zertifikat",
    detail: "B1: pass all modules. B2: typically 60% overall. Widely accepted by FHs and the embassy.",
  },
  {
    name: "TestDaF",
    detail: "Aim for TDN 4 in Lesen, Hören, Schreiben, Sprechen. TDN 3 may suffice for some applied-science hosts.",
  },
  {
    name: "ÖSD",
    detail: "ÖSD Zertifikat B1/B2 is accepted similarly to Goethe. Bring the original booklet to Amman.",
  },
];

export function LanguageTracker() {
  const [active, setActive] = useState("b1b");
  const current = STAGES.find((stage) => stage.id === active) ?? STAGES[0];

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gju-crimson dark:text-gju-gold">
        German Language Center
      </p>
      <h1 className="mt-1 font-display text-4xl text-slate-900 dark:text-white">Language Pathway</h1>
      <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-300">
        Follow the GJU track from A1 to the B1 German Year gate, then decide whether your host needs B2 or TestDaF.
      </p>

      <div className="mt-8 overflow-x-auto pb-2">
        <ol className="flex min-w-[720px] items-stretch gap-3">
          {STAGES.map((stage, index) => (
            <li key={stage.id} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => setActive(stage.id)}
                className={`w-full rounded-2xl border px-3 py-4 text-left transition ${
                  active === stage.id
                    ? "border-gju-crimson bg-gju-crimson text-white shadow-card"
                    : "border-stone-200 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <p className="text-xs opacity-80">{stage.title}</p>
                <p className="font-display text-2xl">{stage.level}</p>
              </button>
              {index < STAGES.length - 1 ? (
                <span className="mx-1 hidden h-0.5 w-6 shrink-0 bg-gju-gold sm:block" />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center gap-2 text-gju-crimson dark:text-gju-gold">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-display text-2xl text-slate-900 dark:text-white">
              {current.title} · {current.level}
            </h2>
          </div>
          <p className="mb-4 text-sm text-stone-500">{current.hours}</p>
          <ul className="space-y-3">
            {current.points.map((point) => (
              <li key={point} className="flex gap-2 text-stone-700 dark:text-stone-200">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                {point}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-stone-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-gju-gold" />
            <h2 className="font-display text-2xl">Accepted certificates</h2>
          </div>
          <ul className="space-y-4">
            {CERTS.map((cert) => (
              <li key={cert.name}>
                <p className="font-semibold">{cert.name}</p>
                <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">{cert.detail}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
