import {
  Coins,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  ShoppingCart,
  Wifi,
  Home,
  Scale,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { BudgetCalculationResult } from "../../types";

interface BudgetCardProps {
  data: BudgetCalculationResult;
}

export function BudgetCard({ data }: BudgetCardProps) {
  const { t, isRTL } = useLanguage();
  const isSurplus = data.status === "SURPLUS";
  const absNet = Math.abs(data.monthly_net);

  return (
    <div className={`my-3 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md transition dark:border-white/10 dark:bg-slate-900/95 ${isRTL ? "text-right" : "text-left"}`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-stone-100 bg-stone-50/80 px-4 py-2.5 dark:border-white/5 dark:bg-white/[0.03]">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gju-crimson dark:text-gju-gold" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            {t("budget_card_title")}: {data.city}
          </span>
          {data.city_multiplier > 1.0 && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              +{Math.round((data.city_multiplier - 1) * 100)}%
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isSurplus
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
              : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
          }`}
        >
          {isSurplus ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t("surplus")} (+€{data.monthly_net.toFixed(0)})</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{t("deficit")} (-€{absNet.toFixed(0)})</span>
            </>
          )}
        </div>
      </div>

      {/* Main Stats: Inflow vs Outflow */}
      <div className="grid grid-cols-2 divide-x rtl:divide-x-reverse divide-stone-100 border-b border-stone-100 bg-white p-3 dark:divide-white/5 dark:border-white/5 dark:bg-slate-900">
        <div className="px-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <Coins className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            {t("sperrkonto_payout")}
          </div>
          <div className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
            €{data.monthly_allowance.toFixed(0)}
            <span className="text-[11px] font-normal text-stone-400"> / mo</span>
          </div>
        </div>

        <div className="px-2">
          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <TrendingUp className="h-3 w-3 text-gju-crimson dark:text-gju-gold" />
            {t("est_monthly_cost")}
          </div>
          <div className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white">
            €{data.total_monthly_cost.toFixed(0)}
            <span className="text-[11px] font-normal text-stone-400"> / mo</span>
          </div>
        </div>
      </div>

      {/* Itemized Cost Breakdown */}
      <div className="space-y-1.5 p-3.5 text-xs">
        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-stone-400" /> {t("warm_rent")}
          </span>
          <span className="font-semibold text-slate-800 dark:text-stone-100">€{data.monthly_rent.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1.5">
            <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> {t("statutory_insurance")}
          </span>
          <span className="font-semibold text-slate-800 dark:text-stone-100">
            {data.has_statutory_insurance ? `€${data.statutory_insurance_cost.toFixed(2)}` : "€0.00"}
          </span>
        </div>

        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-amber-500" /> {t("groceries")}
          </span>
          <span className="font-semibold text-slate-800 dark:text-stone-100">€{data.grocery_cost.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
          <span className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5 text-blue-500" /> {t("utilities")}
          </span>
          <span className="font-semibold text-slate-800 dark:text-stone-100">€{data.utilities_cost.toFixed(2)}</span>
        </div>
      </div>

      {/* Warning or Surplus Banner */}
      {!isSurplus ? (
        <div className="border-t border-rose-100 bg-rose-50/70 p-3 text-xs text-rose-900 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            <div>
              <p className="font-semibold">{t("deficit_banner_title")}: €{absNet.toFixed(0)}/month</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-rose-700 dark:text-rose-300">
                {t("deficit_banner_text")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-t border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-semibold">{t("surplus_banner_title")}: +€{data.monthly_net.toFixed(0)}/month</p>
              <p className="mt-0.5 text-[11px] text-emerald-700 dark:text-emerald-300">
                {t("surplus_banner_text")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legal & Embassy Disclaimer */}
      <div className="flex items-center gap-1.5 border-t border-stone-100 bg-stone-50 px-3.5 py-2 text-[10px] text-stone-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-stone-400">
        <Scale className="h-3 w-3 shrink-0" />
        <span>{t("disclaimer")}</span>
      </div>
    </div>
  );
}
