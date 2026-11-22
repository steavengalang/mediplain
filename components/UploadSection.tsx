"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  Clock,
  FileCheck2,
  FlaskConical,
  Loader2,
  Pill,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { PresetKey, SavedCareSheet } from "@/lib/types";
import type { UIStrings } from "@/lib/i18n";

interface UploadSectionProps {
  copy: UIStrings;
  previewUrl: string | null;
  fileName: string | null;
  fileSizeBytes: number | null;
  isAnalyzing: boolean;
  errorMessage: string | null;
  recentScans: SavedCareSheet[];
  onSelectFile: (file: File) => void;
  onClearFile: () => void;
  onAnalyze: () => void;
  onSelectPreset: (preset: PresetKey) => void;
  onSelectRecent: (scan: SavedCareSheet) => void;
  onClearHistory: () => void;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const PRESET_ORDER: { key: PresetKey; icon: typeof Pill }[] = [
  { key: "antibiotic", icon: FileCheck2 },
  { key: "labReport", icon: Activity },
  { key: "otcSyrup", icon: FlaskConical },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadSection({
  copy,
  previewUrl,
  fileName,
  fileSizeBytes,
  isAnalyzing,
  errorMessage,
  recentScans,
  onSelectFile,
  onClearFile,
  onAnalyze,
  onSelectPreset,
  onSelectRecent,
  onClearHistory,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onSelectFile(files[0]);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
        <section className="lg:col-span-6 space-y-6">
          <div className="border-b border-border pb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
              {copy.heroEyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl leading-[1.12]">
              {copy.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              {copy.heroSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted">
              {copy.presetsHeading}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_ORDER.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectPreset(key)}
                  disabled={isAnalyzing}
                  title={copy.presets[key].sublabel}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3.5 py-2 text-left text-sm font-semibold text-ink transition-colors hover:border-accent hover:bg-accent-soft disabled:opacity-50 cursor-pointer"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <span>{copy.presets[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 border-l-4 border-danger-border bg-danger-bg px-4 py-3.5 text-danger-ink"
            >
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}
        </section>

        <section aria-label={copy.uploadTitle} className="lg:col-span-6">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            id="mediplain-file-input"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {!previewUrl ? (
            <div
              role="button"
              tabIndex={0}
              aria-label={copy.uploadTitle}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const dropped = e.dataTransfer.files;
                if (
                  dropped &&
                  dropped.length > 0 &&
                  ACCEPTED_TYPES.has(dropped[0].type)
                ) {
                  handleFiles(dropped);
                } else if (dropped && dropped.length > 0) {
                  onSelectFile(dropped[0]);
                }
              }}
              className={`flex flex-col items-start justify-center rounded-sm border border-dashed px-6 py-12 transition-colors cursor-pointer sm:px-8 ${
                isDragging
                  ? "border-accent bg-accent-soft"
                  : "border-border-strong bg-surface hover:border-ink"
              }`}
            >
              <Upload
                className="h-6 w-6 text-accent"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">
                {copy.uploadTitle}
              </h2>
              <p className="mt-1 text-base text-ink-muted">
                {copy.uploadSubtitle}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex min-h-10 items-center rounded-sm border border-border-strong bg-bg px-4 py-2 text-sm font-semibold text-ink">
                  {copy.chooseFile}
                </span>
                <span className="font-mono text-xs text-ink-muted">
                  {copy.uploadFormats}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-border bg-surface p-5 sm:p-6 space-y-5">
              <div className="relative overflow-hidden rounded-sm border border-border bg-surface-subtle aspect-[4/3]">
                <Image
                  unoptimized
                  src={previewUrl}
                  alt={
                    fileName
                      ? `Preview of ${fileName}`
                      : "Uploaded medical document preview"
                  }
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-4">
                <p className="truncate text-base font-bold text-ink">
                  {fileName}
                </p>
                {fileSizeBytes !== null && (
                  <p className="font-mono text-xs tabular-nums text-ink-muted">
                    {formatBytes(fileSizeBytes)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-accent bg-accent px-5 py-2.5 text-sm font-bold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60 cursor-pointer"
                >
                  {isAnalyzing && (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  <span>
                    {isAnalyzing ? copy.analyzingButton : copy.analyzeButton}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClearFile}
                  disabled={isAnalyzing}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-border-strong disabled:opacity-50 cursor-pointer"
                >
                  <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{copy.removeImage}</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {recentScans.length > 0 && (
        <section
          aria-labelledby="recent-scans-heading"
          className="border-t border-border pt-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock
                className="h-4 w-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <h2
                id="recent-scans-heading"
                className="font-mono text-xs font-bold uppercase tracking-widest text-ink-muted"
              >
                {copy.recentScansHeading}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold text-ink-muted transition-colors hover:text-ink cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{copy.clearHistory}</span>
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2.5">
            {recentScans.map((scan) => (
              <button
                key={scan.id}
                type="button"
                onClick={() => onSelectRecent(scan)}
                className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-sm border border-border bg-surface px-3 py-2 text-left text-sm transition-colors hover:border-border-strong cursor-pointer"
              >
                <span className="font-mono text-xs uppercase text-ink-muted shrink-0">
                  {scan.result.documentType}
                </span>
                <span className="truncate font-semibold text-ink max-w-[240px]">
                  {scan.result.title}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
