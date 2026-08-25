import { Garment, UserProfile, Outfit, ChatMessage, AIConfig } from "@/types";
import { DEFAULT_PROFILE, INITIAL_GARMENTS, INITIAL_OUTFITS } from "./default-data";

const KEYS = {
  PROFILE: "estilista_profile",
  GARMENTS: "estilista_garments",
  OUTFITS: "estilista_outfits",
  CHAT: "estilista_chat",
  AI_CONFIG: "estilista_ai_config",
};

export const StorageService = {
  getProfile(): UserProfile {
    if (typeof window === "undefined") return DEFAULT_PROFILE;
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) {
      localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getGarments(): Garment[] {
    if (typeof window === "undefined") return INITIAL_GARMENTS;
    const data = localStorage.getItem(KEYS.GARMENTS);
    if (!data) {
      localStorage.setItem(KEYS.GARMENTS, JSON.stringify(INITIAL_GARMENTS));
      return INITIAL_GARMENTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_GARMENTS;
    }
  },

  saveGarments(garments: Garment[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.GARMENTS, JSON.stringify(garments));
  },

  addGarment(garment: Garment): Garment[] {
    const list = this.getGarments();
    const updated = [garment, ...list];
    this.saveGarments(updated);
    return updated;
  },

  updateGarment(garment: Garment): Garment[] {
    const list = this.getGarments();
    const updated = list.map((g) => (g.id === garment.id ? garment : g));
    this.saveGarments(updated);
    return updated;
  },

  deleteGarment(id: string): Garment[] {
    const list = this.getGarments();
    const updated = list.filter((g) => g.id !== id);
    this.saveGarments(updated);
    return updated;
  },

  getOutfits(): Outfit[] {
    if (typeof window === "undefined") return INITIAL_OUTFITS;
    const data = localStorage.getItem(KEYS.OUTFITS);
    if (!data) {
      localStorage.setItem(KEYS.OUTFITS, JSON.stringify(INITIAL_OUTFITS));
      return INITIAL_OUTFITS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_OUTFITS;
    }
  },

  saveOutfit(outfit: Outfit): Outfit[] {
    const list = this.getOutfits();
    const existing = list.find((o) => o.id === outfit.id);
    let updated: Outfit[];
    if (existing) {
      updated = list.map((o) => (o.id === outfit.id ? outfit : o));
    } else {
      updated = [outfit, ...list];
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.OUTFITS, JSON.stringify(updated));
    }
    return updated;
  },

  toggleFavoriteOutfit(id: string): Outfit[] {
    const list = this.getOutfits();
    const updated = list.map((o) =>
      o.id === id ? { ...o, isFavorite: !o.isFavorite } : o
    );
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.OUTFITS, JSON.stringify(updated));
    }
    return updated;
  },

  rateOutfit(id: string, rating: number): Outfit[] {
    const list = this.getOutfits();
    const updated = list.map((o) => (o.id === id ? { ...o, rating } : o));
    if (typeof window !== "undefined") {
      localStorage.setItem(KEYS.OUTFITS, JSON.stringify(updated));
    }
    return updated;
  },

  getChatMessages(): ChatMessage[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.CHAT);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveChatMessages(messages: ChatMessage[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.CHAT, JSON.stringify(messages));
  },

  clearChat(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEYS.CHAT);
  },

  getAIConfig(): AIConfig {
    if (typeof window === "undefined") return { provider: "auto" };
    const data = localStorage.getItem(KEYS.AI_CONFIG);
    if (!data) return { provider: "auto" };
    try {
      return JSON.parse(data);
    } catch {
      return { provider: "auto" };
    }
  },

  saveAIConfig(config: AIConfig): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.AI_CONFIG, JSON.stringify(config));
  },

  exportWardrobeAsText(): string {
    const garments = this.getGarments();
    const profile = this.getProfile();

    const categoryMap: Record<string, string> = {
      top: "Prendas Superiores",
      bottom: "Prendas Inferiores",
      footwear: "Calzado",
      outerwear: "Abrigos y Chaquetas",
      accessory: "Accesorios",
      one_piece: "Vestidos / Enterizos",
    };

    const grouped: Record<string, Garment[]> = {};
    garments.forEach((g) => {
      if (!grouped[g.category]) grouped[g.category] = [];
      grouped[g.category].push(g);
    });

    let text = `=== MI GUARDARROPA PERSONAL & PERFIL DE ESTILO ===\n\n`;
    text += `👤 PERFIL:\n`;
    text += `- Género/Identidad: ${profile.genderIdentity}\n`;
    text += `- Complexión/Silueta: ${profile.bodyType}\n`;
    text += `- Subtono de Piel: ${profile.skinUndertone.toUpperCase()} (${profile.skinUndertone === "warm" ? "Cálido" : profile.skinUndertone === "cool" ? "Frío" : "Neutro"})\n`;
    text += `- Estilos Preferidos: ${profile.preferredStyles.join(", ")}\n`;
    text += `- Colores Favoritos: ${profile.favoriteColors.join(", ")}\n`;
    text += `- Colores que Evito: ${profile.avoidedColors.join(", ")}\n\n`;

    text += `👗 INVENTARIO DE PRENDAS REGISTRADAS (${garments.length} prendas):\n\n`;

    for (const [catKey, label] of Object.entries(categoryMap)) {
      const items = grouped[catKey] || [];
      if (items.length > 0) {
        text += `📁 ${label} (${items.length}):\n`;
        items.forEach((item, index) => {
          text += `  ${index + 1}. [${item.name}] | Color: ${item.primaryColors.join("/")} | Silueta: ${item.silhouette} | Formalidad: ${item.formalityLevel}/5 | Temporadas: ${item.seasons.join(", ")}\n`;
        });
        text += `\n`;
      }
    }

    text += `=== Fin del Guardarropa ===\n`;
    return text;
  },

  resetToDefaults(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(KEYS.GARMENTS, JSON.stringify(INITIAL_GARMENTS));
    localStorage.setItem(KEYS.OUTFITS, JSON.stringify(INITIAL_OUTFITS));
    localStorage.removeItem(KEYS.CHAT);
  }
};
