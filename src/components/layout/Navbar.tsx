"use client";

import React from "react";
import { Sparkles, Shirt, Wand2, MessageSquare, BookOpen, User, Settings, Plus, BarChart2, Moon, Sun } from "lucide-react";
import { ThemeMode } from "@/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  garmentCount: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  onOpenStats,
  onOpenSettings,
  garmentCount,
  theme,
  onToggleTheme,
}) => {
  const navItems = [
    { id: "closet", label: "Guardarropa", icon: Shirt, badge: garmentCount },
    { id: "stylist", label: "Estilista IA", icon: Wand2 },
    { id: "chat", label: "Chat Asesor", icon: MessageSquare },
    { id: "lookbook", label: "Lookbook", icon: BookOpen },
    { id: "profile", label: "Mi Perfil", icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 dark:bg-charcoal-950/90 backdrop-blur-md border-b border-cream-200/80 dark:border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name: IMFTOK */}
          <div 
            onClick={() => setActiveTab("closet")}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-charcoal-900 dark:bg-zinc-900 text-white flex items-center justify-center shadow-md border border-black/10 dark:border-white/10 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm sm:text-base text-terracotta-500 tracking-tighter">
                IMF
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-lg sm:text-2xl font-black tracking-tight text-charcoal-900 dark:text-white block leading-tight">
                  IMFTOK
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-terracotta-500/10 dark:bg-terracotta-500/20 text-terracotta-600 dark:text-terracotta-400 rounded-md border border-terracotta-500/20">
                  TOKYO
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-charcoal-800/60 dark:text-zinc-400 hidden sm:block tracking-wider">
                Improving My Fashion • Estilismo Personal IA
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-cream-100 dark:bg-charcoal-900 p-1.5 rounded-full border border-cream-200 dark:border-charcoal-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-charcoal-900 dark:bg-white text-white dark:text-charcoal-950 shadow-sm"
                      : "text-charcoal-800/70 dark:text-zinc-400 hover:text-charcoal-900 dark:hover:text-white hover:bg-cream-200/60 dark:hover:bg-charcoal-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-terracotta-500 dark:text-terracotta-600" : ""}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive 
                        ? "bg-charcoal-800 dark:bg-zinc-200 text-cream-100 dark:text-charcoal-900" 
                        : "bg-cream-200 dark:bg-charcoal-800 text-charcoal-800 dark:text-zinc-300"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="p-2 sm:p-2.5 rounded-full text-charcoal-800 dark:text-zinc-300 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors border border-cream-200/60 dark:border-charcoal-800"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400 animate-fadeIn" />
              ) : (
                <Moon className="w-4 h-4 text-charcoal-800 animate-fadeIn" />
              )}
            </button>

            {/* Stats / Diagnostic */}
            <button
              onClick={onOpenStats}
              title="Diagnóstico y Resumen de Guardarropa"
              className="p-2 sm:p-2.5 rounded-full text-charcoal-800 dark:text-zinc-300 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors border border-cream-200/60 dark:border-charcoal-800"
            >
              <BarChart2 className="w-4 h-4" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              title="Configuración de IA (API Keys)"
              className="p-2 sm:p-2.5 rounded-full text-charcoal-800 dark:text-zinc-300 hover:bg-cream-200 dark:hover:bg-charcoal-800 transition-colors border border-cream-200/60 dark:border-charcoal-800"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Quick Add Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 bg-terracotta-500 hover:bg-terracotta-600 dark:bg-terracotta-600 dark:hover:bg-terracotta-500 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-95 ml-1"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Prenda</span>
              <span className="sm:hidden">Prenda</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (Fixed for Mobile Screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-charcoal-950/95 backdrop-blur-xl border-t border-cream-200 dark:border-charcoal-800 px-2 py-2 mobile-bottom-nav flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all relative ${
                isActive 
                  ? "text-terracotta-500 dark:text-terracotta-400 font-bold" 
                  : "text-charcoal-800/60 dark:text-zinc-400 font-normal"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-terracotta-500 dark:bg-terracotta-400 mt-0.5 shadow-glow" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
