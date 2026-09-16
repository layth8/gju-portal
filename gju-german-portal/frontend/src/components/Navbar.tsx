import { Calculator, GraduationCap, Landmark, Moon, Plane, Shield, Sun } from "lucide-react";
import type { AppTab } from "../types";

interface NavbarProps {
  tab: AppTab;
  onTab: (tab: AppTab) => void;
  dark: boolean;
  onToggleTheme: () => void;
}

const TABS: { id: AppTab; label: string; icon: typeof GraduationCap }[] = [
  { id: "explorer", label: "University Explorer", icon: Landmark },
  { id: "language", label: "Language Pathway", icon: GraduationCap },
  { id: "visa", label: "Visa Checklist", icon: Plane },
  { id: "calculator", label: "Cost & Sperrkonto", icon: Calculator },
  { id: "admin", label: "Admin", icon: Shield },
];

export function Navbar({ tab, onTab, dark, onToggleTheme }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-gju-ink/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gju-crimson text-sm font-bold text-white shadow-card">
            GJU
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg text-slate-900 dark:text-stone-50">German Year Portal</p>
            <p className="truncate text-xs text-stone-500 dark:text-stone-400">German Jordanian University · Deutschjahr</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-full border border-stone-200 bg-stone-50 p-1 dark:border-white/10 dark:bg-white/5 md:flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTab(id)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${
                tab === id
                  ? "bg-white text-gju-crimson shadow-sm dark:bg-white/10 dark:text-gju-gold"
                  : "text-stone-600 hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTab(id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
              tab === id
                ? "bg-gju-crimson text-white"
                : "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
