export type Language = "English" | "Indonesian" | "Spanish";

export type ConfidenceLevel = "High" | "Medium" | "Low";

export type PresetKey = "antibiotic" | "labReport" | "otcSyrup";

export interface ScheduleItem {
  timeOfDay: string;
  instruction: string;
}

export interface JargonTranslation {
  term: string;
  plainMeaning: string;
}

export interface MediPlainResult {
  title: string;
  documentType: string;
  confidenceLevel: ConfidenceLevel;
  confidenceNote: string;
  simpleSummary: string;
  schedule: ScheduleItem[];
  jargonTranslations: JargonTranslation[];
  warnings: string[];
  questionsForDoctor: string[];
}

export interface AnalyzeRequestBody {
  imageBase64: string;
  mimeType: string;
  language: Language;
}

export interface AskRequestBody {
  documentContext: MediPlainResult;
  question: string;
  language: Language;
}

export interface SavedCareSheet {
  id: string;
  savedAt: string;
  language: Language;
  result: MediPlainResult;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}
