import { useEffect } from "react";
import {
  X,
  Compass,
  GraduationCap,
  FileCheck2,
  Calculator,
  Bot,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  const { isRTL } = useLanguage();

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const features = [
    {
      id: "explorer",
      icon: Compass,
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
      titleEn: "1. University Explorer",
      titleAr: "١. استكشاف الجامعات الشريكة",
      descEn:
        "Search and filter approved partner Hochschulen by GJU major and required German level (B1/B2).",
      descAr:
        "ابحث وتصفح جامعات العلوم التطبيقية المعتمدة حسب تخصصك في الجامعة ومستوى اللغة الألمانية المطلوب (B1/B2).",
    },
    {
      id: "language",
      icon: GraduationCap,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      titleEn: "2. Language Pathway",
      titleAr: "٢. مسار اللغة الألمانية",
      descEn:
        "Track your progression from foundational courses up through the B1 requirement for nomination.",
      descAr:
        "تتبع تقدمك الأكاديمي من المساقات التأسيسية حتى تحقيق متطلب B1 الإلزامي للترشيح.",
    },
    {
      id: "visa",
      icon: FileCheck2,
      color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
      titleEn: "3. Visa Checklist",
      titleAr: "٣. قائمة متطلبات التأشيرة",
      descEn:
        "Step-by-step document tracking for your German Embassy Amman (Abdoun) appointment.",
      descAr:
        "متابعة تدريجية لكافة المستندات والأوراق المطلوبة لموعد مقابلتك في السفارة الألمانية بعمّان (عبدون).",
    },
    {
      id: "calculator",
      icon: Calculator,
      color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
      titleEn: "4. Cost & Sperrkonto Calculator",
      titleAr: "٤. حاسبة التكاليف والحساب المغلق",
      descEn:
        "Model monthly budgets against the official statutory blocked account payout (€992/mo) and regional cost indices.",
      descAr:
        "محاكاة الميزانية الشهرية مقابل مخصصات الحساب المغلق القانونية (992€ شهرياً) وتكاليف المدن الألمانية.",
    },
    {
      id: "advisor",
      icon: Bot,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      titleEn: "5. AI German Year Advisor",
      titleAr: "٥. المستشار الذكي للسنة الألمانية",
      descEn:
        "Access the floating bubble in the bottom-right for instant questions and generative budget cards.",
      descAr:
        "تفاعل مع الأيقونة العائمة أسفل الشاشة للحصول على إجابات فورية وتحليلات وبطاقات ميزانية تفاعلية.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
    >
      <div
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gju-crimson/20 border border-gju-crimson/40 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-rose-300">
                <Sparkles className="w-3 h-3 text-gju-gold" />
                {isRTL ? "دليل السنة الألمانية" : "Orientation Guide"}
              </span>
            </div>
            <h2
              id="guide-modal-title"
              className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight"
            >
              {isRTL
                ? "مرحباً بك في بوابة السنة الألمانية لـ GJU"
                : "Welcome to GJU German Year Portal"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isRTL
                ? "دليلك وحقيبتك المتكاملة للانتقال من عمّان إلى ألمانيا."
                : "Your central transition toolkit from Amman to Germany."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close guide modal"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Cards List */}
        <div className="py-5 space-y-3">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex items-start gap-3.5 rounded-xl border border-slate-800 bg-slate-800/40 p-3.5 transition-all hover:border-slate-700 hover:bg-slate-800/70"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {isRTL ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                    {isRTL ? item.descAr : item.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gju-crimson hover:bg-rose-700 text-white font-medium text-sm px-6 py-2.5 shadow-lg shadow-gju-crimson/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>{isRTL ? "فهمت، لنبدأ الاستكشاف!" : "Got it, let's explore!"}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
