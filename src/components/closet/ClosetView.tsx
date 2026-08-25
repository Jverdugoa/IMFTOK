"use client";

import React, { useState, useMemo } from "react";
import { Garment, GarmentCategory, Season } from "@/types";
import { GarmentCard } from "./GarmentCard";
import { Plus, Search, Filter, Shirt, Sparkles, SlidersHorizontal } from "lucide-react";

interface ClosetViewProps {
  garments: Garment[];
  onOpenUpload: () => void;
  onDeleteGarment: (id: string) => void;
  onIncrementWear: (garment: Garment) => void;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "Todas las Prendas" },
  { id: "top", label: "Superiores" },
  { id: "bottom", label: "Inferiores" },
  { id: "outerwear", label: "Abrigos" },
  { id: "footwear", label: "Calzado" },
  { id: "accessory", label: "Accesorios" },
  { id: "one_piece", label: "Enterizos" },
];

export const ClosetView: React.FC<ClosetViewProps> = ({
  garments,
  onOpenUpload,
  onDeleteGarment,
  onIncrementWear,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeason, setSelectedSeason] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredGarments = useMemo(() => {
    return garments.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // Season filter
      if (selectedSeason !== "all" && !item.seasons.includes(selectedSeason as Season) && !item.seasons.includes("todas")) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSub = item.subcategory.toLowerCase().includes(q);
        const matchesColor = item.primaryColors.some((c) => c.toLowerCase().includes(q));
        const matchesTag = item.aiTags?.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesSub || matchesColor || matchesTag;
      }
      return true;
    });
  }, [garments, selectedCategory, selectedSeason, searchQuery]);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-cream-200 shadow-soft">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-500 block mb-1">
            Mi Guardarropa Inteligente
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal-900 leading-tight">
            Inventario de Estilo ({garments.length} prendas)
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-800/60 mt-1">
            Explora tus piezas registradas, sube fotos nuevas y organízalas por temporada o corte.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center justify-center gap-2 bg-charcoal-900 hover:bg-charcoal-800 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-terracotta-500" />
          <span>Subir Foto de Prenda</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count = cat.id === "all" ? garments.length : garments.filter((g) => g.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-charcoal-900 text-white shadow-sm"
                    : "bg-white text-charcoal-800/80 hover:bg-cream-100 border border-cream-200"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-charcoal-800 text-cream-100" : "bg-cream-200 text-charcoal-800"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Season Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-800/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, color (ej: beige, azul), corte o prenda..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-cream-200 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-white border border-cream-200 text-xs sm:text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
            >
              <option value="all">Todas las Temporadas</option>
              <option value="primavera">Primavera</option>
              <option value="verano">Verano</option>
              <option value="otono">Otoño</option>
              <option value="invierno">Invierno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Garments Grid */}
      {filteredGarments.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Quick Add Garment Card */}
          <div
            onClick={onOpenUpload}
            className="aspect-[4/5] rounded-2xl border-2 border-dashed border-cream-300 hover:border-terracotta-500 bg-cream-50/40 hover:bg-terracotta-50/20 transition-all flex flex-col items-center justify-center p-4 text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-cream-200 group-hover:bg-terracotta-100 flex items-center justify-center text-charcoal-800 group-hover:text-terracotta-500 transition-colors mb-2">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors">
              Añadir Otra Prenda
            </span>
            <span className="text-[11px] text-charcoal-800/60 mt-0.5">
              Sube foto o usa cámara
            </span>
          </div>

          {filteredGarments.map((garment) => (
            <GarmentCard
              key={garment.id}
              garment={garment}
              onDelete={onDeleteGarment}
              onIncrementWear={onIncrementWear}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-800/40">
            <Shirt className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">
              No se encontraron prendas
            </h3>
            <p className="text-xs text-charcoal-800/60 mt-1">
              Prueba cambiando los filtros de categoría o sube tu primera foto de ropa.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Prenda Ahora</span>
          </button>
        </div>
      )}
    </div>
  );
};
