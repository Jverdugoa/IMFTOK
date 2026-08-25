"use client";

import React, { useState } from "react";
import { Outfit, Garment } from "@/types";
import { Sparkles, Bookmark, Check, Star, Lightbulb, ShoppingBag, Layers, Eye } from "lucide-react";
import confetti from "canvas-confetti";

interface OutfitCardProps {
  outfit: Outfit;
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  onSaveToLookbook?: (outfit: Outfit) => void;
  isSaved?: boolean;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  onToggleFavorite,
  onRate,
  onSaveToLookbook,
  isSaved = false,
}) => {
  const [savedLocally, setSavedLocally] = useState(isSaved);

  const handleSave = () => {
    setSavedLocally(true);
    onSaveToLookbook?.(outfit);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#C86D51", "#E5DCC5", "#6B8E78"],
    });
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      {/* Header Info */}
      <div className="p-5 sm:p-6 pb-4 border-b border-cream-100 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-700 border border-terracotta-100">
              {outfit.occasion}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cream-100 text-charcoal-800">
              {outfit.weather}
            </span>
            {outfit.colorHarmonyType && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sage-50 text-sage-700">
                {outfit.colorHarmonyType}
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900 leading-snug">
            {outfit.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(outfit.id)}
          className={`p-2.5 rounded-full transition-colors ${
            outfit.isFavorite
              ? "bg-terracotta-500 text-white shadow-xs"
              : "bg-cream-100 hover:bg-cream-200 text-charcoal-800"
          }`}
          title="Marcar como favorito"
        >
          <Bookmark className="w-4 h-4" fill={outfit.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Visual Collage of Outfit Items */}
      <div className="p-5 sm:p-6 bg-cream-50/50">
        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-800/60 block mb-3">
          Prendas Coordinadas ({outfit.items.length}):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {outfit.items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-2xs group flex flex-col"
            >
              <div className="aspect-[4/5] bg-cream-100 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                  {item.category}
                </div>
              </div>
              <div className="p-2 text-center bg-white flex-1 flex flex-col justify-center">
                <span className="text-xs font-semibold text-charcoal-900 line-clamp-1">
                  {item.name}
                </span>
                <span className="text-[10px] text-charcoal-800/60 capitalize truncate">
                  {item.primaryColors.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stylist Rationale & Advice */}
      <div className="p-5 sm:p-6 space-y-4 flex-1">
        {/* Por qué funciona */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-700 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Por qué funciona este look</span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-800/80 leading-relaxed">
            {outfit.stylistRationale}
          </p>
        </div>

        {/* Trucos de Estilismo */}
        {outfit.stylingTips && outfit.stylingTips.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-charcoal-800">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Trucos de Estilista para Llevarlo</span>
            </div>
            <ul className="space-y-1 pl-1">
              {outfit.stylingTips.map((tip, idx) => (
                <li key={idx} className="text-xs text-charcoal-800/70 flex items-start gap-2">
                  <span className="text-terracotta-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prenda Faltante Opcional */}
        {outfit.missingPieceSuggestion && (
          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-2.5">
            <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900/80">
              <span className="font-bold text-amber-950 block">
                Complemento Recomendado (Opcional): {outfit.missingPieceSuggestion.name}
              </span>
              {outfit.missingPieceSuggestion.reason}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions & Rating */}
      <div className="px-5 sm:px-6 py-4 border-t border-cream-200 bg-cream-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-charcoal-800/60 mr-1 font-medium">Califica:</span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRate(outfit.id, star)}
              className="p-1 text-amber-400 hover:scale-110 transition-transform"
            >
              <Star
                className="w-4 h-4"
                fill={(outfit.rating || 5) >= star ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        {/* Save to Lookbook */}
        {onSaveToLookbook && (
          <button
            type="button"
            onClick={handleSave}
            disabled={savedLocally}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              savedLocally
                ? "bg-sage-100 text-sage-700 border border-sage-200"
                : "bg-charcoal-900 hover:bg-charcoal-800 text-white shadow-xs"
            }`}
          >
            {savedLocally ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{savedLocally ? "Guardado en Lookbook" : "Guardar este Look"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
