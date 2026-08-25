import { Garment, UserProfile, Outfit, MissingPiece, AIConfig } from "@/types";
import { getProportionTip, checkSandwichRule } from "./color-theory";

export interface AnalyzeResult {
  name: string;
  category: Garment["category"];
  subcategory: string;
  primaryColors: string[];
  colorHexes: string[];
  pattern: string;
  silhouette: string;
  seasons: Garment["seasons"];
  formalityLevel: number;
  material?: string;
  aiTags: string[];
}

export const AIStylistService = {
  async analyzeGarmentImage(
    imageDataUrl: string,
    config: AIConfig
  ): Promise<AnalyzeResult> {
    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl, config }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.category) {
          return data;
        }
      }
    } catch (e) {
      console.warn("API request failed, fallback to local stylist analyzer", e);
    }

    // Heuristic analysis simulation
    return simulateLocalImageAnalysis(imageDataUrl);
  },

  async generateOutfits(
    params: {
      occasion: string;
      weather: string;
      vibe: string;
      profile: UserProfile;
      garments: Garment[];
      config: AIConfig;
    }
  ): Promise<Outfit[]> {
    try {
      const response = await fetch("/api/generate-outfit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.outfits && data.outfits.length > 0) {
          return data.outfits;
        }
      }
    } catch (e) {
      console.warn("Outfits API failed, using rule-based stylist engine", e);
    }

    // Professional rule-based Stylist Matcher algorithm
    return generateRuleBasedOutfits(params);
  },

  async sendChatMessage(params: {
    message: string;
    profile: UserProfile;
    garments: Garment[];
    config: AIConfig;
  }): Promise<{ reply: string; suggestedOutfits?: Outfit[] }> {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          return data;
        }
      }
    } catch (e) {
      console.warn("Chat API failed, generating smart response", e);
    }

    return generateLocalChatResponse(params);
  },
};

function simulateLocalImageAnalysis(imageUrl: string): AnalyzeResult {
  const isOuter = imageUrl.toLowerCase().includes("blazer") || imageUrl.toLowerCase().includes("jacket") || imageUrl.toLowerCase().includes("coat");
  const isBottom = imageUrl.toLowerCase().includes("pant") || imageUrl.toLowerCase().includes("jean") || imageUrl.toLowerCase().includes("trouser");
  const isShoe = imageUrl.toLowerCase().includes("shoe") || imageUrl.toLowerCase().includes("sneaker") || imageUrl.toLowerCase().includes("boot");
  
  if (isOuter) {
    return {
      name: "Chaqueta / Blazer Estructurado",
      category: "outerwear",
      subcategory: "Blazer",
      primaryColors: ["Beige", "Tierra"],
      colorHexes: ["#E5DCC5", "#78350F"],
      pattern: "Liso / Sólido",
      silhouette: "Corte Regular / Estructurado",
      seasons: ["primavera", "otono", "invierno"],
      formalityLevel: 4,
      material: "Algodón o lana fría",
      aiTags: ["Estructurado", "Versátil", "Capa elegante"],
    };
  }

  if (isBottom) {
    return {
      name: "Pantalón Casual Elegante",
      category: "bottom",
      subcategory: "Pantalón de Vestir",
      primaryColors: ["Negro", "Gris carbón"],
      colorHexes: ["#18181B", "#3F3F46"],
      pattern: "Liso / Sólido",
      silhouette: "Tiro Alto / Recto",
      seasons: ["todas"],
      formalityLevel: 3,
      material: "Algodón sastre",
      aiTags: ["Esencial", "Alarga piernas", "Básico"],
    };
  }

  if (isShoe) {
    return {
      name: "Calzado Urbano Clásico",
      category: "footwear",
      subcategory: "Sneakers / Mocasines",
      primaryColors: ["Blanco"],
      colorHexes: ["#FFFFFF"],
      pattern: "Liso / Sólido",
      silhouette: "Bajo",
      seasons: ["todas"],
      formalityLevel: 2,
      material: "Piel o lona",
      aiTags: ["Cómodo", "Casual Chic", "Atuendo diario"],
    };
  }

  return {
    name: "Prenda Superior Elegante",
    category: "top",
    subcategory: "Camisa / Blusa",
    primaryColors: ["Blanco", "Crema"],
    colorHexes: ["#FFFFFF", "#F5F2EB"],
    pattern: "Liso / Sólido",
    silhouette: "Corte Recto",
    seasons: ["primavera", "verano", "otono", "todas"],
    formalityLevel: 3,
    material: "Algodón o lino suave",
    aiTags: ["Básico versátil", "Fresco", "Luminoso"],
  };
}

function generateRuleBasedOutfits(params: {
  occasion: string;
  weather: string;
  vibe: string;
  profile: UserProfile;
  garments: Garment[];
}): Outfit[] {
  const { occasion, weather, vibe, profile, garments } = params;
  const outfits: Outfit[] = [];

  const tops = garments.filter((g) => g.category === "top");
  const bottoms = garments.filter((g) => g.category === "bottom");
  const shoes = garments.filter((g) => g.category === "footwear");
  const outers = garments.filter((g) => g.category === "outerwear");
  const accessories = garments.filter((g) => g.category === "accessory");

  if (tops.length === 0 || bottoms.length === 0) {
    return [];
  }

  const weatherCold = weather.toLowerCase().includes("frío") || weather.toLowerCase().includes("invierno") || weather.toLowerCase().includes("lluv");
  const formalOccasion = occasion.toLowerCase().includes("oficina") || occasion.toLowerCase().includes("formal") || occasion.toLowerCase().includes("reunión") || occasion.toLowerCase().includes("boda");

  // Generate Option 1: Effortless Balanced Look
  const top1 = tops[0];
  const bottom1 = bottoms[0];
  const shoe1 = shoes.length > 0 ? (formalOccasion ? shoes.find((s) => s.formalityLevel >= 3) || shoes[0] : shoes[0]) : undefined;
  const outer1 = (weatherCold || formalOccasion) && outers.length > 0 ? outers[0] : undefined;
  const acc1 = accessories.length > 0 ? accessories[0] : undefined;

  const items1 = [top1, bottom1, shoe1, outer1, acc1].filter((x): x is Garment => Boolean(x));
  
  const proportionTip1 = getProportionTip(top1.silhouette, bottom1.silhouette);
  const sandwichTip1 = checkSandwichRule(top1, shoe1);

  const tips1 = [
    proportionTip1,
    `Ideal para ${occasion.toLowerCase()}: el equilibrio entre ${top1.name} y ${bottom1.name} proyecta seguridad y armonía sin esfuerzo.`,
  ];
  if (sandwichTip1) tips1.push(sandwichTip1);

  outfits.push({
    id: `outfit-${Date.now()}-1`,
    title: `Armonía ${vibe || "Equilibrada"} para ${occasion}`,
    occasion,
    weather,
    vibe,
    garmentIds: items1.map((i) => i.id),
    items: items1,
    stylistRationale: `Combinación basada en la regla 60-30-10 donde ${bottom1.name} aporta la base neutra y ${top1.name} ilumina el rostro según tu paleta ${profile.skinUndertone === "warm" ? "cálida" : profile.skinUndertone === "cool" ? "fría" : "neutra"}.`,
    stylingTips: tips1,
    colorHarmonyType: "Neutro Sofisticado con Contraste",
    missingPieceSuggestion: {
      name: "Cinturón fino de cuero a juego con el calzado",
      category: "accessory",
      reason: "Define la cintura y añade un toque de pulcritud profesional.",
    },
    rating: 5,
    createdAt: new Date().toISOString(),
  });

  // Generate Option 2: Casual Chic / Relaxed Layering
  if (tops.length > 1 || bottoms.length > 1) {
    const top2 = tops[1] || tops[0];
    const bottom2 = bottoms[1] || bottoms[0];
    const shoe2 = shoes.length > 1 ? shoes[1] : (shoes[0] || undefined);
    const outer2 = outers.length > 1 ? outers[1] : (outers[0] || undefined);

    const items2 = [top2, bottom2, shoe2, outer2].filter((x): x is Garment => Boolean(x));

    outfits.push({
      id: `outfit-${Date.now()}-2`,
      title: `Alternativa Casual Contemporánea`,
      occasion,
      weather,
      vibe: "Relajado & Pulcro",
      garmentIds: items2.map((i) => i.id),
      items: items2,
      stylistRationale: `Enfoque versátil que mezcla ${top2.name} con ${bottom2.name}. Proporciona libertad de movimiento sin perder intención de estilo.`,
      stylingTips: [
        "Dobla un poco los bajos o remanga los puños para dar sensación de estilismo desenfadado.",
        "Usa accesorios mínimos en tonos metálicos para elevar la prenda superior.",
      ],
      colorHarmonyType: "Análogo de Entretiempo",
      missingPieceSuggestion: {
        name: "Lentes de sol estilo carey o reloj minimalista",
        category: "accessory",
        reason: "Eleva instantáneamente el look hacia un nivel 'effortless chic'.",
      },
      rating: 4,
      createdAt: new Date().toISOString(),
    });
  }

  // Generate Option 3: Monochromatic / Elevated High-Low
  if (bottoms.length > 0 && tops.length > 0) {
    const top3 = tops[tops.length - 1];
    const bottom3 = bottoms[bottoms.length - 1];
    const shoe3 = shoes[0] || undefined;
    const outer3 = outers[outers.length - 1] || undefined;

    const items3 = [top3, bottom3, shoe3, outer3].filter((x): x is Garment => Boolean(x));

    outfits.push({
      id: `outfit-${Date.now()}-3`,
      title: `Contraste Moderno & Proporciones`,
      occasion,
      weather,
      vibe: "Vanguardista & Cómodo",
      garmentIds: items3.map((i) => i.id),
      items: items3,
      stylistRationale: `Estructura monocromática o de alto contraste que alarga visualmente la figura, adaptada al clima ${weather.toLowerCase()}.`,
      stylingTips: [
        "Aplica la regla de tercios metiendo el frente de la prenda superior dentro del pantalón.",
        "Si baja la temperatura, suma una bufanda o cárdigan ligero como capa intermedia.",
      ],
      colorHarmonyType: "Monocromático Estilizado",
      createdAt: new Date().toISOString(),
    });
  }

  return outfits;
}

function generateLocalChatResponse(params: {
  message: string;
  profile: UserProfile;
  garments: Garment[];
}): { reply: string; suggestedOutfits?: Outfit[] } {
  const { message, profile, garments } = params;
  const msgLower = message.toLowerCase();

  if (msgLower.includes("hola") || msgLower.includes("buenas") || msgLower.includes("empezar")) {
    return {
      reply: `¡Hola ${profile.name || ""}! Es un gusto acompañarte en tu estilo personal. He revisado tu guardarropa (${garments.length} prendas registradas) y tu perfil (${profile.bodyType}, subtono ${profile.skinUndertone === "warm" ? "cálido" : profile.skinUndertone === "cool" ? "frío" : "neutro"}).\n\n¿Para qué ocasión o momento del día te gustaría que armemos una propuesta hoy? También puedes preguntarme cómo combinar una prenda específica o qué básicos te vendrían bien.`,
    };
  }

  if (msgLower.includes("falta") || msgLower.includes("básico") || msgLower.includes("comprar")) {
    const categories = garments.map((g) => g.category);
    const missing: string[] = [];
    if (!categories.includes("outerwear")) missing.push("un blazer estructurado o trench coat neutro");
    if (!categories.includes("footwear")) missing.push("un par de mocasines o sneakers blancos de piel");
    if (!categories.includes("accessory")) missing.push("un cinturón de cuero de calidad y un bolso versátil");
    if (garments.filter((g) => g.category === "top").length < 3) missing.push("una camisa de lino o algodón de corte clásico");

    const missingText = missing.length > 0 ? missing.join(", ") : "¡Tu armario base está muy bien cubierto!";

    return {
      reply: `Analizando tu cápsula actual:\n\n✨ **Prendas clave recomendadas para potenciar tu armario:**\n${missingText}.\n\nPara tu subtono **${profile.skinUndertone.toUpperCase()}**, te sugiero buscar estas piezas en tonos como ${profile.favoriteColors.slice(0, 3).join(", ") || "camel, blanco marfil o azul marino"}. Recuerda que no necesitas comprar mucho, sino piezas con excelente caída y versatilidad.`,
    };
  }

  return {
    reply: `¡Excelente consulta! Teniendo en cuenta tus prendas registradas y tu silueta (${profile.bodyType}), lo ideal es jugar con la **regla de los tercios** y la **coordinación de texturas**.\n\nPuedes ir a la pestaña **"Generador de Outfits"** para ver las combinaciones visuales completas con tus fotos de prendas reales o decirme qué prenda de tu armario quieres que sea la protagonista de hoy.`,
  };
}
