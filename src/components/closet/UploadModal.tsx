"use client";

import React, { useState, useRef } from "react";
import { Garment, GarmentCategory, Season, AIConfig } from "@/types";
import { AIStylistService } from "@/lib/ai-stylist";
import { COLOR_HEX_MAP } from "@/lib/color-theory";
import { X, UploadCloud, Camera, Sparkles, Loader2, Check, Tag } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (garment: Garment) => void;
  aiConfig: AIConfig;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  aiConfig,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState<GarmentCategory>("top");
  const [subcategory, setSubcategory] = useState("Camisa");
  const [primaryColors, setPrimaryColors] = useState<string[]>(["Blanco"]);
  const [colorInput, setColorInput] = useState("");
  const [pattern, setPattern] = useState("Liso / Sólido");
  const [silhouette, setSilhouette] = useState("Corte Recto");
  const [formalityLevel, setFormalityLevel] = useState<number>(3);
  const [seasons, setSeasons] = useState<Season[]>(["todas"]);
  const [aiTags, setAiTags] = useState<string[]>(["Esencial", "Básico"]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        triggerAIAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerAIAnalysis = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    setAnalysisStep("Analizando corte, color y silueta con IA...");

    try {
      const result = await AIStylistService.analyzeGarmentImage(imageDataUrl, aiConfig);

      if (result) {
        setName(result.name || "Prenda Nueva");
        setCategory(result.category || "top");
        setSubcategory(result.subcategory || "Prenda de vestir");
        setPrimaryColors(result.primaryColors?.length ? result.primaryColors : ["Neutro"]);
        setPattern(result.pattern || "Liso / Sólido");
        setSilhouette(result.silhouette || "Corte Recto");
        setFormalityLevel(result.formalityLevel || 3);
        setSeasons(result.seasons?.length ? result.seasons : ["todas"]);
        setAiTags(result.aiTags?.length ? result.aiTags : ["Escaneado IA"]);
      }
    } catch (err) {
      console.error("AI Analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep("");
    }
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !primaryColors.includes(colorInput.trim())) {
      setPrimaryColors([...primaryColors, colorInput.trim()]);
      setColorInput("");
    }
  };

  const handleRemoveColor = (col: string) => {
    setPrimaryColors(primaryColors.filter((c) => c !== col));
  };

  const toggleSeason = (season: Season) => {
    if (seasons.includes(season)) {
      if (seasons.length > 1) setSeasons(seasons.filter((s) => s !== season));
    } else {
      setSeasons([...seasons, season]);
    }
  };

  const handleSave = () => {
    if (!imagePreview) {
      alert("Por favor sube o toma una foto de la prenda primero.");
      return;
    }
    if (!name.trim()) {
      alert("Por favor ingresa un nombre corto para tu prenda.");
      return;
    }

    const hexes = primaryColors.map((c) => {
      const lower = c.toLowerCase().trim();
      return COLOR_HEX_MAP[lower] || "#71717A";
    });

    const newGarment: Garment = {
      id: `garment-${Date.now()}`,
      name: name.trim(),
      imageUrl: imagePreview,
      category,
      subcategory: subcategory.trim() || "Prenda",
      primaryColors,
      colorHexes: hexes,
      pattern,
      silhouette,
      seasons,
      formalityLevel,
      aiTags,
      createdAt: new Date().toISOString(),
      wearCount: 0,
    };

    onSave(newGarment);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setImagePreview(null);
    setName("");
    setPrimaryColors(["Blanco"]);
    setAiTags(["Esencial"]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-terracotta-50 flex items-center justify-center text-terracotta-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900 leading-tight">
                Registrar Nueva Prenda
              </h3>
              <p className="text-xs text-charcoal-800/60">
                Fase 2: Análisis por visión artificial y etiquetado
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

        {/* Content Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Image Upload Box */}
          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cream-300 hover:border-terracotta-500 rounded-3xl p-8 text-center cursor-pointer bg-cream-50/40 hover:bg-terracotta-50/20 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 rounded-full bg-cream-100 group-hover:bg-terracotta-100 flex items-center justify-center mx-auto mb-3 text-terracotta-500 transition-colors">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-charcoal-900 mb-1">
                Sube una foto o tómala desde tu cámara
              </h4>
              <p className="text-xs text-charcoal-800/60 max-w-sm mx-auto">
                La IA identificará automáticamente el tipo de prenda, color, silueta y ocasión para tu guardarropa.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-900 text-white text-xs font-semibold">
                <Camera className="w-3.5 h-3.5" />
                <span>Seleccionar Archivo / Tomar Foto</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-5 items-start bg-cream-50/60 p-4 rounded-2xl border border-cream-200">
              <div className="relative w-32 h-40 rounded-xl overflow-hidden bg-cream-200 shrink-0 border border-black/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Prenda"
                  className="w-full h-full object-cover"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-charcoal-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-terracotta-500 mb-1" />
                    <span className="text-[10px] leading-tight font-medium">
                      Escaneando con IA...
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                    Foto Cargada
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-terracotta-500 font-semibold hover:underline"
                  >
                    Cambiar foto
                  </button>
                </div>
                <p className="text-xs text-charcoal-800/70">
                  {isAnalyzing
                    ? analysisStep
                    : "✨ Los atributos de la prenda han sido detectados automáticamente. Puedes afinarlos a continuación."}
                </p>
              </div>
            </div>
          )}

          {/* Form Fields for AI Output */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                Nombre corto de la prenda (ej: &quot;Camisa azul rayas&quot;)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre descriptivo de la prenda"
                className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Categoría Principal
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                >
                  <option value="top">Superior (Camisa, Blusa, Camiseta, Suéter)</option>
                  <option value="bottom">Inferior (Pantalón, Jeans, Falda, Short)</option>
                  <option value="outerwear">Abrigo (Blazer, Chaqueta, Trench, Cazadora)</option>
                  <option value="footwear">Calzado (Sneakers, Mocasines, Botas, Tacones)</option>
                  <option value="accessory">Accesorio (Bolso, Cinturón, Bufanda, Reloj)</option>
                  <option value="one_piece">Enterizo / Vestido</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Subcategoría / Tipo
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="ej: Blazer, Pantalón sastre, Sneakers..."
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1.5">
                Colores Principales
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {primaryColors.map((col) => (
                  <span
                    key={col}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 text-xs font-medium text-charcoal-900 border border-cream-200"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full border border-black/20"
                      style={{ backgroundColor: COLOR_HEX_MAP[col.toLowerCase()] || "#888" }}
                    />
                    <span>{col}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(col)}
                      className="text-charcoal-800/60 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColor())}
                  placeholder="Añadir color (ej: Beige, Azul, Terracota)"
                  className="flex-1 px-4 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-charcoal-900 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-4 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-xs font-semibold text-charcoal-900"
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Silhouette & Formality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Corte / Silueta
                </label>
                <select
                  value={silhouette}
                  onChange={(e) => setSilhouette(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-cream-50 border border-cream-200 text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
                >
                  <option value="Ajustado / Slim">Ajustado / Slim</option>
                  <option value="Corte Recto">Corte Recto</option>
                  <option value="Holgado / Oversized">Holgado / Oversized</option>
                  <option value="Tiro Alto">Tiro Alto / Estructurado</option>
                  <option value="Cropped">Cropped / Corto</option>
                  <option value="Fluido / Suelto">Fluido / Suelto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Nivel de Formalidad: {formalityLevel} / 5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formalityLevel}
                  onChange={(e) => setFormalityLevel(Number(e.target.value))}
                  className="w-full accent-terracotta-500 mt-2"
                />
                <div className="flex justify-between text-[10px] text-charcoal-800/60 mt-1 font-medium">
                  <span>1 (Casual/Gym)</span>
                  <span>3 (Smart Casual)</span>
                  <span>5 (Gala/Formal)</span>
                </div>
              </div>
            </div>

            {/* Seasons */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1.5">
                Temporada Recomendada
              </label>
              <div className="flex flex-wrap gap-2">
                {(["primavera", "verano", "otono", "invierno", "todas"] as Season[]).map((s) => {
                  const active = seasons.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSeason(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                        active
                          ? "bg-charcoal-900 text-white"
                          : "bg-cream-100 text-charcoal-800 hover:bg-cream-200"
                      }`}
                    >
                      {s} {active && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-cream-200 flex items-center justify-between bg-cream-50/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-charcoal-800 hover:text-charcoal-900 px-4 py-2"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!imagePreview || isAnalyzing}
            onClick={handleSave}
            className="flex items-center gap-2 bg-terracotta-500 hover:bg-terracotta-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Guardar en mi Guardarropa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
