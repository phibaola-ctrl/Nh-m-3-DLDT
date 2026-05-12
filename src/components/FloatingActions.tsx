import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Xin chào! Tôi là trợ lý NextStep AI. Tôi có thể giúp bạn tìm kiếm điểm đến hoặc tư vấn lịch trình du lịch. Bạn cần hỗ trợ gì không?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Bạn là trợ lý ảo của NextStep AI, một nền tảng lập kế hoạch du lịch thông minh. Hãy trả lời ngắn gọn, thân thiện và hữu ích về các chủ đề du lịch. Câu hỏi: ${userMessage}` }]
          }
        ],
        config: {
          systemInstruction: "Bạn là trợ lý NextStep AI chuyên về du lịch Việt Nam. Hãy trả lời bằng tiếng Việt, phong cách hiện đại, nhiệt tình."
        }
      });

      const botResponse = response.text || "Xin lỗi, tôi không thể trả lời lúc này. Thử lại sau nhé!";
      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "bot", content: "Có lỗi xảy ra khi kết nối với AI. Vui lòng kiểm tra lại!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {/* Zalo Button */}
      <motion.a
        href="https://zalo.me/0981656750"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors group relative"
      >
        <Phone size={24} />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-white text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-xl border border-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Liên hệ Zalo
        </span>
      </motion.a>

      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen ? "bg-zinc-900 text-white" : "bg-sage text-white hover:bg-sage/90"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, originX: 1, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl border border-zinc-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-sage text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">NextStep AI Assistant</h3>
                  <p className="text-[10px] opacity-80 uppercase tracking-widest font-medium">Hỗ trợ trực tuyến</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-white rounded-tr-none"
                        : "bg-zinc-100 text-zinc-700 rounded-tl-none border border-zinc-200/50"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 text-zinc-500 p-4 rounded-2xl rounded-tl-none border border-zinc-200/50 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs font-medium">AI đang nghĩ...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50 border-t border-zinc-100 flex gap-2">
              <input
                type="text"
                placeholder="Hỏi tôi bất cứ điều gì..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage/20 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-sage text-white rounded-xl flex items-center justify-center hover:bg-sage/90 active:scale-95 disabled:opacity-50 transition-all shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
