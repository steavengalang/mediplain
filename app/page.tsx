"use client";

import { useEffect, useState } from "react";
import { AccessibilityHeader } from "@/components/AccessibilityHeader";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ResultDashboard } from "@/components/ResultDashboard";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { UploadSection } from "@/components/UploadSection";
import { SAMPLE_PRESCRIPTIONS, UI_COPY } from "@/lib/i18n";
import type { Language, MediPlainResult } from "@/lib/types";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const HTML_LANG_CODES: Record<Language, string> = {
  English: "en",
  Indonesian: "id",
  Spanish: "es",
};

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }
      const commaIndex = reader.result.indexOf(",");
      resolve(commaIndex >= 0 ? reader.result.slice(commaIndex + 1) : reader.result);
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function HomePage() {
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState<Language>("English");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<MediPlainResult | null>(null);
  const [isSample, setIsSample] = useState(false);

  const copy = UI_COPY[language];

  useEffect(() => {
    const root = document.documentElement;
    if (largeText) {
      root.setAttribute("data-text-scale", "large");
    } else {
      root.removeAttribute("data-text-scale");
    }
  }, [largeText]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_CODES[language];
  }, [language]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    if (isSample) {
      setResult(SAMPLE_PRESCRIPTIONS[nextLanguage]);
    }
  };

  const handleSelectFile = (file: File) => {
    setErrorMessage(null);
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      setErrorMessage(copy.invalidFileType);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setErrorMessage(copy.fileTooLarge);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsSample(false);
    setResult(null);
  };

  const handleClearFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const imageBase64 = await readFileAsBase64(selectedFile);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mimeType: selectedFile.type,
          language,
        }),
      });

      const data = (await response.json()) as MediPlainResult & { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error || copy.genericError);
        return;
      }

      setIsSample(false);
      setResult(data);
    } catch {
      setErrorMessage(copy.genericError);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTrySample = () => {
    setErrorMessage(null);
    setIsSample(true);
    setResult(SAMPLE_PRESCRIPTIONS[language]);
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setIsSample(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <AccessibilityHeader
        largeText={largeText}
        onToggleLargeText={() => setLargeText((prev) => !prev)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((prev) => !prev)}
        language={language}
        onChangeLanguage={handleLanguageChange}
        copy={copy}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {isAnalyzing ? (
          <ResultSkeleton copy={copy} />
        ) : result ? (
          <ResultDashboard
            key={`${result.title}-${language}-${isSample ? "sample" : "upload"}`}
            result={result}
            language={language}
            copy={copy}
            isSample={isSample}
            previewUrl={previewUrl}
            onReset={handleReset}
          />
        ) : (
          <UploadSection
            copy={copy}
            previewUrl={previewUrl}
            fileName={selectedFile?.name ?? null}
            fileSizeBytes={selectedFile?.size ?? null}
            isAnalyzing={isAnalyzing}
            errorMessage={errorMessage}
            onSelectFile={handleSelectFile}
            onClearFile={handleClearFile}
            onAnalyze={handleAnalyze}
            onTrySample={handleTrySample}
          />
        )}
      </main>

      <DisclaimerFooter disclaimer={copy.disclaimer} />
    </div>
  );
}
