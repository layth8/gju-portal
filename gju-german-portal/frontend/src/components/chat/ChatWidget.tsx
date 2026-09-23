import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage, getErrorMessage } from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";
import type { ChatMessage } from "../../types";
import { BudgetCard } from "./BudgetCard";

export function ChatWidget() {
  const { t, isRTL, language } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "init-1",
      role: "assistant",
      content: t("advisor_welcome"),
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);

  // Update initial message when language changes if no interaction yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "init-1") {
        return [{ id: "init-1", role: "assistant", content: t("advisor_welcome") }];
      }
      return prev;
    });
  }, [language, t]);

  const quickPrompts = [
    t("quick_prompt_1"),
    t("quick_prompt_2"),
    t("quick_prompt_3"),
    t("quick_prompt_4"),
  ];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await sendChatMessage(historyPayload, language);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        tool_data: response.tool_data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ *Advisor Error:* ${errorMsg}. Please ensure the backend is running and try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ id: "init-1", role: "assistant", content: t("advisor_welcome") }]);
  };

  return (
    <div className={`fixed bottom-6 ${isRTL ? "left-6" : "right-6"} z-50 flex flex-col items-end`}>
      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-slate-900/95 ${
            isExpanded
              ? "mb-4 h-[85vh] w-[95vw] sm:w-[680px]"
              : "mb-4 h-[600px] max-h-[82vh] w-[95vw] sm:w-[440px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-200/80 bg-gradient-to-r from-gju-crimson to-gju-crimson/90 px-4 py-3.5 text-white dark:from-slate-950 dark:to-slate-900 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner backdrop-blur-md dark:bg-gju-gold/20 dark:text-gju-gold">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">{t("advisor_title")}</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-white/80 dark:text-stone-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t("advisor_subtitle")}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/15 hover:text-white dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="hidden rounded-xl p-1.5 text-white/80 hover:bg-white/15 hover:text-white sm:block dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/15 hover:text-white dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gju-crimson/10 text-gju-crimson dark:bg-gju-gold/20 dark:text-gju-gold">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? "bg-gju-crimson text-white dark:bg-gju-gold dark:text-slate-950"
                          : "border border-stone-200/80 bg-stone-50/80 text-slate-800 dark:border-white/10 dark:bg-slate-800/80 dark:text-stone-100"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none break-words dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* Generative UI Tool Output */}
                    {msg.tool_data && <BudgetCard data={msg.tool_data} />}
                  </div>

                  {isUser && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-stone-200 text-stone-700 dark:bg-white/15 dark:text-stone-200">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gju-crimson/10 text-gju-crimson dark:bg-gju-gold/20 dark:text-gju-gold">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-stone-50 px-4 py-2.5 text-xs text-stone-600 dark:border-white/10 dark:bg-slate-800 dark:text-stone-300">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-gju-crimson dark:bg-gju-gold animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-gju-crimson dark:bg-gju-gold animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-gju-crimson dark:bg-gju-gold animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-medium">{t("advisor_thinking")}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-stone-100 bg-stone-50/50 px-3 py-2 dark:border-white/5 dark:bg-slate-900/60">
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="shrink-0 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 shadow-xs transition hover:border-gju-crimson hover:bg-gju-crimson/5 hover:text-gju-crimson disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-stone-300 dark:hover:border-gju-gold dark:hover:text-gju-gold"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-stone-200/80 bg-white p-3 dark:border-white/10 dark:bg-slate-900"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("advisor_placeholder")}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-stone-400 focus:border-gju-crimson focus:bg-white focus:outline-hidden dark:border-white/10 dark:bg-slate-800 dark:text-white dark:placeholder:text-stone-500 dark:focus:border-gju-gold"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gju-crimson text-white transition hover:bg-gju-crimson/90 disabled:opacity-40 dark:bg-gju-gold dark:text-slate-950 dark:hover:bg-gju-gold/90 rtl:rotate-180"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle GJU Advisor Chat"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gju-crimson text-white shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95 dark:bg-gju-gold dark:text-slate-950 focus:outline-none ring-4 ring-gju-crimson/20 dark:ring-gju-gold/30"
      >
        {isOpen ? (
          <ChevronDown className="h-6 w-6 transition-transform group-hover:translate-y-0.5" />
        ) : (
          <>
            <MessageSquare className="h-6 w-6" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900" />
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
