import { useState, useMemo } from "react";
import {
  Coins,
  Building2,
  ExternalLink,
  Info,
  ShieldCheck,
  CheckCircle2,
  PiggyBank,
  Wallet,
  Printer,
} from "lucide-react";
import {
  BLOCKED_ACCOUNT_PROVIDERS,
  GERMAN_CITIES_COST_DATA,
  STATUTORY_MONTHLY_SPERRKONTO_EUR,
  DEFAULT_EUR_TO_JOD_RATE,
  EMBASSY_JORDAN_COSTS,
  type ProviderPlan,
} from "../data/costData";
import { useLanguage } from "../context/LanguageContext";

export function CostCalculator() {
  const { t, isRTL } = useLanguage();

  // Configurable inputs
  const [months, setMonths] = useState<number>(12);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("expatrio");
  const [selectedCityName, setSelectedCityName] = useState<string>("Darmstadt");
  const [currency, setCurrency] = useState<"EUR" | "JOD">("EUR");
  const [includeFlights, setIncludeFlights] = useState<boolean>(true);
  const [includePrepDocs, setIncludePrepDocs] = useState<boolean>(true);
  const [eurToJodRate, setEurToJodRate] = useState<number>(DEFAULT_EUR_TO_JOD_RATE);

  const selectedProvider = useMemo<ProviderPlan>(() => {
    return BLOCKED_ACCOUNT_PROVIDERS.find((p) => p.id === selectedProviderId) || BLOCKED_ACCOUNT_PROVIDERS[0];
  }, [selectedProviderId]);

  const selectedCity = useMemo(() => {
    return GERMAN_CITIES_COST_DATA.find((c) => c.city === selectedCityName) || GERMAN_CITIES_COST_DATA[0];
  }, [selectedCityName]);

  // Sperrkonto Calculations
  const statutoryTotalEur = STATUTORY_MONTHLY_SPERRKONTO_EUR * months;
  const providerSetupEur = selectedProvider.setupFeeEur;
  const providerMonthlyFeesTotalEur = selectedProvider.monthlyFeeEur * months;
  const providerBufferEur = selectedProvider.bufferEur;

  // Total transferred into blocked account package
  const totalBlockedAccountDepositEur =
    statutoryTotalEur + providerSetupEur + providerMonthlyFeesTotalEur + providerBufferEur;

  // Additional Upfront Costs in Amman / Jordan
  const visaFeeEur = EMBASSY_JORDAN_COSTS.visaFeeEur;
  const visaFeeJod = visaFeeEur * eurToJodRate;

  const translationJod = includePrepDocs ? EMBASSY_JORDAN_COSTS.translationAttestationJod : 0;
  const biometricJod = includePrepDocs ? EMBASSY_JORDAN_COSTS.biometricPhotosJod : 0;
  const bankTransferJod = EMBASSY_JORDAN_COSTS.bankTransferFeeJod;
  const flightJod = includeFlights ? EMBASSY_JORDAN_COSTS.flightEstimateJod : 0;

  const totalJordanCostsJod = visaFeeJod + translationJod + biometricJod + bankTransferJod + flightJod;
  const totalJordanCostsEur = totalJordanCostsJod / eurToJodRate;

  // Grand Total Cash Outlay (Before Landing in Germany)
  const grandTotalEur = totalBlockedAccountDepositEur + totalJordanCostsEur;
  const grandTotalJod = grandTotalEur * eurToJodRate;

  // Format Helper
  const fmt = (eurAmount: number) => {
    if (currency === "JOD") {
      const jod = eurAmount * eurToJodRate;
      return `${jod.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} JOD`;
    }
    return `€${eurAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gju-crimson dark:text-gju-gold">
            {t("calc_badge")}
          </p>
          <h1 className="mt-1 font-display text-4xl text-slate-900 dark:text-white">
            {t("calc_title")}
          </h1>
          <p className="mt-2 max-w-3xl text-stone-600 dark:text-stone-300">
            {t("calc_desc")}
          </p>
        </div>

        {/* Currency & Print Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 dark:border-white/10 dark:bg-white/5 dark:text-stone-200 dark:hover:bg-white/10"
          >
            <Printer className="h-4 w-4 text-stone-500" /> {t("print_summary")}
          </button>

          <div className="flex rounded-xl border border-stone-200 bg-stone-100 p-1 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => setCurrency("EUR")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                currency === "EUR"
                  ? "bg-white text-gju-crimson shadow-sm dark:bg-white/10 dark:text-gju-gold"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              EUR (€)
            </button>
            <button
              type="button"
              onClick={() => setCurrency("JOD")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                currency === "JOD"
                  ? "bg-white text-gju-crimson shadow-sm dark:bg-white/10 dark:text-gju-gold"
                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              }`}
            >
              JOD (JD)
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Info Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="text-sm text-amber-900 dark:text-amber-200">
          <span className="font-semibold">{t("official_rate_title")}</span> {t("official_rate_desc")}{" "}
          ({months} {isRTL ? "شهراً" : "months"} = <span className="font-bold">€{(992 * months).toLocaleString()}</span>).
        </div>
      </div>

      {/* Main Grid: Left Controls & Right Summary */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Interactive Parameters (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* 1. Duration & City Selection */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Building2 className="h-5 w-5 text-gju-crimson dark:text-gju-gold" />
              {t("step1_title")}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">
                  {t("stay_duration")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMonths(12)}
                    className={`rounded-xl border py-2.5 text-center text-sm font-semibold transition ${
                      months === 12
                        ? "border-gju-crimson bg-gju-crimson text-white shadow-sm dark:border-gju-gold dark:bg-gju-gold dark:text-slate-900"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-slate-900 dark:text-stone-300"
                    }`}
                  >
                    {t("twelve_months")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonths(6)}
                    className={`rounded-xl border py-2.5 text-center text-sm font-semibold transition ${
                      months === 6
                        ? "border-gju-crimson bg-gju-crimson text-white shadow-sm dark:border-gju-gold dark:bg-gju-gold dark:text-slate-900"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-white/10 dark:bg-slate-900 dark:text-stone-300"
                    }`}
                  >
                    {t("six_months")}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-stone-500">
                  {t("target_city")}
                </label>
                <select
                  value={selectedCityName}
                  onChange={(e) => setSelectedCityName(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition focus:border-gju-crimson focus:outline-none dark:border-white/10 dark:bg-slate-900 dark:text-stone-200"
                >
                  {GERMAN_CITIES_COST_DATA.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city} ({c.state}) — Tier: {c.tier.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City Rent & Living Insight */}
            <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-4 dark:border-white/5 dark:bg-white/[0.02]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {selectedCity.city} {t("living_benchmark")}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    selectedCity.tier === "high"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                      : selectedCity.tier === "moderate"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  }`}
                >
                  {selectedCity.tier === "high" ? t("tier_high") : selectedCity.tier === "moderate" ? t("tier_moderate") : t("tier_budget")}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                  <span className="block text-xs text-stone-500">{t("avg_wg_room")}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {fmt(selectedCity.estimatedRentEur)} / mo
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">{t("semester_fee")}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {fmt(selectedCity.avgSemesterContributionEur)} / sem
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-xs text-stone-500">{t("acc_tip")}</span>
                  <span className="text-xs text-stone-600 dark:text-stone-300">
                    {selectedCity.notes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Blocked Account Provider Selection */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                <PiggyBank className="h-5 w-5 text-gju-crimson dark:text-gju-gold" />
                {t("step2_title")}
              </h2>
              <span className="text-xs text-stone-500">{t("embassy_recognised")}</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {BLOCKED_ACCOUNT_PROVIDERS.map((provider) => {
                const isSelected = selectedProviderId === provider.id;
                const totalProviderFee = provider.setupFeeEur + provider.monthlyFeeEur * months;
                return (
                  <div
                    key={provider.id}
                    onClick={() => setSelectedProviderId(provider.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-gju-crimson bg-gju-crimson/5 ring-2 ring-gju-crimson/30 dark:border-gju-gold dark:bg-gju-gold/5 dark:ring-gju-gold/30"
                        : "border-stone-200 bg-white hover:border-stone-300 dark:border-white/10 dark:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{provider.name.split(" ")[0]}</span>
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-gju-crimson dark:text-gju-gold" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-stone-300 dark:border-white/20" />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-stone-500">{t("total_provider_cost")}:</div>
                    <div className="text-sm font-semibold text-gju-crimson dark:text-gju-gold">
                      {fmt(totalProviderFee)}
                    </div>
                    <div className="mt-1 text-[11px] text-stone-400">
                      {t("setup_fee")}: €{provider.setupFeeEur} {provider.monthlyFeeEur > 0 ? `+ €${provider.monthlyFeeEur}/mo` : t("no_monthly_fee")}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Provider Details Callout */}
            <div className="mt-4 rounded-xl bg-stone-50 p-4 text-xs text-stone-600 dark:bg-white/[0.03] dark:text-stone-300">
              <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                <span>{selectedProvider.name}</span>
                <a
                  href={selectedProvider.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-gju-crimson hover:underline dark:text-gju-gold"
                >
                  {t("official_portal")} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="mt-1">{selectedProvider.description}</p>
              <ul className="mt-2 space-y-1 text-stone-500 dark:text-stone-400">
                {selectedProvider.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-emerald-500">✓</span> {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Upfront Visa & Amman Preparation Expenses */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
              <Wallet className="h-5 w-5 text-gju-crimson dark:text-gju-gold" />
              {t("step3_title")}
            </h2>

            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-3 transition hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">{t("embassy_visa_fee")}</span>
                    <p className="text-xs text-stone-500">{t("embassy_visa_desc")}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">{fmt(visaFeeEur)}</span>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-3 transition hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includePrepDocs}
                    onChange={(e) => setIncludePrepDocs(e.target.checked)}
                    className="h-4 w-4 accent-gju-crimson"
                  />
                  <div>
                    <span className="text-sm font-medium">{t("prep_docs")}</span>
                    <p className="text-xs text-stone-500">{t("prep_docs_desc")}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {includePrepDocs ? fmt((EMBASSY_JORDAN_COSTS.translationAttestationJod + EMBASSY_JORDAN_COSTS.biometricPhotosJod) / eurToJodRate) : fmt(0)}
                </span>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-stone-200 p-3 transition hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeFlights}
                    onChange={(e) => setIncludeFlights(e.target.checked)}
                    className="h-4 w-4 accent-gju-crimson"
                  />
                  <div>
                    <span className="text-sm font-medium">{t("flight_ticket")}</span>
                    <p className="text-xs text-stone-500">{t("flight_desc")}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">
                  {includeFlights ? fmt(EMBASSY_JORDAN_COSTS.flightEstimateJod / eurToJodRate) : fmt(0)}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Summary Card (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-20 rounded-3xl border border-stone-200 bg-gradient-to-b from-white to-stone-50/80 p-6 shadow-xl dark:border-white/10 dark:from-white/10 dark:to-white/5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gju-crimson/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gju-crimson dark:bg-gju-gold/20 dark:text-gju-gold">
              <Coins className="h-3.5 w-3.5" /> {t("total_outlay")}
            </span>

            <div className="mt-4 border-b border-stone-200 pb-5 dark:border-white/10">
              <p className="text-xs text-stone-500">{t("upfront_needed")}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {fmt(grandTotalEur)}
                </span>
                <span className="text-sm font-medium text-stone-500">
                  ({currency === "EUR" ? `${grandTotalJod.toFixed(0)} JOD` : `€${grandTotalEur.toFixed(0)}`})
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="mt-5 space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-300">{t("statutory_deposit")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(statutoryTotalEur)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-300">{t("provider_fees")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {fmt(providerSetupEur + providerMonthlyFeesTotalEur)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-300">{t("buffer_deposit")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(providerBufferEur)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600 dark:text-stone-300">{t("embassy_prep_expenses")}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fmt(totalJordanCostsEur)}</span>
              </div>
            </div>

            {/* Monthly Inflow in Germany */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  {t("monthly_payout")}
                </span>
                <span className="rounded-full bg-emerald-200/80 px-2 py-0.5 text-[11px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100">
                  {t("guaranteed")}
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                {fmt(STATUTORY_MONTHLY_SPERRKONTO_EUR)} <span className="text-xs font-normal">{isRTL ? "/ شهرياً" : "/ month"}</span>
              </div>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                {t("monthly_payout_desc")}
              </p>
            </div>

            {/* Exchange Rate Setting */}
            <div className="mt-6 flex items-center justify-between text-xs text-stone-500">
              <span>{t("exchange_rate")}</span>
              <div className="flex items-center gap-1.5">
                <span>1 EUR =</span>
                <input
                  type="number"
                  step="0.01"
                  value={eurToJodRate}
                  onChange={(e) => setEurToJodRate(parseFloat(e.target.value) || DEFAULT_EUR_TO_JOD_RATE)}
                  className="w-16 rounded-md border border-stone-200 bg-white px-1.5 py-0.5 text-center font-mono text-xs dark:border-white/10 dark:bg-slate-900"
                />
                <span>JOD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Comparison & Bank Transfer Guide */}
      <div className="mt-12 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h2 className="font-display text-2xl text-slate-900 dark:text-white">
          {t("guide_title")}
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          {t("guide_desc")}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gju-crimson text-sm font-bold text-white dark:bg-gju-gold dark:text-slate-900">
              1
            </div>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{t("guide_step1_title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              {t("guide_step1_desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gju-crimson text-sm font-bold text-white dark:bg-gju-gold dark:text-slate-900">
              2
            </div>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{t("guide_step2_title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              {t("guide_step2_desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gju-crimson text-sm font-bold text-white dark:bg-gju-gold dark:text-slate-900">
              3
            </div>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{t("guide_step3_title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              {t("guide_step3_desc")}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gju-crimson text-sm font-bold text-white dark:bg-gju-gold dark:text-slate-900">
              4
            </div>
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{t("guide_step4_title")}</h3>
            <p className="mt-1 text-xs leading-relaxed text-stone-600 dark:text-stone-400">
              {t("guide_step4_desc")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
