"use client";

import React, { useState } from "react";
import { Garment, UserProfile } from "@/types";
import { StorageService } from "@/lib/storage";
import { X, Copy, Check, BarChart2, Sparkles, Shirt, Layers, ShieldCheck } from "lucide-react";

interface WardrobeStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  garments: Garment[];
  profile: UserProfile;
}

export const WardrobeStatsModal: React.FC<WardrobeStatsModalProps> = ({
  isOpen,
  onClose,
  garments,
  profile,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const categories = {
    top: garments.filter((g) => g.category === "top"),
    bottom: garments.filter((g) => g.category === "bottom"),
    footwear: garments.filter((g) => g.category === "footwear"),
    outerwear: garments.filter((g) => g.category === "outerwear"),
    accessory: garments.filter((g) => g.category === "accessory"),
    one_piece: garments.filter((g) => g.category === "one_piece"),
  };

  const total = garments.length;
  const summaryText = StorageService.exportWardrobeAsText();

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-700">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-tight">
                Diagnóstico del Guardarropa
              </h3>
              <p className="text-xs text-charcoal-800/60">
                Balance de inventario & Resumen exportable
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
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center">
              <span className="text-2xl font-serif font-bold text-charcoal-900 block">
                {total}
              </span>
              <span className="text-[11px] text-charcoal-800/60 font-semibold uppercase tracking-wider">
                Total Prendas
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center">
              <span className="text-2xl font-serif font-bold text-terracotta-500 block">
                {categories.top.length}
              </span>
              <span className="text-[11px] text-charcoal-800/60 font-semibold uppercase tracking-wider">
                Superiores
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center">
              <span className="text-2xl font-serif font-bold text-sage-700 block">
                {categories.bottom.length}
              </span>
              <span className="text-[11px] text-charcoal-800/60 font-semibold uppercase tracking-wider">
                Inferiores
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-center">
              <span className="text-2xl font-serif font-bold text-charcoal-900 block">
                {categories.footwear.length + categories.outerwear.length}
              </span>
              <span className="text-[11px] text-charcoal-800/60 font-semibold uppercase tracking-wider">
                Calzado & Abrigos
              </span>
            </div>
          </div>

          {/* Capsule Balance Advice */}
          <div className="p-4 rounded-2xl bg-terracotta-50/50 border border-terracotta-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
            <div className="text-xs text-charcoal-800/80">
              <span className="font-bold text-charcoal-900 block mb-0.5">
                Proporción Ideal de Guardarropa Cápsula
              </span>
              Los estilistas recomiendan tener un ratio de <strong>2 a 3 prendas superiores por cada prenda inferior</strong> para maximizar las combinaciones semanales sin saturar el armario.
            </div>
          </div>

          {/* Export Text Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                Lista Resumen de Guardarropa (Para GPT o Respaldos)
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-medium transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "¡Copiado al portapapeles!" : "Copiar Texto"}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={summaryText}
              rows={8}
              className="w-full p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs font-mono text-charcoal-800 focus:outline-none select-all"
            />
            <p className="text-[11px] text-charcoal-800/60 mt-1">
              💡 Puedes pegar este texto formateado en cualquier conversación para transferir tu guardarropa al instante.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-cream-200 flex justify-end bg-cream-50/50">
          <button
            type="button"
            onClick={onClose}
            className="bg-cream-200 hover:bg-cream-300 text-charcoal-900 text-xs font-semibold px-5 py-2.5 rounded-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
