"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Clock,
  Info,
  Loader2,
  MessageSquare,
  Moon,
  Printer,
  RotateCcw,
  Send,
  ShieldCheck,
  Square,
  Stethoscope,
  Sun,
  Sunset,
  Volume2,
} from "lucide-react";
import type { Language, MediPlainResult, QAItem } from "@/lib/types";
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

  const [questionInput, setQuestionInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [qaThread, setQaThread] = useState<QAItem[]>([]);

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

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onReset();
  };

  const submitQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isAsking) return;

    setIsAsking(true);
    setAskError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentContext: result,
          question: trimmed,
          language,
        }),
      });

      const rawText = await response.text();
      let data: { answer?: string; error?: string } | null = null;
      try {
        data = JSON.parse(rawText) as { answer?: string; error?: string };
      } catch {
        data = null;
      }

      if (!response.ok || !data?.answer) {
        setAskError(data?.error || copy.askError);
        return;
      }

      setQaThread((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          question: trimmed,
          answer: data.answer as string,
        },
      ]);
      setQuestionInput("");
    } catch {
      setAskError(copy.askError);
    } finally {
      setIsAsking(false);
    }
  };

  const checkedTotal = result.questionsForDoctor.filter(
    (_, idx) => checkedQuestions[idx]
  ).length;

  const isHighConfidence = result.confidenceLevel === "High";
  const ConfidenceIcon = isHighConfidence ? ShieldCheck : AlertCircle;

  return (
    <div className="print-grid grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
      <div className="lg:col-span-5 space-y-6">
        <section className="border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-sm border border-border bg-surface px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-ink">
              {result.documentType}
            </span>
            <span
              title={result.confidenceNote}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface-subtle px-2.5 py-0.5 font-mono text-xs font-semibold text-ink-muted"
            >
              <ConfidenceIcon
                className={`h-3.5 w-3.5 shrink-0 ${
                  isHighConfidence ? "text-accent" : "text-warning-ink"
                }`}
                aria-hidden="true"
              />
              <span>{copy.confidenceLevels[result.confidenceLevel]}</span>
            </span>
            {isSample && (
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {copy.sampleBadge}
              </span>
            )}
          </div>

          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            {result.confidenceNote}
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl leading-[1.15] break-words min-w-0">
              {result.title}
            </h1>

            {previewUrl && !isSample && (
              <div className="no-print relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-border bg-surface">
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

          <div className="no-print mt-5 flex flex-wrap items-center gap-2.5">
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
              onClick={handlePrint}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-border-strong cursor-pointer"
            >
              <Printer className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{copy.printCareSheet}</span>
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
            <p className="no-print mt-3 text-sm font-medium text-warning-ink">
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

          {result.schedule.length > 0 ? (
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
          ) : (
            <div className="flex items-start gap-3 border-b border-border bg-surface py-5 px-4">
              <Info
                className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <p className="text-base leading-relaxed text-ink">
                {copy.missingScheduleNotice}
              </p>
            </div>
          )}
        </section>

        {result.jargonTranslations.length > 0 && (
          <section aria-labelledby="jargon-heading">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <BookOpen
                className="h-4 w-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <h2
                id="jargon-heading"
                className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
              >
                {copy.jargonHeading}
              </h2>
            </div>

            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-6 border-b border-border py-2.5 font-mono text-xs uppercase tracking-wider text-ink-muted">
              <span className="sm:col-span-4">{copy.jargonTermColumn}</span>
              <span className="sm:col-span-8">{copy.jargonMeaningColumn}</span>
            </div>

            <dl className="divide-y divide-border border-b border-border">
              {result.jargonTranslations.map((entry, idx) => (
                <div
                  key={`${entry.term}-${idx}`}
                  className="grid grid-cols-1 gap-1.5 py-3.5 sm:grid-cols-12 sm:gap-6 sm:items-baseline"
                >
                  <dt className="sm:col-span-4 font-mono text-sm font-bold text-ink">
                    {entry.term}
                  </dt>
                  <dd className="sm:col-span-8 text-base leading-relaxed text-ink-muted">
                    {entry.plainMeaning}
                  </dd>
                </div>
              ))}
            </dl>
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

            <p className="no-print mt-3 text-sm text-ink-muted">
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

        <section
          aria-labelledby="ask-heading"
          className={qaThread.length === 0 ? "no-print" : ""}
        >
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <MessageSquare
              className="h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <h2
              id="ask-heading"
              className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
            >
              {copy.askHeading}
            </h2>
          </div>

          <div className="no-print mt-3 space-y-3">
            <p className="text-sm text-ink-muted">{copy.askSubheading}</p>

            <div className="flex flex-wrap gap-2">
              {copy.askQuickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  disabled={isAsking}
                  onClick={() => submitQuestion(chip)}
                  className="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-border-strong disabled:opacity-50 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitQuestion(questionInput);
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <label htmlFor="mediplain-ask-input" className="sr-only">
                {copy.askPlaceholder}
              </label>
              <input
                id="mediplain-ask-input"
                type="text"
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={copy.askPlaceholder}
                maxLength={500}
                disabled={isAsking}
                className="min-h-11 flex-1 rounded-sm border border-border-strong bg-surface px-3.5 py-2 text-base text-ink placeholder:text-ink-muted"
              />
              <button
                type="submit"
                disabled={isAsking || !questionInput.trim()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
              >
                {isAsking ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Send className="h-4 w-4 shrink-0" aria-hidden="true" />
                )}
                <span>{isAsking ? copy.askSending : copy.askSend}</span>
              </button>
            </form>

            {askError && (
              <p
                role="alert"
                className="border-l-4 border-danger-border bg-danger-bg px-3 py-2 text-sm font-medium text-danger-ink"
              >
                {askError}
              </p>
            )}
          </div>

          {qaThread.length > 0 && (
            <div className="mt-5 divide-y divide-border border-t border-b border-border">
              {qaThread.map((item) => (
                <div key={item.id} className="py-4 space-y-2">
                  <p className="text-sm font-bold text-ink">{item.question}</p>
                  <p className="text-base leading-relaxed text-ink-muted">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
