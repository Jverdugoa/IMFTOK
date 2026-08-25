"use client";

import React from "react";
import { Sparkles, Shirt, Wand2, MessageSquare, BookOpen, User, Settings, Plus, BarChart2 } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  garmentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenStats,
  onOpenSettings,
  garmentCount,
}) => {
  const navItems = [
    { id: "closet", label: "Guardarropa", icon: Shirt, badge: garmentCount },
    { id: "stylist", label: "Estilista IA", icon: Wand2 },
    { id: "chat", label: "Chat Asesor", icon: MessageSquare },
    { id: "lookbook", label: "Lookbook", icon: BookOpen },
    { id: "profile", label: "Mi Perfil", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-cream-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab("closet")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-charcoal-900 text-cream-50 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-terracotta-500" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-charcoal-900 block leading-tight">
                ATELIER <span className="text-terracotta-500 font-sans text-xs font-semibold uppercase tracking-widest px-1.5 py-0.5 bg-terracotta-50 rounded">IA</span>
              </span>
              <span className="text-[11px] text-charcoal-800/60 hidden sm:block tracking-wider uppercase">
                Estilismo Personal & Guardarropa Inteligente
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-cream-100 p-1.5 rounded-full border border-cream-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-charcoal-900 text-white shadow-sm"
                      : "text-charcoal-800/70 hover:text-charcoal-900 hover:bg-cream-200/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-terracotta-500" : ""}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-charcoal-800 text-cream-100" : "bg-cream-200 text-charcoal-800"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenStats}
              title="Diagnóstico y Resumen del Guardarropa"
              className="p-2.5 rounded-full text-charcoal-800 hover:bg-cream-200 transition-colors border border-cream-200/60"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSettings}
              title="Configuración de IA (API Keys)"
              className="p-2.5 rounded-full text-charcoal-800 hover:bg-cream-200 transition-colors border border-cream-200/60"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-700 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-sm hover:shadow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Añadir Prenda</span>
              <span className="sm:hidden">Prenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-lg border-t border-cream-200 px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive ? "text-terracotta-700 font-semibold" : "text-charcoal-800/60"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
