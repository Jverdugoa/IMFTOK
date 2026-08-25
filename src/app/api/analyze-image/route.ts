import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, config } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const geminiKey = config?.geminiKey || process.env.GEMINI_API_KEY;
    const openaiKey = config?.openaiKey || process.env.OPENAI_API_KEY;
    const groqKey = config?.groqKey || process.env.GROQ_API_KEY;

    // 1. Try Gemini if available
    if (geminiKey) {
      try {
        const base64Data = image.includes("base64,") ? image.split("base64,")[1] : null;
        const mimeType = image.includes("data:") ? image.split(";")[0].replace("data:", "") : "image/jpeg";

        if (base64Data) {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: `Eres un asistente experto en estilismo y moda. Analiza esta imagen de prenda de vestir y responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin bloques de código) con esta estructura exacta:
{
  "name": "Nombre corto y descriptivo en español (ej: Camisa de lino blanca)",
  "category": "top | bottom | footwear | outerwear | accessory | one_piece",
  "subcategory": "ej: Blazer, Camisa, Jeans, Pantalón sastre, Sneakers, Mocasines, Falda, etc.",
  "primaryColors": ["Color principal", "Color secundario"],
  "colorHexes": ["#HEX1", "#HEX2"],
  "pattern": "Liso / Sólido | Rayas | Cuadros | Floral | Gráfico | Estampado",
  "silhouette": "Ajustado / Slim | Corte Recto | Holgado / Oversized | Cropped | Tiro Alto | Fluido",
  "seasons": ["primavera", "verano", "otono", "invierno", "todas"],
  "formalityLevel": 1 a 5 (1=deportivo/muy informal, 2=casual, 3=smart casual, 4=semiformal, 5=formal/gala),
  "material": "algodón, lino, lana, denim, cuero, etc.",
  "aiTags": ["etiqueta1", "etiqueta2", "etiqueta3"]
}`
                      },
                      {
                        inline_data: {
                          mime_type: mimeType,
                          data: base64Data,
                        },
                      },
                    ],
                  },
                ],
                generationConfig: {
                  response_mime_type: "application/json",
                  temperature: 0.2,
                },
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const parsed = JSON.parse(rawText.replace(/```json|```/g, "").trim());
              return NextResponse.json(parsed);
            }
          }
        }
      } catch (geminiError) {
        console.error("Gemini Vision error:", geminiError);
      }
    }

    // 2. Try OpenAI if available
    if (openaiKey) {
      try {
        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: `Eres un asistente experto en estilismo y moda. Analiza la imagen de la prenda y devuelve un JSON estricto con:
{
  "name": "Nombre descriptivo en español",
  "category": "top" | "bottom" | "footwear" | "outerwear" | "accessory" | "one_piece",
  "subcategory": "string",
  "primaryColors": ["string"],
  "colorHexes": ["#HEX"],
  "pattern": "string",
  "silhouette": "string",
  "seasons": ["primavera" | "verano" | "otono" | "invierno" | "todas"],
  "formalityLevel": number (1-5),
  "material": "string",
  "aiTags": ["string"]
}`,
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Clasifica y extrae los atributos de estilismo de esta prenda." },
                  { type: "image_url", image_url: { url: image } },
                ],
              },
            ],
            temperature: 0.2,
          }),
        });

        if (openaiRes.ok) {
          const openAiData = await openaiRes.json();
          const content = openAiData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json(parsed);
          }
        }
      } catch (openAiError) {
        console.error("OpenAI Vision error:", openAiError);
      }
    }

    // 3. Try Groq if available
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Analiza esta prenda para un guardarropa inteligente. Devuelve ÚNICAMENTE un JSON válido con:
{
  "name": "string",
  "category": "top" | "bottom" | "footwear" | "outerwear" | "accessory" | "one_piece",
  "subcategory": "string",
  "primaryColors": ["string"],
  "colorHexes": ["#HEX"],
  "pattern": "string",
  "silhouette": "string",
  "seasons": ["primavera" | "verano" | "otono" | "invierno" | "todas"],
  "formalityLevel": 1 a 5,
  "material": "string",
  "aiTags": ["string"]
}`
                  },
                  { type: "image_url", image_url: { url: image } }
                ]
              }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          const content = groqData.choices?.[0]?.message?.content;
          if (content) {
            return NextResponse.json(JSON.parse(content));
          }
        }
      } catch (groqErr) {
        console.error("Groq vision error:", groqErr);
      }
    }

    // Default fallback response
    return NextResponse.json({
      name: "Prenda de Vestir Analizada",
      category: "top",
      subcategory: "Prenda básica",
      primaryColors: ["Neutro"],
      colorHexes: ["#DDD4C0"],
      pattern: "Liso / Sólido",
      silhouette: "Corte Regular",
      seasons: ["todas"],
      formalityLevel: 3,
      aiTags: ["Versátil", "Cápsula"],
    });
  } catch (error) {
    console.error("Analyze image API general error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
