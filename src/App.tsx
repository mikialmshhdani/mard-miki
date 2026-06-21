import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { GenieAvatar } from "./components/GenieAvatar";
import { sendMessageToAI } from "./utils/gemini";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const WELCOME_MESSAGE: Message = {
  id: 1,
  role: "assistant",
  content: "عفاك! أنا المارد ميكي، مساعدك الذكي 🧞‍♂️\nهاي، شلونك؟ شنو أقدر أساعدك اليوم؟",
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputValue.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const conversationHistory = messages
        .filter((m) => !m.error)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

      const aiResponse = await sendMessageToAI(
        userMessage.content,
        conversationHistory
      );

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `عذراً، صار خطأ: ${
          error instanceof Error ? error.message : "خطأ بالاتصال"
        } 🙁\nجرب مرة ثانية!`,
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" dir="rtl">
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GenieAvatar />
            <div>
              <h1 className="text-xl font-bold text-white">المارد ميكي</h1>
              <p className="text-sm text-cyan-400">مساعدك الذكي</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">محادثة جديدة</span>
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-3"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 rounded-xl py-3 px-4"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={`flex items-start gap-3 max-w-[85%] ${
          isUser ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
              <span className="text-slate-300 text-lg">👤</span>
            </div>
          ) : (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg ${
                message.error
                  ? "bg-gradient-to-br from-red-500 to-orange-600 shadow-red-500/20"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
              }`}
            >
              <span className="text-white text-lg">
                {message.error ? "⚠️" : "🧞"}
              </span>
            </div>
          )}
        </div>

        <div
          className={`px-5 py-3 rounded-2xl ${
            isUser
              ? "bg-cyan-600/90 text-white rounded-tr-md"
              : message.error
              ? "bg-red-900/30 text-red-200 rounded-tl-md border border-red-500/30"
              : "bg-slate-800/80 text-slate-200 rounded-tl-md border border-slate-700/50"
          }`}
        >
          {message.error && (
            <div className="flex items-center gap-2 mb-2 text-red-300">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">خطأ</span>
            </div>
          )}
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-end">
      <div className="flex items-start gap-3 flex-row-reverse">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-white text-lg">🧞</span>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/50 px-5 py-4 rounded-2xl rounded-tl-md">
          <div className="flex gap-1.5">
            <span
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}