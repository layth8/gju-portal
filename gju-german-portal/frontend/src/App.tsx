import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { GuideModal } from "./components/GuideModal";
import { ToastProvider } from "./components/Toast";
import { ChatWidget } from "./components/chat/ChatWidget";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { Admin } from "./pages/Admin";
import { CostCalculator } from "./pages/CostCalculator";
import { LanguageTracker } from "./pages/LanguageTracker";
import { UniExplorer } from "./pages/UniExplorer";
import { VisaChecklist } from "./pages/VisaChecklist";
import type { AppTab } from "./types";

const THEME_KEY = "gju-theme";
const GUIDE_SEEN_KEY = "gju_guide_seen";

function AppShell() {
  const [tab, setTab] = useState<AppTab>("explorer");
  const [dark, setDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const { isRTL } = useLanguage();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  // First-time visitor check: auto-open guide modal if not seen before
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem(GUIDE_SEEN_KEY);
    if (!hasSeenGuide) {
      setIsGuideOpen(true);
    }
  }, []);

  const handleCloseGuide = () => {
    localStorage.setItem(GUIDE_SEEN_KEY, "true");
    setIsGuideOpen(false);
  };

  return (
    <div className={`min-h-screen bg-[radial-gradient(circle_at_top,_rgba(196,163,90,0.12),_transparent_28%),radial-gradient(circle_at_80%_0%,_rgba(139,21,56,0.08),_transparent_24%)] ${isRTL ? "font-sans font-arabic" : ""}`}>
      <Navbar
        tab={tab}
        onTab={setTab}
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
      <main className="mx-auto max-w-7xl px-4 py-10">
        {tab === "explorer" ? <UniExplorer /> : null}
        {tab === "language" ? <LanguageTracker /> : null}
        {tab === "visa" ? <VisaChecklist /> : null}
        {tab === "calculator" ? <CostCalculator /> : null}
        {tab === "admin" ? <Admin /> : null}
      </main>
      <ChatWidget />
      <GuideModal isOpen={isGuideOpen} onClose={handleCloseGuide} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </LanguageProvider>
  );
}
