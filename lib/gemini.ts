import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

export const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite",
] as const;

const TOTAL_BUDGET_MS = 45_000;
const PER_ATTEMPT_TIMEOUT_MS = 15_000;

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
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const modelErrors: string[] = [];

  for (const model of GEMINI_MODELS) {
    const remainingMs = deadline - Date.now();
    if (remainingMs < 3_000) {
      modelErrors.push(`${model}: skipped due to server time budget`);
      break;
    }

    const attemptTimeoutMs = Math.min(PER_ATTEMPT_TIMEOUT_MS, remainingMs);

    try {
      return await ai.models.generateContent({
        ...params,
        model,
        config: {
          ...params.config,
          abortSignal: AbortSignal.timeout(attemptTimeoutMs),
        },
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

  throw new Error(modelErrors.join(" | ") || "All Gemini models failed.");
}
