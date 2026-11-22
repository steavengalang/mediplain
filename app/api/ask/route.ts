import { NextRequest, NextResponse } from "next/server";
import { Type, type Schema } from "@google/genai";
import {
  createGeminiErrorResponse,
  generateWithGeminiFallback,
  getGeminiApiKey,
} from "@/lib/gemini";
import type { AskRequestBody, Language } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_LANGUAGES = new Set<Language>(["English", "Indonesian", "Spanish"]);

const askResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description:
        "2 to 4 plain-language sentences answering the question strictly from documentContext, ending with a brief reminder to consult a doctor or pharmacist.",
    },
  },
  required: ["answer"],
};

export async function POST(request: NextRequest) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: Partial<AskRequestBody>;
  try {
    body = (await request.json()) as Partial<AskRequestBody>;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload. Expected JSON body." },
      { status: 400 }
    );
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  const language: Language =
    typeof body.language === "string" &&
    ALLOWED_LANGUAGES.has(body.language as Language)
      ? (body.language as Language)
      : "English";

  if (!question || question.length > 500) {
    return NextResponse.json(
      { error: "Please enter a concise question (1 to 500 characters)." },
      { status: 400 }
    );
  }

  if (!body.documentContext || typeof body.documentContext.title !== "string") {
    return NextResponse.json(
      { error: "Missing document context for this question." },
      { status: 400 }
    );
  }

  const systemInstruction = [
    "You are MediPlain, a careful medical accessibility assistant answering a patient or caregiver's follow-up question.",
    `Respond strictly in ${language} in 2 to 4 plain, 5th-grade reading level sentences.`,
    "Ground your answer strictly in the provided documentContext JSON. Do NOT invent dosages, drug interactions, or medical claims that are not present in documentContext.",
    "If documentContext does not contain enough information to answer safely, clearly state that this document does not specify it.",
    "Always end with a brief, warm reminder to consult their doctor or pharmacist for personalized medical decisions.",
  ].join(" ");

  try {
    const response = await generateWithGeminiFallback(apiKey, {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `documentContext:\n${JSON.stringify(body.documentContext)}\n\nPatient/Caregiver Question: ${question}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: askResponseSchema,
        temperature: 0.2,
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      return NextResponse.json(
        { error: "Could not generate an answer. Please try again." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(rawText) as { answer?: string };
    if (!parsed.answer || !parsed.answer.trim()) {
      return NextResponse.json(
        { error: "Empty response received from Gemini." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer: parsed.answer.trim() }, { status: 200 });
  } catch (error) {
    return createGeminiErrorResponse("/api/ask", error);
  }
}
