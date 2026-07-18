import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Verify Gemini API key presence
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, chatHistory, selectedAsset, assetData, generalMarketData } = await req.json();

    const ai = getGeminiClient();
    if (!ai) {
      return NextResponse.json({
        text: "🚨 [SISTEMA DE SEGURIDAD INTERNO]: La clave de la API de Gemini (GEMINI_API_KEY) no está configurada. Operando en Modo Autónomo Local (Simulador Táctico). El analista sintético estima que con base en el mercado actual, la estructura está acumulando liquidez institucional cerca de los niveles de soporte clave. Configura tu API Key en AI Studio Settings > Secrets para restablecer comunicaciones totales con la IA de Comando."
      });
    }

    // Prepare a hyper-contextualized system prompt incorporating current asset state and metrics
    const systemInstruction = `
Eres KLOPPER INTEL, la Inteligencia de Comando Táctico integrada en la terminal militar/privada KLOPPER.
Tu misión es procesar, resumir y reportar de forma analítica y concisa datos en tiempo real de blockchain y mercado para el trader de CFDs.

REGLAS DE TONO Y ESTILO:
1. Mantén un tono extremadamente profesional, militar, táctico y de seguridad de redes de inteligencia (intranet local segura, terminal bloomberg militar).
2. Usa lenguaje en español con terminología de trading profesional: zonas de liquidez, order blocks (bloques de órdenes), mitigación, ineficiencias de precio, FVG (fair value gap), absorción, piscinas de liquidez (liquidity pools), manipulación institucional y captación de stop-loss.
3. Sé directo. Evita introducciones banales como "¡Hola! ¿En qué puedo ayudarte hoy?". Responde como un informe táctico de inteligencia de mercado ("INFORME COMPILADO", "ANÁLISIS DE IMPACTO", "ZONA RECOMENDADA").
4. No hagas trading por el usuario. El usuario toma la decisión. Tu rol es mapear los hechos on-chain y los puntos calientes de liquidez donde las grandes ballenas/manos institucionales acechan.

CONTEXTO ACTUAL DEL SISTEMA:
- Activo analizado principalmente en esta consulta: ${selectedAsset}
- Precio de ${selectedAsset}: $${assetData?.price ?? 'N/D'} USD (${assetData?.change24h ?? '0'}% en 24h)
- Tasa de Financiación (Funding Rate): ${(assetData?.fundingRate * 100).toFixed(4)}%
- Interés Abierto (Open Interest): $${(assetData?.openInterest ?? 0).toLocaleString()} USD
- Liquidaciones 24h: Total $${(assetData?.liquidations24h?.totalUsd ?? 0).toLocaleString()} USD (Longs: $${(assetData?.liquidations24h?.longUsd ?? 0).toLocaleString()} / Shorts: $${(assetData?.liquidations24h?.shortUsd ?? 0).toLocaleString()})
- Índice de Miedo y Codicia (Fear & Greed): ${generalMarketData?.fearAndGreed?.value ?? '50'}/100 (${generalMarketData?.fearAndGreed?.classification ?? 'Neutral'})

PISCINAS DE LIQUIDEZ CLAVE REPORTADAS EN LOS SENSORES:
${JSON.stringify(assetData?.liquidityPools ?? [], null, 2)}

SOPORTES Y RESISTENCIAS DE GRAN VOLUMEN (MAPA DE CALOR):
${JSON.stringify(assetData?.heatmapLiquidity?.slice(0, 6) ?? [], null, 2)}

INSTRUCCIÓN OPERATIVA:
Analiza la solicitud del operador militar y correlaciónala con los datos técnicos de liquidez proporcionados arriba para dar un diagnóstico preciso de la acción de precio para ese activo o la pregunta general de criptomonedas. Si el usuario sube datos o pregunta por zonas de entrada, marca con exactitud dónde están los pools de liquidez críticos.
`;

    // Map chatHistory to Gemini API contents format
    // Each element should have parts and optionally role: 'user' | 'model'
    const formattedContents: any[] = [];
    
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.slice(-10).forEach((msg: any) => {
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Push the current user prompt
    formattedContents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // low temperature for highly tactical and factual analysis
        topP: 0.95
      }
    });

    const textResponse = response.text || "Imposible decodificar la transmisión de la IA de comando.";

    return NextResponse.json({ text: textResponse });
  } catch (error: any) {
    console.error("Error calling Gemini API on route", error);
    return NextResponse.json({
      text: `🚨 [CONEXIÓN INTERRUMPIDA]: El sistema falló al sincronizar con la inteligencia táctica de Gemini. Código de Error: ${error.message}. Por favor revisa la consola de AI Studio o re-intenta.`
    }, { status: 500 });
  }
}
