import { useState, useRef, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, displayedText]);

  // Typewriter effect for assistant messages
  useEffect(() => {
    if (displayedText === null) return;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;
    const full = lastMsg.content;
    if (displayedText.length >= full.length) {
      setDisplayedText(null);
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedText(full.slice(0, displayedText.length + 2));
    }, 12);
    return () => clearTimeout(timer);
  }, [displayedText, messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      const answer = data.answer ?? "No answer received.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setDisplayedText("");
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
      setDisplayedText("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const isHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);

  const renderMessageContent = (msg: Message, index: number) => {
    // For the last assistant message during typewriter, show partial text
    if (
      msg.role === "assistant" &&
      index === messages.length - 1 &&
      displayedText !== null
    ) {
      return displayedText + "▍";
    }
    return msg.content;
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1.5">
                <p className="text-base font-medium text-foreground/90">docci</p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  I'm here to analyze your documents and answer any questions you have about them. Just upload your files and start chatting!
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-2xl space-y-5">
          {messages.map((msg, i) => {
            const content = renderMessageContent(msg, i);
            const hebrew = isHebrew(content);
            return (
              <div
                key={i}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s`, animationFillMode: "both" }}
              >
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-2xl rounded-br-md bg-bubble-user px-4 py-3 text-[13.5px] leading-relaxed text-bubble-user-foreground"
                      dir={hebrew ? "rtl" : "ltr"}
                    >
                      {content}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div
                      className="max-w-[85%] text-[13.5px] leading-[1.7] text-foreground/85"
                      dir={hebrew ? "rtl" : "ltr"}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {content}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {loading && (
            <div className="flex justify-start gap-3 animate-fade-in">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent">
                <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex gap-1 items-center pt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse-dot [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-pulse-dot [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-all duration-200 focus-within:border-ring focus-within:shadow-[0_0_0_1px_hsl(var(--ring)/0.15)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your documents..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-[13.5px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-all duration-200 hover:bg-foreground/90 hover:scale-105 active:scale-95 disabled:opacity-15 disabled:hover:scale-100"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
