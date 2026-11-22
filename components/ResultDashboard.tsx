"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckSquare,
  Clock,
  Moon,
  RotateCcw,
  Square,
  Stethoscope,
  Sun,
  Sunset,
  Volume2,
} from "lucide-react";
import type { Language, MediPlainResult } from "@/lib/types";
import { TTS_LOCALES, type UIStrings } from "@/lib/i18n";

interface ResultDashboardProps {
  result: MediPlainResult;
  language: Language;
  copy: UIStrings;
  isSample: boolean;
  previewUrl: string | null;
  onReset: () => void;
}

function getScheduleIcon(timeOfDay: string) {
  const normalized = timeOfDay.toLowerCase();
  if (
    normalized.includes("morning") ||
    normalized.includes("pagi") ||
    normalized.includes("mañana") ||
    normalized.includes("manana") ||
    normalized.includes("breakfast") ||
    normalized.includes("am")
  ) {
    return Sun;
  }
  if (
    normalized.includes("afternoon") ||
    normalized.includes("siang") ||
    normalized.includes("sore") ||
    normalized.includes("tarde") ||
    normalized.includes("midday") ||
    normalized.includes("lunch")
  ) {
    return Sunset;
  }
  if (
    normalized.includes("night") ||
    normalized.includes("evening") ||
    normalized.includes("bedtime") ||
    normalized.includes("malam") ||
    normalized.includes("noche") ||
    normalized.includes("pm")
  ) {
    return Moon;
  }
  return Clock;
}

export function ResultDashboard({
  result,
  language,
  copy,
  isSample,
  previewUrl,
  onReset,
}: ResultDashboardProps) {
  const [checkedQuestions, setCheckedQuestions] = useState<Record<number, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsNotice, setTtsNotice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [result, language]);

  const toggleQuestion = (index: number) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsNotice(copy.ttsUnsupported);
      return;
    }

    const synth = window.speechSynthesis;
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    setTtsNotice(null);
    synth.cancel();

    const scheduleSpeech = result.schedule
      .map((item) => `${item.timeOfDay}: ${item.instruction}`)
      .join(" ");
    const warningsSpeech = result.warnings.join(" ");

    const parts = [
      result.title,
      result.simpleSummary,
      result.schedule.length > 0 ? `${copy.ttsIntro.schedule} ${scheduleSpeech}` : "",
      result.warnings.length > 0 ? `${copy.ttsIntro.warnings} ${warningsSpeech}` : "",
    ].filter(Boolean);

    const utterance = new SpeechSynthesisUtterance(parts.join(". "));
    const targetLocale = TTS_LOCALES[language];
    utterance.lang = targetLocale;
    utterance.rate = 0.94;

    const voices = synth.getVoices();
    const matchedVoice =
      voices.find((v) => v.lang.toLowerCase() === targetLocale.toLowerCase()) ||
      voices.find((v) =>
        v.lang.toLowerCase().startsWith(targetLocale.split("-")[0].toLowerCase())
      );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    synth.speak(utterance);
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onReset();
  };

  const checkedTotal = result.questionsForDoctor.filter(
    (_, idx) => checkedQuestions[idx]
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 sm:p-6 hc-border">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            {previewUrl && !isSample && (
              <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface-subtle sm:block hc-border">
                <Image
                  unoptimized
                  src={previewUrl}
                  alt="Uploaded document thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <span className="inline-block rounded border border-border bg-surface-subtle px-2.5 py-1 font-mono text-xs font-semibold text-ink hc-border">
                {isSample ? copy.sampleBadge : copy.uploadedBadge}
              </span>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl leading-snug break-words">
                {result.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleSpeech}
              aria-pressed={isSpeaking}
              className={`inline-flex min-h-12 items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer hc-border ${
                isSpeaking
                  ? "border-danger-border bg-danger-bg text-danger-ink"
                  : "border-accent bg-accent text-on-accent hover:bg-accent-hover"
              }`}
            >
              {isSpeaking ? (
                <Square className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5 shrink-0" aria-hidden="true" />
              )}
              <span>{isSpeaking ? copy.stopReading : copy.readAloud}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle cursor-pointer hc-border"
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{copy.analyzeAnother}</span>
            </button>
          </div>
        </div>

        {ttsNotice && (
          <p className="mt-3 text-sm font-medium text-warning-ink">{ttsNotice}</p>
        )}
      </section>

      <section
        aria-labelledby="summary-heading"
        className="rounded-lg border border-border bg-surface p-5 sm:p-6 hc-border"
      >
        <h2
          id="summary-heading"
          className="font-mono text-xs font-bold uppercase tracking-widest text-accent"
        >
          {copy.summaryHeading}
        </h2>
        <p className="mt-3 text-lg leading-relaxed text-ink">
          {result.simpleSummary}
        </p>
      </section>

      {result.schedule.length > 0 && (
        <section aria-labelledby="schedule-heading" className="space-y-3">
          <h2
            id="schedule-heading"
            className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
          >
            {copy.scheduleHeading}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {result.schedule.map((item, idx) => {
              const Icon = getScheduleIcon(item.timeOfDay);
              return (
                <article
                  key={`${item.timeOfDay}-${idx}`}
                  className="flex flex-col rounded-lg border border-border bg-surface p-5 hc-border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-accent-soft text-accent hc-border"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-wide text-ink">
                      {item.timeOfDay}
                    </h3>
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {item.instruction}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {result.warnings.length > 0 && (
        <section
          aria-labelledby="warnings-heading"
          className="rounded-lg border border-warning-border border-l-4 bg-warning-bg p-5 sm:p-6 hc-border"
        >
          <div className="flex items-center gap-2.5 text-warning-ink">
            <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <h2
              id="warnings-heading"
              className="text-base font-bold uppercase tracking-wide"
            >
              {copy.warningsHeading}
            </h2>
          </div>
          <ul className="mt-4 space-y-3">
            {result.warnings.map((warning, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-base leading-relaxed text-ink"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning-border"
                />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.questionsForDoctor.length > 0 && (
        <section
          aria-labelledby="questions-heading"
          className="rounded-lg border border-border bg-surface p-5 sm:p-6 hc-border"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Stethoscope
                className="h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <h2
                id="questions-heading"
                className="text-lg font-bold text-ink"
              >
                {copy.questionsHeading}
              </h2>
            </div>
            <span className="font-mono text-xs font-semibold text-ink-muted">
              {copy.checkedCount(checkedTotal, result.questionsForDoctor.length)}
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {copy.questionsSubheading}
          </p>

          <ul className="mt-4 space-y-2.5">
            {result.questionsForDoctor.map((question, idx) => {
              const isChecked = Boolean(checkedQuestions[idx]);
              return (
                <li key={idx}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => toggleQuestion(idx)}
                    className={`flex w-full items-start gap-3 rounded-md border p-3.5 text-left transition-colors cursor-pointer hc-border ${
                      isChecked
                        ? "border-accent bg-accent-soft"
                        : "border-border bg-surface hover:bg-surface-subtle"
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare
                        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                        aria-hidden="true"
                      />
                    ) : (
                      <Square
                        className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`text-base leading-relaxed ${
                        isChecked ? "line-through text-ink-muted" : "text-ink"
                      }`}
                    >
                      {question}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
