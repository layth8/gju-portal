import { ExternalLink, X } from "lucide-react";
import type { University } from "../types";
import { useLanguage } from "../context/LanguageContext";

export function UniversityModal({
  university,
  loading,
  onClose,
}: {
  university: University | null;
  loading: boolean;
  onClose: () => void;
}) {
  const { isRTL } = useLanguage();

  if (!university && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gju-gold">
              {isRTL ? "جامعة شريكة" : "Partner university"}
            </p>
            <h2 className="font-display text-3xl text-slate-900 dark:text-white">
              {loading ? (isRTL ? "جاري التحميل…" : "Loading…") : university?.name}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-stone-100 dark:hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>
        {university ? (
          <>
            <p className="mb-4 text-stone-600 dark:text-stone-300">
              {university.city}، {university.state}
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-gju-crimson/10 px-3 py-1 text-xs font-semibold text-gju-crimson dark:bg-gju-gold/15 dark:text-gju-gold">
                {isRTL ? `اللغة الألمانية ${university.min_german_level}` : `German ${university.min_german_level}`}
              </span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600 dark:bg-white/10 dark:text-stone-300">
                {isRTL ? `اللغة الإنجليزية ${university.min_english_level}` : `English ${university.min_english_level}`}
              </span>
            </div>
            <p className="mb-5 leading-7 text-stone-700 dark:text-stone-200">{university.description}</p>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
              {isRTL ? "تخصصات GJU المتوافقة" : "Compatible GJU majors"}
            </h3>
            <ul className="mb-6 grid gap-2 sm:grid-cols-2">
              {university.majors.map((major) => (
                <li key={major.id} className="rounded-lg border border-stone-200 px-3 py-2 text-sm dark:border-white/10">
                  <span className="font-medium">{major.name}</span>
                  <span className="mx-2 text-xs text-stone-400">{major.school}</span>
                </li>
              ))}
            </ul>
            <a
              href={university.website_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gju-crimson px-4 py-2 text-sm font-medium text-white"
            >
              {isRTL ? "زيارة الموقع الإلكتروني الرسمي" : "Visit Official Website"} <ExternalLink className="h-4 w-4" />
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
