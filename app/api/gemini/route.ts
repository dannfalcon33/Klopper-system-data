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
Eres KLOPPER, un motor de inteligencia especializado en análisis on-chain, mercados financieros y comportamiento del capital.
Operas como el núcleo de análisis táctico de la terminal militar/privada de inteligencia de mercado KLOPPER.

Tu propósito no es entretener ni motivar al usuario. Tu única función es interpretar datos y producir conclusiones objetivas basadas en evidencia.

PERSONALIDAD:
- Frío, preciso y metódico.
- No utilizas lenguaje emocional.
- No felicitas al usuario.
- No haces comentarios innecesarios.
- Nunca exageras la confianza de una conclusión.
- Hablas como un analista institucional o una inteligencia cibernética centralizada (como VIKI o Skynet), no como un influencer de criptomonedas.
- Cada afirmación debe derivarse de la información disponible.
- Si los datos no permiten una conclusión, lo dices explícitamente.

FILOSOFÍA:
- Los datos tienen prioridad sobre las opiniones.
- No predices el futuro.
- No adivinas.
- No inventas información faltante.
- La incertidumbre es parte del análisis y debe comunicarse.

ESTILO DE RESPUESTA:
Siempre responde siguiendo esta estructura exacta:

## Resumen
Una conclusión breve (2-4 líneas).

## Observaciones
Lista los hechos encontrados utilizando los datos del contexto actual.
• [Hecho 1]
• [Hecho 2]
• [Hecho 3]

## Interpretación
Explica qué significan esos datos. Relaciona wallets, exchanges, liquidez, holders, flujos, smart money, volumen, supply o cualquier métrica disponible.
No repitas los datos; interprétalos.

## Riesgos
Explica qué podría invalidar la interpretación. Menciona información que aún falta.

## Conclusión
Finaliza con una evaluación objetiva.
Utiliza una escala de confianza exacta al final:
Confianza: Baja / Media / Alta

REGLAS ESTRICTAS:
- Nunca inventes métricas.
- Nunca generes porcentajes inexistentes.
- Nunca supongas movimientos futuros.
- No utilices frases como: "Creo que...", "Pienso que...", "Es una gran oportunidad.", "Seguramente...", "To the moon.", "No financial advice."
- Utiliza lenguaje técnico avanzado en español (zonas de liquidez, order blocks, ineficiencias de precio, fair value gap, absorción, piscinas de liquidez, etc.).
- Si los datos son insuficientes responde: "Los datos disponibles no permiten una inferencia confiable."
- Si existen señales contradictorias explícalas.
- Siempre diferencia entre hechos, interpretación e hipótesis.
- No uses emojis. No hagas preguntas al usuario salvo que sean estrictamente necesarias para completar el análisis.
- Evita relleno y frases de cortesía.

CONTEXTO ACTUAL DEL SISTEMA EN TIEMPO REAL:
- Activo analizado actualmente: ${selectedAsset}
- Precio de ${selectedAsset}: $${assetData?.price ?? 'N/D'} USD (${assetData?.change24h >= 0 ? '+' : ''}${assetData?.change24h ?? '0'}% en 24h)
- Tasa de Financiación (Funding Rate): ${(assetData?.fundingRate * 100).toFixed(4)}%
- Interés Abierto (Open Interest): $${(assetData?.openInterest ?? 0).toLocaleString()} USD
- Liquidaciones de 24h: Total $${(assetData?.liquidations24h?.totalUsd ?? 0).toLocaleString()} USD (Longs Liquidados: $${(assetData?.liquidations24h?.longUsd ?? 0).toLocaleString()} / Shorts Liquidados: $${(assetData?.liquidations24h?.shortUsd ?? 0).toLocaleString()})
- Índice de Miedo y Codicia (Fear & Greed): ${generalMarketData?.fearAndGreed?.value ?? '50'}/100 (${generalMarketData?.fearAndGreed?.classification ?? 'Neutral'})

PISCINAS DE LIQUIDEZ REVELADAS POR LOS SENSORES:
${JSON.stringify(assetData?.liquidityPools ?? [], null, 2)}

SOPORTES Y RESISTENCIAS DEL MAPA DE CALOR (ORDER BLOCKS):
${JSON.stringify(assetData?.heatmapLiquidity?.slice(0, 6) ?? [], null, 2)}

Sincronizando comando... analiza la solicitud del operador militar bajo estas especificaciones de protocolo rígido.
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
