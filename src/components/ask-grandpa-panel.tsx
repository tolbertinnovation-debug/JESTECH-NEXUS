"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { MessageCircleQuestion, RotateCcw, Send, Square, X } from "lucide-react";
import type { AskGrandpaProps } from "./ask-grandpa";
import { Markdown } from "./markdown";
import { cx } from "./ui";

type Msg = { role: "user" | "assistant"; content: string };
type Problem = { message: string; login?: boolean };

const storageKey = (p: AskGrandpaProps) => `grandpa:${p.courseSlug}:${p.lessonSlug ?? "_course"}`;

function loadHistory(key: string): Msg[] {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Msg[]) : [];
  } catch {
    return [];
  }
}

export default function AskGrandpaPanel(props: AskGrandpaProps & { onClose: () => void }) {
  const { courseSlug, lessonSlug, topic, suggestions, onClose } = props;
  const key = storageKey(props);
  const [messages, setMessages] = useState<Msg[]>(() => loadHistory(key));
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const abort = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(messages.slice(-20)));
    } catch {
      /* storage unavailable: the chat still works for this visit */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [key, messages]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      abort.current?.abort();
    };
  }, [onClose]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    setProblem(null);
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    const controller = new AbortController();
    abort.current = controller;

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, lessonSlug, messages: history.slice(-12) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessages(history.slice(0, -1)); // put the question back in the box
        setInput(q);
        setProblem({ message: data.error ?? "Grandpa can't answer right now.", login: res.status === 401 });
        return;
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let answer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += value;
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) setMessages([...history, { role: "assistant", content: "Sorry, I don't have an answer for that. Try asking in a different way." }]);
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        // Stopped by the learner: keep any partial answer, drop an empty "thinking" bubble.
        setMessages((prev) => (prev.at(-1)?.content ? prev : prev.slice(0, -1)));
        return;
      }
      setMessages(history);
      setProblem({ message: "Connection lost. Check your internet and try again." });
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void ask(input);
    }
  }

  const here = typeof window !== "undefined" ? window.location.pathname : "/";

  return (
    <div
      role="dialog"
      aria-label={`Ask Grandpa about ${topic}`}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col overflow-hidden rounded-t-2xl border border-line bg-paper shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,85dvh)] sm:w-[400px] sm:rounded-2xl print:hidden"
    >
      <header className="flex items-center gap-3 bg-ink px-4 py-3 text-paper">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-ink" aria-hidden>
          <MessageCircleQuestion className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold">Ask Grandpa</p>
          <p className="truncate text-xs text-paper/70">AI tutor · {topic}</p>
        </div>
        {messages.length > 0 && !busy && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setProblem(null);
            }}
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-paper/10"
            aria-label="Start a new conversation"
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        )}
        <button type="button" onClick={onClose} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-paper/10" aria-label="Close">
          <X className="size-5" aria-hidden />
        </button>
      </header>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-mist px-3.5 py-2.5 text-sm">
          Hello! I&apos;m <strong>Grandpa</strong>, your AI tutor. Ask me anything about <strong>{topic}</strong>, and I&apos;ll explain it
          simply.
        </div>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2" aria-label="Suggested questions">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void ask(s)}
                className="rounded-full border border-brand/50 bg-brand-tint px-3 py-1.5 text-left text-xs font-semibold text-brand-ink hover:border-brand"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2.5 text-sm whitespace-pre-wrap text-paper">
              {m.content}
            </div>
          ) : (
            <div key={i} className="max-w-[90%] rounded-2xl rounded-tl-sm bg-mist px-3.5 py-1 text-sm [&_.prose-lesson_p]:my-1.5 [&_.prose-lesson_ul]:my-1.5">
              {m.content ? (
                <Markdown source={m.content} />
              ) : (
                <p className="flex items-center gap-1 py-1.5 text-subtle" aria-label="Grandpa is thinking">
                  <span className="size-2 animate-bounce rounded-full bg-subtle [animation-delay:-0.3s]" />
                  <span className="size-2 animate-bounce rounded-full bg-subtle [animation-delay:-0.15s]" />
                  <span className="size-2 animate-bounce rounded-full bg-subtle" />
                </p>
              )}
            </div>
          ),
        )}
        {problem && (
          <div role="alert" className="rounded-xl border border-brand/40 bg-brand-tint p-3 text-sm">
            <p>{problem.message}</p>
            {problem.login && (
              <p className="mt-2 flex gap-3 font-semibold">
                <Link href={`/login?next=${encodeURIComponent(here)}`} className="underline">
                  Log in
                </Link>
                <Link href={`/register?next=${encodeURIComponent(here)}`} className="underline">
                  Join free
                </Link>
              </p>
            )}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-line p-3">
        <div className="flex items-end gap-2">
          <label htmlFor="grandpa-question" className="sr-only">
            Your question
          </label>
          <textarea
            id="grandpa-question"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={2000}
            placeholder="Type your question…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line bg-paper px-3 py-2.5 text-base focus:border-ink focus:outline-none"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => abort.current?.abort()}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-paper"
              aria-label="Stop answer"
            >
              <Square className="size-4 fill-current" aria-hidden />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className={cx(
                "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand text-ink transition-opacity",
                !input.trim() && "opacity-40",
              )}
              aria-label="Send question"
            >
              <Send className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-subtle">
          Grandpa is an AI and can make mistakes. Check important facts with your mentor. Never share passwords or PINs.
        </p>
      </form>
    </div>
  );
}
