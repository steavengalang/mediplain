import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

export const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3-flash-preview",
] as const;

export function getGeminiApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_api_key_here") {
    return null;
  }
  return apiKey;
}

function isFatalAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("api key not valid") ||
    lower.includes("api_key_invalid") ||
    lower.includes("permission_denied")
  );
}

export async function generateWithGeminiFallback(
  apiKey: string,
  params: Omit<GenerateContentParameters, "model">
) {
  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });
  const triedModels = new Set<string>();
  const modelErrors: string[] = [];

  for (const model of GEMINI_MODELS) {
    triedModels.add(model);
    try {
      return await ai.models.generateContent({
        ...params,
        model,
      });
    } catch (modelError) {
      const msg =
        modelError instanceof Error ? modelError.message : String(modelError);
      console.warn(`MediPlain Gemini model "${model}" failed:`, msg);
      modelErrors.push(`${model}: ${msg}`);

      if (isFatalAuthError(msg)) {
        throw modelError;
      }
    }
  }

  // Last-resort dynamic discovery in case account routing exposes a different Flash model ID.
  try {
    const pager = await ai.models.list({ config: { pageSize: 50 } });
    const discoveredFlashModels = pager.page
      .map((m) => ({
        id: (m.name ?? "").replace(/^models\//, ""),
        actions: m.supportedActions ?? [],
      }))
      .filter(
        (m) =>
          m.id.startsWith("gemini-") &&
          m.id.includes("flash") &&
          !m.id.includes("tts") &&
          !m.id.includes("image") &&
          !m.id.includes("live") &&
          !m.id.includes("2.0") &&
          !m.id.includes("2.5") &&
          !triedModels.has(m.id) &&
          (m.actions.length === 0 || m.actions.includes("generateContent"))
      )
      .slice(0, 2);

    for (const candidate of discoveredFlashModels) {
      try {
        return await ai.models.generateContent({
          ...params,
          model: candidate.id,
        });
      } catch (discoveredError) {
        const msg =
          discoveredError instanceof Error
            ? discoveredError.message
            : String(discoveredError);
        console.warn(
          `MediPlain discovered model "${candidate.id}" failed:`,
          msg
        );
        modelErrors.push(`${candidate.id}: ${msg}`);
      }
    }
  } catch (listError) {
    const msg =
      listError instanceof Error ? listError.message : String(listError);
    modelErrors.push(`models.list: ${msg}`);
  }

  throw new Error(modelErrors.join(" | ") || "All Gemini models failed.");
}
