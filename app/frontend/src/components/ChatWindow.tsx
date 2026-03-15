import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    if (inputRef.current) inputRef.current.style.height = "auto";
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer ?? "לא התקבלה תשובה." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "שגיאה בחיבור לשרת." }]);
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

  return (
    <div className="flex flex-1 flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8" dir="rtl">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-foreground/80">DocInsight</p>
              <p className="text-sm text-muted-foreground">שאל שאלה על המסמכים שהעלית</p>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="animate-fade-in">
              {msg.role === "user" ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-bubble-user px-4 py-3 text-sm leading-relaxed text-bubble-user-foreground">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-end">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-bl-md bg-bubble-assistant px-4 py-3 text-sm leading-relaxed text-bubble-assistant-foreground"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-end animate-fade-in">
              <div className="bg-bubble-assistant rounded-2xl rounded-bl-md px-5 py-3.5 flex gap-1.5 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-pulse-dot [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors focus-within:border-foreground/20" dir="rtl">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="שאל שאלה..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground outline-none"
              disabled={loading}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-all duration-150 hover:bg-foreground/90 disabled:opacity-20"
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
