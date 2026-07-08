"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const getTextContent = (m: UIMessage) =>
  m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

// ─── Suggested questions ──────────────────────────────────────────────────────

const SUGGESTIONS = [
  "What's your current tech stack?",
  "Tell me about your most challenging project",
  "Are you open to relocation?",
  "Do you have experience with Redux?",
];

interface BubbleProps {
  role: "user" | "assistant";
  content: string;
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ role, content }: BubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="mr-2 mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10">
          <Image src="/portrait.png" alt="Leo" width={28} height={28} className="h-full w-full object-cover" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-white text-black"
            : "rounded-tl-sm border border-white/10 bg-white/5 text-white/90"
        )}
      >
        {content}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full border border-white/10">
        <Image src="/portrait.png" alt="Leo" width={28} height={28} className="h-full w-full object-cover" />
      </div>
      <div className="flex gap-1 rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-white/40"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatSection() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, isLoading]);

  function handleSuggestion(text: string) {
    setInput(text);
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setStarted(true);
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <section
      id="chat"
      className="relative mx-auto flex min-h-1/2 w-full max-w-2xl flex-col justify-center px-4 py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-widest text-white/30">AI-powered</p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Ask me anything</h2>
        <p className="mt-3 text-sm text-white/40">
          Powered by my actual experience — I only answer what I know.
        </p>
      </motion.div>

      {/* Chat window */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-white/3 p-2">
        {/* Messages */}
        <div className="flex h-64 flex-col gap-3 overflow-y-auto">
          <AnimatePresence initial={false}>
            {!started && messages.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-3 py-6"
              >
                <p className="text-sm text-white/30">Try asking something:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white/90"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role as "user" | "assistant"} content={getTextContent(m)} />
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/8" />

        {/* Input */}
        <form onSubmit={onSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my experience, stack, availability..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              input.trim() && !isLoading
                ? "bg-white text-black hover:bg-white/90"
                : "cursor-not-allowed border border-white/10 text-white/20"
            )}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-center text-xs text-white/20">
        Responses are generated by AI trained on my actual data — always feel free to reach out directly.
      </p>
    </section>
  );
}
