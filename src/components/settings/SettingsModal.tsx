"use client";

import React, { useState } from "react";
import { AIConfig, AIProvider } from "@/types";
import { StorageService } from "@/lib/storage";
import { X, Key, Cpu, Sparkles, Download, Upload, RotateCcw, Check, ShieldAlert } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIConfig;
  onSaveConfig: (config: AIConfig) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetData,
}) => {
  const [provider, setProvider] = useState<AIProvider>(config.provider || "auto");
  const [geminiKey, setGeminiKey] = useState(config.geminiKey || "");
  const [openaiKey, setOpenaiKey] = useState(config.openaiKey || "");
  const [groqKey, setGroqKey] = useState(config.groqKey || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: AIConfig = {
      provider,
      geminiKey: geminiKey.trim() || undefined,
      openaiKey: openaiKey.trim() || undefined,
      groqKey: groqKey.trim() || undefined,
    };
    onSaveConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleExportJSON = () => {
    const data = {
      profile: StorageService.getProfile(),
      garments: StorageService.getGarments(),
      outfits: StorageService.getOutfits(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guardarropa_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (json.garments) StorageService.saveGarments(json.garments);
          if (json.profile) StorageService.saveProfile(json.profile);
          if (json.outfits) {
            localStorage.setItem("estilista_outfits", JSON.stringify(json.outfits));
          }
          alert("¡Datos de guardarropa restaurados con éxito!");
          window.location.reload();
        } catch {
          alert("Error al leer el archivo JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-charcoal-900 text-white flex items-center justify-center">
              <Cpu className="w-4 h-4 text-terracotta-500" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-tight">
                Configuración de IA & Datos
              </h3>
              <p className="text-xs text-charcoal-800/60">
                Selecciona tu proveedor de visión y estilismo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-cream-200 text-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-2">
              Motor de Inteligencia Artificial
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "auto", label: "Automático / Híbrido", desc: "Usa API disponible o fallback inteligente" },
                { id: "gemini", label: "Google Gemini 2.0", desc: "Visión multimodal rápida y precisa" },
                { id: "openai", label: "OpenAI GPT-4o-mini", desc: "Excelente análisis y estilismo" },
                { id: "groq", label: "Groq (Llama 3.2/3.3)", desc: "Inferencia ultraveloz de código abierto" },
              ].map((p) => {
                const active = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProvider(p.id as AIProvider)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      active
                        ? "border-terracotta-500 bg-terracotta-50/50 ring-1 ring-terracotta-500"
                        : "border-cream-200 bg-cream-50/50 hover:bg-cream-100"
                    }`}
                  >
                    <span className="text-xs font-bold text-charcoal-900 block mb-0.5">
                      {p.label}
                    </span>
                    <span className="text-[10px] text-charcoal-800/60 leading-tight">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Keys inputs */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                <Key className="w-3.5 h-3.5 text-terracotta-500" /> Google Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                <Key className="w-3.5 h-3.5 text-charcoal-800" /> OpenAI API Key
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                <Key className="w-3.5 h-3.5 text-amber-600" /> Groq API Key
              </label>
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <p className="text-[11px] text-charcoal-800/60">
              🔒 Las claves de API se guardan en el almacenamiento local de tu navegador y también pueden definirse en Vercel como variables de entorno (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`). Si no ingresas clave, la app operará con el motor de reglas de estilismo integrado.
            </p>
          </div>

          {/* Backup & Import */}
          <div className="pt-4 border-t border-cream-200 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-800 block">
              Copia de Seguridad & Restauración
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 text-xs font-medium border border-cream-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Guardarropa (JSON)</span>
              </button>

              <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-charcoal-800 text-xs font-medium border border-cream-200 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Importar Respaldo</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm("¿Reiniciar guardarropa y perfil a los valores de muestra originales?")) {
                    onResetData();
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer Ejemplo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-200 flex items-center justify-between bg-cream-50/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 px-3 py-1.5"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : null}
            <span>{savedSuccess ? "Guardado" : "Guardar Cambios"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
