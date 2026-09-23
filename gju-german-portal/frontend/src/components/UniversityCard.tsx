import { ExternalLink, MapPin } from "lucide-react";
import type { University } from "../types";
import { useLanguage } from "../context/LanguageContext";

export function UniversityCard({
  university,
  onOpen,
}: {
  university: University;
  onOpen: (id: number) => void;
}) {
  const { t, isRTL } = useLanguage();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5 shadow-card dark:border-white/10 dark:bg-white/5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-xl text-slate-900 dark:text-stone-50">{university.name}</h3>
        <span className="shrink-0 rounded-full bg-gju-crimson/10 px-2.5 py-1 text-xs font-semibold text-gju-crimson dark:bg-gju-gold/15 dark:text-gju-gold">
          {isRTL ? `ألماني ${university.min_german_level}` : `DE ${university.min_german_level}`}
        </span>
      </div>
      <p className="mb-3 inline-flex items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400">
        <MapPin className="h-4 w-4" />
        {university.city}، {university.state}
      </p>
      <p className="mb-4 line-clamp-3 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-300">{university.description}</p>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {university.majors.slice(0, 4).map((major) => (
          <span
            key={major.id}
            className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:bg-white/10 dark:text-stone-300"
          >
            {major.name}
          </span>
        ))}
        {university.majors.length > 4 ? (
          <span className="text-[11px] text-stone-400">+{university.majors.length - 4}</span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <a
          href={university.website_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium text-gju-crimson hover:underline dark:text-gju-gold"
        >
          {isRTL ? "الموقع الرسمي" : "Website"} <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <button
          type="button"
          onClick={() => onOpen(university.id)}
          className="rounded-full bg-slate-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-slate-900"
        >
          {t("view_details")}
        </button>
      </div>
    </article>
  );
}
