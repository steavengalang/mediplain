"use client";

import { Contrast, FileHeart, Globe, Type } from "lucide-react";
import type { Language } from "@/lib/types";
import type { UIStrings } from "@/lib/i18n";

interface AccessibilityHeaderProps {
  largeText: boolean;
  onToggleLargeText: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  language: Language;
  onChangeLanguage: (language: Language) => void;
  copy: UIStrings;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "English", label: "English" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Spanish", label: "Spanish" },
];

export function AccessibilityHeader({
  largeText,
  onToggleLargeText,
  highContrast,
  onToggleHighContrast,
  language,
  onChangeLanguage,
  copy,
}: AccessibilityHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileHeart
            className="h-5 w-5 shrink-0 text-accent"
            strokeWidth={2}
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-baseline gap-x-2.5 min-w-0">
            <span className="text-lg font-bold tracking-tight text-ink">
              MediPlain
            </span>
            <span className="hidden text-xs text-ink-muted sm:inline">
              {copy.tagline}
            </span>
          </div>
        </div>

        <nav
          aria-label="Accessibility controls"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            onClick={onToggleLargeText}
            aria-pressed={largeText}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              largeText
                ? "border-accent bg-accent text-on-accent"
                : "border-border bg-surface text-ink hover:border-border-strong"
            }`}
          >
            <Type className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{copy.largeText}</span>
          </button>

          <button
            type="button"
            onClick={onToggleHighContrast}
            aria-pressed={highContrast}
            className={`inline-flex min-h-10 items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-semibold transition-colors cursor-pointer ${
              highContrast
                ? "border-accent bg-accent text-on-accent"
                : "border-border bg-surface text-ink hover:border-border-strong"
            }`}
          >
            <Contrast className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{copy.highContrast}</span>
          </button>

          <div className="inline-flex min-h-10 items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5">
            <Globe
              className="h-4 w-4 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            <label htmlFor="mediplain-language-select" className="sr-only">
              {copy.languageLabel}
            </label>
            <select
              id="mediplain-language-select"
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as Language)}
              className="bg-surface text-sm font-semibold text-ink focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </div>
    </header>
  );
}
