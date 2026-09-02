import { useEffect, useMemo, useState } from "react";
import { Search, University as UniIcon } from "lucide-react";
import { fetchMajors, fetchUniversities, fetchUniversity, getErrorMessage } from "../api/client";
import { UniversityCard } from "../components/UniversityCard";
import { UniversityModal } from "../components/UniversityModal";
import { useToast } from "../components/Toast";
import type { Major, University } from "../types";

export function UniExplorer() {
  const { notify } = useToast();
  const [majors, setMajors] = useState<Major[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [majorId, setMajorId] = useState("");
  const [germanLevel, setGermanLevel] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<University | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    fetchMajors()
      .then(setMajors)
      .catch((error) => notify(getErrorMessage(error), "error"));
  }, [notify]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUniversities({
      major_id: majorId ? Number(majorId) : undefined,
      german_level: germanLevel || undefined,
      city: debouncedQuery.trim() || undefined,
    })
      .then((rows) => {
        if (!cancelled) setUniversities(rows);
      })
      .catch((error) => notify(getErrorMessage(error), "error"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [majorId, germanLevel, debouncedQuery, notify]);

  const schools = useMemo(() => [...new Set(majors.map((major) => major.school))], [majors]);

  async function openDetails(id: number) {
    setModalLoading(true);
    setSelected(universities.find((item) => item.id === id) ?? null);
    try {
      const detail = await fetchUniversity(id);
      setSelected(detail);
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gju-crimson dark:text-gju-gold">
          Partner network
        </p>
        <h1 className="mt-1 font-display text-4xl text-slate-900 dark:text-white">University Explorer</h1>
        <p className="mt-2 max-w-2xl text-stone-600 dark:text-stone-300">
          Filter GJU partner Hochschulen by your major, required German level, and city.
        </p>
      </div>

      <div className="mb-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1.5 block text-stone-500">GJU major</span>
          <select
            value={majorId}
            onChange={(event) => setMajorId(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900"
          >
            <option value="">All majors</option>
            {schools.map((school) => (
              <optgroup key={school} label={school}>
                {majors
                  .filter((major) => major.school === school)
                  .map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block text-stone-500">Minimum German level</span>
          <select
            value={germanLevel}
            onChange={(event) => setGermanLevel(event.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900"
          >
            <option value="">All</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="TestDaF">TestDaF</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block text-stone-500">Search city or name</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Berlin, HTW, Cologne…"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 dark:border-white/10 dark:bg-slate-900"
            />
          </div>
        </label>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-2xl bg-stone-200/70 dark:bg-white/10" />
          ))}
        </div>
      ) : universities.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 px-6 py-16 text-center dark:border-white/15">
          <UniIcon className="mb-3 h-10 w-10 text-stone-400" />
          <p className="font-medium">No partner universities match these filters.</p>
          <p className="mt-1 text-sm text-stone-500">Try another major, city, or language level.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {universities.map((university) => (
            <UniversityCard key={university.id} university={university} onOpen={openDetails} />
          ))}
        </div>
      )}

      <UniversityModal university={selected} loading={modalLoading} onClose={() => setSelected(null)} />
    </section>
  );
}
