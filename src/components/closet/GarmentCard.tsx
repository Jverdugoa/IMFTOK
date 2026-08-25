"use client";

import React from "react";
import { Garment } from "@/types";
import { Trash2, Plus, Sparkles, Tag } from "lucide-react";

interface GarmentCardProps {
  garment: Garment;
  onDelete: (id: string) => void;
  onIncrementWear: (garment: Garment) => void;
  onSelect?: (garment: Garment) => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  top: "Superior",
  bottom: "Inferior",
  footwear: "Calzado",
  outerwear: "Abrigo",
  accessory: "Accesorio",
  one_piece: "Enterizo",
};

export const GarmentCard: React.FC<GarmentCardProps> = ({
  garment,
  onDelete,
  onIncrementWear,
  onSelect,
}) => {
  const formalityLabels: Record<number, string> = {
    1: "Muy Casual",
    2: "Casual",
    3: "Smart Casual",
    4: "Semiformal",
    5: "Formal",
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between">
      {/* Image Container */}
      <div 
        onClick={() => onSelect?.(garment)}
        className="relative aspect-[4/5] w-full bg-cream-100 overflow-hidden cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={garment.imageUrl}
          alt={garment.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5 bg-charcoal-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {CATEGORY_NAMES[garment.category] || garment.category}
        </div>

        {/* Formality Badge */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md text-charcoal-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cream-200">
          {formalityLabels[garment.formalityLevel] || `Nivel ${garment.formalityLevel}`}
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-charcoal-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncrementWear(garment);
            }}
            title="Registrar uso de hoy"
            className="bg-white text-charcoal-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-cream-100 transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Usado ({garment.wearCount})</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`¿Eliminar "${garment.name}" de tu guardarropa?`)) {
                onDelete(garment.id);
              }
            }}
            title="Eliminar prenda"
            className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-50 transition-colors shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal-900 leading-snug line-clamp-1">
              {garment.name}
            </h4>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-charcoal-800/70 font-medium">
              {garment.subcategory}
            </span>
            <span className="text-cream-300">•</span>
            <span className="text-xs text-charcoal-800/60">
              {garment.silhouette}
            </span>
          </div>
        </div>

        {/* Colors & Tags */}
        <div className="pt-2 border-t border-cream-100 flex items-center justify-between gap-2">
          {/* Color Dots */}
          <div className="flex items-center gap-1.5">
            {(garment.colorHexes || []).slice(0, 3).map((hex, i) => (
              <div
                key={i}
                title={garment.primaryColors[i] || hex}
                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                style={{ backgroundColor: hex }}
              />
            ))}
            <span className="text-[11px] text-charcoal-800/60 ml-0.5 truncate max-w-[80px]">
              {garment.primaryColors.join(", ")}
            </span>
          </div>

          {/* AI Tag / Season */}
          <div className="flex items-center gap-1 text-[11px] text-charcoal-800/50 bg-cream-100 px-2 py-0.5 rounded-md">
            <Tag className="w-3 h-3 text-terracotta-500" />
            <span className="capitalize">{garment.seasons[0] || "Todas"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
