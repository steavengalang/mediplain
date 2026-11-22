import { NextRequest, NextResponse } from "next/server";
import { Type, type Schema } from "@google/genai";
import { generateWithGeminiFallback, getGeminiApiKey } from "@/lib/gemini";
import type {
  AnalyzeRequestBody,
  ConfidenceLevel,
  Language,
  MediPlainResult,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_LANGUAGES = new Set<Language>(["English", "Indonesian", "Spanish"]);
const ALLOWED_CONFIDENCE = new Set<ConfidenceLevel>(["High", "Medium", "Low"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description:
        "Clear name of the medication, prescription, or lab report. Set to exactly UNREADABLE_DOCUMENT if the image is blurry, blank, or not a medical document.",
    },
    documentType: {
      type: Type.STRING,
      description:
        "Concise document category in the target language, e.g., Prescription, Medicine Label, or Lab Report.",
    },
    confidenceLevel: {
      type: Type.STRING,
      enum: ["High", "Medium", "Low"],
      description:
        "How clearly the text and dosing details in the image were readable.",
    },
    confidenceNote: {
      type: Type.STRING,
      description:
        "One short plain-language sentence explaining what was clearly readable or partially obscured.",
    },
    simpleSummary: {
      type: Type.STRING,
      description:
        "A warm, clear 2 to 3 sentence explanation written at a 5th-grade reading level.",
    },
    schedule: {
      type: Type.ARRAY,
      description:
        "Daily medication schedule items ONLY if explicitly visible on the document. Return an empty array [] if no dosage schedule is clearly visible or if the document is a lab report.",
      items: {
        type: Type.OBJECT,
        properties: {
          timeOfDay: {
            type: Type.STRING,
            description:
              "Short time label in the target language, such as Morning, Afternoon, Night, or As Needed.",
          },
          instruction: {
            type: Type.STRING,
            description:
              "Plain-language instruction for what to do at this time, including exact dosage and food/water guidance shown.",
          },
        },
        required: ["timeOfDay", "instruction"],
      },
    },
    jargonTranslations: {
      type: Type.ARRAY,
      description:
        "2 to 4 medical abbreviations, lab metrics, or pharmaceutical terms found on the document translated into plain 5th-grade language.",
      items: {
        type: Type.OBJECT,
        properties: {
          term: {
            type: Type.STRING,
            description: "The technical term, abbreviation, or lab value shown on the document.",
          },
          plainMeaning: {
            type: Type.STRING,
            description: "Clear 1-sentence plain meaning at a 5th-grade reading level.",
          },
        },
        required: ["term", "plainMeaning"],
      },
    },
    warnings: {
      type: Type.ARRAY,
      description:
        "Key side effects, interactions, or safety precautions written clearly for a patient or caregiver.",
      items: {
        type: Type.STRING,
      },
    },
    questionsForDoctor: {
      type: Type.ARRAY,
      description:
        "2 to 3 practical, specific questions the patient should ask their doctor or pharmacist.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: [
    "title",
    "documentType",
    "confidenceLevel",
    "confidenceNote",
    "simpleSummary",
    "schedule",
    "jargonTranslations",
    "warnings",
    "questionsForDoctor",
  ],
};

function getTimeOfDayExamples(language: Language): string {
  switch (language) {
    case "Indonesian":
      return "Pagi, Siang, Malam, Bila Perlu";
    case "Spanish":
      return "Mañana, Tarde, Noche, Según Sea Necesario";
    default:
      return "Morning, Afternoon, Night, As Needed";
  }
}

export async function POST(request: NextRequest) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: Partial<AnalyzeRequestBody>;
  try {
    body = (await request.json()) as Partial<AnalyzeRequestBody>;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload. Expected JSON body." },
      { status: 400 }
    );
  }

  const rawBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
  const mimeType = typeof body.mimeType === "string" ? body.mimeType.trim() : "";
  const language: Language =
    typeof body.language === "string" && ALLOWED_LANGUAGES.has(body.language as Language)
      ? (body.language as Language)
      : "English";

  if (!rawBase64) {
    return NextResponse.json(
      { error: "No image was provided. Please upload a prescription or medical label." },
      { status: 400 }
    );
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json(
      { error: "Unsupported image format. Please upload a JPG, PNG, or WebP image." },
      { status: 400 }
    );
  }

  const cleanBase64 = rawBase64.replace(/^data:[^;]+;base64,/i, "").trim();
  const estimatedBytes = Math.floor((cleanBase64.length * 3) / 4);
  if (estimatedBytes === 0 || estimatedBytes > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image is empty or exceeds the 10 MB limit." },
      { status: 400 }
    );
  }

  const systemInstruction = [
    "You are MediPlain, a compassionate medical accessibility assistant helping elderly patients and caregivers understand prescriptions, medicine labels, and lab reports.",
    `Respond entirely in ${language} (except for the literal enum values High/Medium/Low for confidenceLevel, and the literal sentinel string UNREADABLE_DOCUMENT if the image is unreadable).`,
    "Write every explanation at a calm, reassuring 5th-grade reading level. Avoid medical jargon or immediately translate it in jargonTranslations.",
    `For schedule.timeOfDay, use concise labels in ${language} such as: ${getTimeOfDayExamples(language)}.`,
    "CRITICAL SAFETY RULE: NEVER guess, infer, or hallucinate a dosage schedule if it is not clearly visible on the image. If dosing frequency or amount is missing, cropped, or blurry, return an empty schedule array [] and set confidenceLevel to Medium or Low with an honest confidenceNote telling the patient to verify with a pharmacist.",
    "Include 2 to 4 jargonTranslations decoding technical terms, Latin abbreviations (e.g., PO, BID, TID, PRN), or lab markers visible on the document.",
    "If the image is completely blurry, blank, dark, or does not contain readable medical, prescription, medicine label, or lab report text, set title to exactly \"UNREADABLE_DOCUMENT\" and briefly explain why in simpleSummary.",
  ].join(" ");

  try {
    const response = await generateWithGeminiFallback(apiKey, {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `Analyze this medical document image and return the structured plain-language breakdown in ${language}.`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });

    const rawText = response.text?.trim();
    if (!rawText) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this image. Please try again with a clearer, well-lit photo.",
        },
        { status: 422 }
      );
    }

    let parsed: MediPlainResult;
    try {
      parsed = JSON.parse(rawText) as MediPlainResult;
    } catch {
      return NextResponse.json(
        {
          error:
            "The document could not be structured cleanly. Please upload a clearer photo of the label or report.",
        },
        { status: 422 }
      );
    }

    if (
      !parsed.title ||
      parsed.title.trim().toUpperCase() === "UNREADABLE_DOCUMENT" ||
      !parsed.simpleSummary
    ) {
      return NextResponse.json(
        {
          error:
            parsed.simpleSummary ||
            "We could not read any medical text in this image. Please upload a clearer, well-lit photo of your prescription, medicine label, or lab report.",
        },
        { status: 422 }
      );
    }

    const normalizedConfidence: ConfidenceLevel = ALLOWED_CONFIDENCE.has(
      parsed.confidenceLevel
    )
      ? parsed.confidenceLevel
      : "Medium";

    const sanitized: MediPlainResult = {
      title: parsed.title.trim(),
      documentType:
        typeof parsed.documentType === "string" && parsed.documentType.trim()
          ? parsed.documentType.trim()
          : "Medical Document",
      confidenceLevel: normalizedConfidence,
      confidenceNote:
        typeof parsed.confidenceNote === "string" && parsed.confidenceNote.trim()
          ? parsed.confidenceNote.trim()
          : "Verify dosing details with your pharmacist if any text is unclear.",
      simpleSummary: parsed.simpleSummary.trim(),
      schedule: Array.isArray(parsed.schedule)
        ? parsed.schedule.filter((item) => item?.timeOfDay && item?.instruction)
        : [],
      jargonTranslations: Array.isArray(parsed.jargonTranslations)
        ? parsed.jargonTranslations
            .filter((item) => item?.term && item?.plainMeaning)
            .slice(0, 6)
        : [],
      warnings: Array.isArray(parsed.warnings)
        ? parsed.warnings.filter((w) => typeof w === "string" && w.trim().length > 0)
        : [],
      questionsForDoctor: Array.isArray(parsed.questionsForDoctor)
        ? parsed.questionsForDoctor
            .filter((q) => typeof q === "string" && q.trim().length > 0)
            .slice(0, 4)
        : [],
    };

    return NextResponse.json(sanitized, { status: 200 });
  } catch (error) {
    const exactMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "Unknown Gemini API error.";
    console.error("MediPlain Gemini API error:", exactMessage, error);
    return NextResponse.json(
      { error: `Gemini analysis failed: ${exactMessage}` },
      { status: 500 }
    );
  }
}
