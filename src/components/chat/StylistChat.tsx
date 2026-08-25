"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage, Garment, UserProfile, AIConfig } from "@/types";
import { StorageService } from "@/lib/storage";
import { AIStylistService } from "@/lib/ai-stylist";
import { Send, Sparkles, User, Bot, Trash2, Lightbulb, Shirt, ArrowRight, Loader2 } from "lucide-react";

interface StylistChatProps {
  profile: UserProfile;
  garments: Garment[];
  aiConfig: AIConfig;
}

export const StylistChat: React.FC<StylistChatProps> = ({
  profile,
  garments,
  aiConfig,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    "¿Qué outfit me recomiendas hoy para una reunión de oficina?",
    "¿Cómo puedo combinar mi blazer beige para un look casual de fin de semana?",
    "¿Qué 3 prendas básicas me faltan en mi guardarropa actual?",
    "¿Cuáles son los mejores colores para mi subtono de piel?",
  ];

  useEffect(() => {
    const saved = StorageService.getChatMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      const welcomeMessage: ChatMessage = {
        id: "msg-welcome",
        role: "assistant",
        content: `¡Hola ${profile.name || ""}! Soy tu Asesor de Estilismo Personal. He revisado tu guardarropa (${garments.length} prendas registradas) y tu perfil con subtono **${profile.skinUndertone === "warm" ? "cálido" : profile.skinUndertone === "cool" ? "frío" : "neutro"}**.\n\n¿En qué te gustaría que te ayude hoy? Puedes preguntarme cómo combinar una prenda específica, qué ponerte para un evento o qué piezas clave te conviene sumar a tu armario cápsula.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([welcomeMessage]);
      StorageService.saveChatMessages([welcomeMessage]);
    }
  }, [profile, garments.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    StorageService.saveChatMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const response = await AIStylistService.sendChatMessage({
        message: query.trim(),
        profile,
        garments,
        config: aiConfig,
      });

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...updated, assistantMsg];
      setMessages(finalMessages);
      StorageService.saveChatMessages(finalMessages);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm("¿Deseas reiniciar la conversación con tu estilista?")) {
      StorageService.clearChat();
      setMessages([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16">
      {/* Top Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-cream-200 shadow-soft flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-terracotta-500" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-charcoal-900 leading-tight">
              Chat con tu Asesor de Estilismo
            </h1>
            <p className="text-xs text-charcoal-800/60 flex items-center gap-1.5 mt-0.5">
              <Shirt className="w-3.5 h-3.5 text-sage-700" />
              <span>Conectado con tus {garments.length} prendas registradas</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClear}
          title="Borrar chat"
          className="p-2.5 rounded-full hover:bg-cream-100 text-charcoal-800/60 hover:text-charcoal-900 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card p-4 sm:p-6 flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-charcoal-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4 text-terracotta-500" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-charcoal-900 text-white rounded-br-none shadow-xs"
                    : "bg-cream-50 text-charcoal-900 border border-cream-200 rounded-bl-none"
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <span className={`text-[10px] block mt-1.5 ${
                    isUser ? "text-cream-300 text-right" : "text-charcoal-800/50 text-left"
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-cream-200 text-charcoal-800 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-charcoal-900 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
              </div>
              <div className="bg-cream-50 border border-cream-200 px-4 py-3 rounded-3xl rounded-bl-none text-xs text-charcoal-800 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-terracotta-500" />
                <span>Tu estilista está formulando la mejor recomendación...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Starter Prompts */}
        {messages.length <= 3 && (
          <div className="py-3 border-t border-cream-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 block mb-2">
              Sugerencias rápidas:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {starterPrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-charcoal-800 text-[11px] whitespace-nowrap transition-all border border-cream-200/80"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="pt-3 border-t border-cream-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a tu estilista sobre combinaciones, ocasiones, cortes..."
              className="flex-1 px-4 py-3 rounded-2xl bg-cream-50 border border-cream-200 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-40 text-white rounded-2xl transition-all active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4 text-terracotta-500" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
