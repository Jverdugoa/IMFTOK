"use client";

import React, { useState } from "react";
import { Outfit } from "@/types";
import { OutfitCard } from "../stylist/OutfitCard";
import { BookOpen, Bookmark, Star, Sparkles, Wand2 } from "lucide-react";

interface LookbookViewProps {
  outfits: Outfit[];
  onToggleFavorite: (id: string) => void;
  onRate: (id: string, rating: number) => void;
  onNavigateToStylist: () => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  outfits,
  onToggleFavorite,
  onRate,
  onNavigateToStylist,
}) => {
  const [filterFavorites, setFilterFavorites] = useState(false);

  const displayedOutfits = filterFavorites
    ? outfits.filter((o) => o.isFavorite)
    : outfits;

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-500 block mb-1">
            Mi Colección & Archivo
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
            Lookbook Personal ({outfits.length} looks guardados)
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-800/60 mt-1">
            Revisa tus combinaciones favoritas, califícalas y planifica lo que vestirás.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
              filterFavorites
                ? "bg-terracotta-500 text-white shadow-xs"
                : "bg-cream-100 hover:bg-cream-200 text-charcoal-800 border border-cream-200"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={filterFavorites ? "currentColor" : "none"} />
            <span>Solo Favoritos</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToStylist}
            className="flex items-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xs"
          >
            <Wand2 className="w-4 h-4 text-terracotta-500" />
            <span>Crear Look</span>
          </button>
        </div>
      </div>

      {/* Outfits Grid */}
      {displayedOutfits.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {displayedOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onToggleFavorite={onToggleFavorite}
              onRate={onRate}
              isSaved={true}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-800/40">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              {filterFavorites ? "No tienes looks marcados como favoritos" : "Tu Lookbook está vacío"}
            </h3>
            <p className="text-xs text-charcoal-800/60 mt-1">
              Genera nuevas combinaciones con el Estilista IA y guárdalas aquí para tenerlas a mano.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToStylist}
            className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generar mi Primer Look</span>
          </button>
        </div>
      )}
    </div>
  );
};
