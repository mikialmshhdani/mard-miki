import { useState } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GenieAvatar } from "./GenieAvatar";
import { ServiceCard } from "./ServiceCard";
import { services } from "../utils/constants";
import { Message, Service } from "../types";

interface ChatViewProps {
  messages: Message[];
  showCards: boolean;
  onSendMessage: (content: string) => void;
  onSelectService: (service: Service) => void;
  onResetChat: () => void;
}

export function ChatView({
  messages,
  showCards,
  onSendMessage,
  onSelectService,
  onResetChat,
}: ChatViewProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex-shrink-0 bg-slate-900/95 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GenieAvatar />
            <div>
              <h1 className="text-lg font-bold text-white">المارد ميكي</h1>
              <p className="text-xs text-cyan-400">مساعدك الذكي للإبداع</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetChat}
            className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            محادثة جديدة
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {/* Service Cards */}
          {showCards && (
            <div className="pt-6">
              <p className="text-slate-400 text-sm mb-4 text-center">
                اختر الخدمة المناسبة لمشروعك:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => onSelectService(service)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 bg-slate-900/95 backdrop-blur-md border-t border-cyan-500/20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 disabled:opacity-50"
            >
              <Send className="w-4 h-4 ml-2" />
              إرسال
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div className="flex items-start gap-3 max-w-[80%]">
        {!isUser && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">🧞</span>
            </div>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-cyan-600 text-white rounded-tr-sm"
              : "bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {isUser && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-slate-300 text-sm">👤</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}