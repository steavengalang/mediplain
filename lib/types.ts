export type Language = "English" | "Indonesian" | "Spanish";

export interface ScheduleItem {
  timeOfDay: string;
  instruction: string;
}

export interface MediPlainResult {
  title: string;
  simpleSummary: string;
  schedule: ScheduleItem[];
  warnings: string[];
  questionsForDoctor: string[];
}

export interface AnalyzeRequestBody {
  imageBase64: string;
  mimeType: string;
  language: Language;
}
