"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  FileCheck2,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import type { UIStrings } from "@/lib/i18n";

interface UploadSectionProps {
  copy: UIStrings;
  previewUrl: string | null;
  fileName: string | null;
  fileSizeBytes: number | null;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onSelectFile: (file: File) => void;
  onClearFile: () => void;
  onAnalyze: () => void;
  onTrySample: () => void;
}

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

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
  onSelectFile,
  onClearFile,
  onAnalyze,
  onTrySample,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onSelectFile(files[0]);
  };

  return (
    <div className="space-y-8">
      <section className="border-b border-border pb-8 hc-border">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
          {copy.heroEyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl leading-tight">
          {copy.heroTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {copy.heroSubtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-accent-soft p-4 hc-border">
          <button
            type="button"
            onClick={onTrySample}
            disabled={isAnalyzing}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-md border border-accent bg-accent px-5 py-3 text-base font-bold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-50 cursor-pointer hc-border"
          >
            <FileCheck2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>{copy.trySampleButton}</span>
          </button>
          <p className="text-sm font-medium text-ink">
            {copy.trySampleHint}
          </p>
        </div>
      </section>

      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger-border bg-danger-bg p-4 text-danger-ink hc-border"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <section aria-label={copy.uploadTitle}>
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
              if (dropped && dropped.length > 0 && ACCEPTED_TYPES.has(dropped[0].type)) {
                handleFiles(dropped);
              } else if (dropped && dropped.length > 0) {
                onSelectFile(dropped[0]);
              }
            }}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors cursor-pointer hc-border ${
              isDragging
                ? "border-accent bg-accent-soft"
                : "border-border-strong bg-surface hover:bg-surface-subtle"
            }`}
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-surface-subtle text-accent hc-border"
              aria-hidden="true"
            >
              <Upload className="h-6 w-6" strokeWidth={2} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-ink">
              {copy.uploadTitle}
            </h2>
            <p className="mt-1.5 text-base text-ink-muted">
              {copy.uploadSubtitle}
            </p>
            <span className="mt-5 inline-flex min-h-11 items-center rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hc-border">
              {copy.chooseFile}
            </span>
            <p className="mt-4 font-mono text-xs text-ink-muted">
              {copy.uploadFormats}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 hc-border">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-5">
                <div className="relative overflow-hidden rounded-md border border-border bg-surface-subtle aspect-[4/3] hc-border">
                  <Image
                    unoptimized
                    src={previewUrl}
                    alt={fileName ? `Preview of ${fileName}` : "Uploaded medical document preview"}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 min-w-0">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    {copy.uploadedBadge}
                  </p>
                  <p className="mt-1 truncate text-lg font-bold text-ink">
                    {fileName}
                  </p>
                  {fileSizeBytes !== null && (
                    <p className="mt-0.5 font-mono text-xs text-ink-muted">
                      {formatBytes(fileSizeBytes)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    className="inline-flex min-h-12 items-center gap-2 rounded-md border border-accent bg-accent px-5 py-3 text-base font-bold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60 cursor-pointer hc-border"
                  >
                    {isAnalyzing && (
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    )}
                    <span>
                      {isAnalyzing ? copy.analyzingButton : copy.analyzeButton}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onClearFile}
                    disabled={isAnalyzing}
                    className="inline-flex min-h-12 items-center gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-subtle disabled:opacity-50 cursor-pointer hc-border"
                  >
                    <X className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{copy.removeImage}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
