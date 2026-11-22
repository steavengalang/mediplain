import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

export const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
] as const;

export function getGeminiApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_api_key_here") {
    return null;
  }
  return apiKey;
}

export async function generateWithGeminiFallback(
  apiKey: string,
  params: Omit<GenerateContentParameters, "model">
) {
  const ai = new GoogleGenAI({ apiKey });
  let lastError: unknown = null;

  for (const model of GEMINI_MODELS) {
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (modelError) {
      lastError = modelError;
      const msg =
        modelError instanceof Error ? modelError.message : String(modelError);
      console.warn(`MediPlain Gemini model "${model}" failed:`, msg);

      const lowerMsg = msg.toLowerCase();
      if (
        lowerMsg.includes("api key not valid") ||
        lowerMsg.includes("api_key_invalid")
      ) {
        throw modelError;
      }
    }
  }

  throw lastError ?? new Error("All Gemini models failed.");
}
