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

function extractTimelineTime(timeOfDay: string, instruction: string): string {
  const amPmMatch = instruction.match(/\b(\d{1,2})[:.](\d{2})\s*(am|pm)\b/i);
  if (amPmMatch) {
    let hour = Number.parseInt(amPmMatch[1], 10);
    const minute = amPmMatch[2];
    const period = amPmMatch[3].toLowerCase();
    if (period === "pm" && hour < 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }

  const twentyFourMatch = instruction.match(/\b([01]?\d|2[0-3])[:.](\d{2})\b/);
  if (twentyFourMatch) {
    const hour = twentyFourMatch[1].padStart(2, "0");
    const minute = twentyFourMatch[2];
    return `${hour}:${minute}`;
  }

  const normalized = timeOfDay.toLowerCase();
  if (
    normalized.includes("morning") ||
    normalized.includes("pagi") ||
    normalized.includes("mañana") ||
    normalized.includes("manana")
  ) {
    return "07:00";
  }
  if (
    normalized.includes("afternoon") ||
    normalized.includes("siang") ||
    normalized.includes("sore") ||
    normalized.includes("tarde")
  ) {
    return "15:00";
  }
  if (
    normalized.includes("night") ||
    normalized.includes("evening") ||
    normalized.includes("bedtime") ||
    normalized.includes("malam") ||
    normalized.includes("noche")
  ) {
    return "23:00";
  }
  return "PRN";
}

export function ResultDashboard({
  result,
  language,
  copy,
  isSample,
  previewUrl,
  onReset,
}: ResultDashboardProps) {
  const [checkedQuestions, setCheckedQuestions] = useState<
    Record<number, boolean>
  >({});
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
      result.schedule.length > 0
        ? `${copy.ttsIntro.schedule} ${scheduleSpeech}`
        : "",
      result.warnings.length > 0
        ? `${copy.ttsIntro.warnings} ${warningsSpeech}`
        : "",
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
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
      <div className="lg:col-span-5 space-y-6">
        <section className="border-b border-border pb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-muted">
                {isSample ? copy.sampleBadge : copy.uploadedBadge}
              </p>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-ink sm:text-3xl leading-[1.15] break-words">
                {result.title}
              </h1>
            </div>

            {previewUrl && !isSample && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-border bg-surface">
                <Image
                  unoptimized
                  src={previewUrl}
                  alt="Uploaded document thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleSpeech}
              aria-pressed={isSpeaking}
              className={`inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                isSpeaking
                  ? "border-danger-border bg-danger-bg text-danger-ink"
                  : "border-accent bg-accent text-on-accent hover:bg-accent-hover"
              }`}
            >
              {isSpeaking ? (
                <Square
                  className="h-4 w-4 shrink-0 fill-current"
                  aria-hidden="true"
                />
              ) : (
                <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{isSpeaking ? copy.stopReading : copy.readAloud}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-border-strong cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{copy.analyzeAnother}</span>
            </button>
          </div>

          {ttsNotice && (
            <p className="mt-3 text-sm font-medium text-warning-ink">
              {ttsNotice}
            </p>
          )}
        </section>

        <section
          aria-labelledby="summary-heading"
          className="border-b border-border pb-6"
        >
          <h2
            id="summary-heading"
            className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
          >
            {copy.summaryHeading}
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink">
            {result.simpleSummary}
          </p>
        </section>

        {result.warnings.length > 0 && (
          <section
            aria-labelledby="warnings-heading"
            className="border-l-4 border-warning-border bg-warning-bg px-5 py-4"
          >
            <div className="flex items-center gap-2 text-warning-ink">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <h2
                id="warnings-heading"
                className="font-mono text-xs font-bold uppercase tracking-widest"
              >
                {copy.warningsHeading}
              </h2>
            </div>
            <ul className="mt-3.5 space-y-2.5">
              {result.warnings.map((warning, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-ink sm:text-base"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-warning-border"
                  />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="lg:col-span-7 space-y-10">
        {result.schedule.length > 0 && (
          <section aria-labelledby="schedule-heading">
            <div className="flex items-baseline justify-between border-b border-border pb-3">
              <h2
                id="schedule-heading"
                className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
              >
                {copy.scheduleHeading}
              </h2>
              <span className="font-mono text-xs tabular-nums text-ink-muted">
                {String(result.schedule.length).padStart(2, "0")}
              </span>
            </div>

            <ol className="divide-y divide-border border-b border-border">
              {result.schedule.map((item, idx) => {
                const Icon = getScheduleIcon(item.timeOfDay);
                const displayTime = extractTimelineTime(
                  item.timeOfDay,
                  item.instruction
                );
                return (
                  <li
                    key={`${item.timeOfDay}-${idx}`}
                    className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-12 sm:gap-6 sm:items-baseline"
                  >
                    <div className="sm:col-span-3">
                      <span className="font-mono text-2xl font-bold tracking-tight tabular-nums text-ink sm:text-3xl">
                        {displayTime}
                      </span>
                    </div>

                    <div className="sm:col-span-9 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon
                          className="h-4 w-4 shrink-0 text-accent"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                          {item.timeOfDay}
                        </h3>
                      </div>
                      <p className="mt-1.5 text-base leading-relaxed text-ink">
                        {item.instruction}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {result.questionsForDoctor.length > 0 && (
          <section aria-labelledby="questions-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope
                  className="h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <h2
                  id="questions-heading"
                  className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
                >
                  {copy.questionsHeading}
                </h2>
              </div>
              <span className="font-mono text-xs tabular-nums font-semibold text-ink-muted">
                {copy.checkedCount(
                  checkedTotal,
                  result.questionsForDoctor.length
                )}
              </span>
            </div>

            <p className="mt-3 text-sm text-ink-muted">
              {copy.questionsSubheading}
            </p>

            <ul className="mt-3 divide-y divide-border border-t border-b border-border">
              {result.questionsForDoctor.map((question, idx) => {
                const isChecked = Boolean(checkedQuestions[idx]);
                return (
                  <li key={idx}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked}
                      onClick={() => toggleQuestion(idx)}
                      className={`flex w-full items-start gap-3 py-3.5 px-2 text-left transition-colors cursor-pointer ${
                        isChecked ? "bg-surface-subtle" : "hover:bg-surface"
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
                          isChecked
                            ? "line-through text-ink-muted"
                            : "text-ink"
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
    </div>
  );
}
