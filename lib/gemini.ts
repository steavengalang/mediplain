import { NextResponse } from "next/server";
import { GoogleGenAI, type GenerateContentParameters } from "@google/genai";

export const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-3.6-flash",
  "gemini-3-flash",
] as const;

const TOTAL_BUDGET_MS = 45_000;
const PER_ATTEMPT_TIMEOUT_MS = 12_000;
const RETRY_DELAY_MS = 800;

export const HIGH_DEMAND_MESSAGE =
  "The AI service is experiencing a brief traffic spike. Please wait a few seconds and try again.";

export class GeminiServiceUnavailableError extends Error {
  constructor() {
    super(HIGH_DEMAND_MESSAGE);
    this.name = "GeminiServiceUnavailableError";
  }
}

export function getGeminiApiKey(): string | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_api_key_here") {
    return null;
  }
  return apiKey;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatus(error: unknown): number | null {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }
  return null;
}

function isFatalAuthError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("api key not valid") ||
    lower.includes("api_key_invalid") ||
    lower.includes("permission_denied")
  );
}

function is503Error(error: unknown, message: string): boolean {
  const status = getErrorStatus(error);
  if (status === 503) return true;
  const lower = message.toLowerCase();
  return (
    lower.includes("503") ||
    lower.includes("unavailable") ||
    lower.includes("high demand") ||
    lower.includes("overloaded")
  );
}

function is429Error(error: unknown, message: string): boolean {
  const status = getErrorStatus(error);
  if (status === 429) return true;
  const lower = message.toLowerCase();
  return lower.includes("429") || lower.includes("resource_exhausted");
}

export async function generateWithGeminiFallback(
  apiKey: string,
  params: Omit<GenerateContentParameters, "model">
) {
  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  const modelErrors: string[] = [];
  let transient503Count = 0;
  let attempts = 0;

  for (let i = 0; i < GEMINI_MODELS.length; i++) {
    const model = GEMINI_MODELS[i];
    const remainingMs = deadline - Date.now();
    if (remainingMs < 3_000) {
      modelErrors.push(`${model}: skipped due to server time budget`);
      break;
    }

    attempts += 1;
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

      const hit503 = is503Error(modelError, msg);
      const hit429 = is429Error(modelError, msg);
      if (hit503) {
        transient503Count += 1;
      }

      const hasNextModel = i < GEMINI_MODELS.length - 1;
      if ((hit503 || hit429) && hasNextModel) {
        const msLeft = deadline - Date.now();
        if (msLeft > RETRY_DELAY_MS + 3_000) {
          await sleep(RETRY_DELAY_MS);
        }
      }
    }
  }

  console.error("MediPlain all Gemini models failed:", modelErrors.join(" | "));

  if (attempts > 0 && transient503Count === attempts) {
    throw new GeminiServiceUnavailableError();
  }

  throw new Error(
    "The AI service could not complete this request right now. Please try again."
  );
}

export function createGeminiErrorResponse(routeLabel: string, error: unknown) {
  console.error(`MediPlain ${routeLabel} error:`, error);

  if (error instanceof GeminiServiceUnavailableError) {
    return NextResponse.json({ error: error.message }, { status: 503 });
  }

  const rawMessage =
    error instanceof Error ? error.message : String(error ?? "");
  if (is503Error(error, rawMessage)) {
    return NextResponse.json(
      { error: HIGH_DEMAND_MESSAGE },
      { status: 503 }
    );
  }

  if (isFatalAuthError(rawMessage)) {
    return NextResponse.json(
      { error: "Server API key configuration is invalid." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error:
        "The AI service could not complete this request right now. Please try again.",
    },
    { status: 500 }
  );
}
