import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import { Admin } from "./pages/Admin";
import { CostCalculator } from "./pages/CostCalculator";
import { LanguageTracker } from "./pages/LanguageTracker";
import { UniExplorer } from "./pages/UniExplorer";
import { VisaChecklist } from "./pages/VisaChecklist";
import type { AppTab } from "./types";

const THEME_KEY = "gju-theme";

function AppShell() {
  const [tab, setTab] = useState<AppTab>("explorer");
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,163,90,0.12),_transparent_28%),radial-gradient(circle_at_80%_0%,_rgba(139,21,56,0.08),_transparent_24%)]">
      <Navbar tab={tab} onTab={setTab} dark={dark} onToggleTheme={() => setDark((value) => !value)} />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {tab === "explorer" ? <UniExplorer /> : null}
        {tab === "language" ? <LanguageTracker /> : null}
        {tab === "visa" ? <VisaChecklist /> : null}
        {tab === "calculator" ? <CostCalculator /> : null}
        {tab === "admin" ? <Admin /> : null}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  );
}
