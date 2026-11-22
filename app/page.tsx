"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AccessibilityHeader } from "@/components/AccessibilityHeader";
import { DisclaimerFooter } from "@/components/DisclaimerFooter";
import { ResultDashboard } from "@/components/ResultDashboard";
import { ResultSkeleton } from "@/components/ResultSkeleton";
import { UploadSection } from "@/components/UploadSection";
import { SAMPLE_PRESETS, UI_COPY } from "@/lib/i18n";
import type {
  Language,
  MediPlainResult,
  PresetKey,
  SavedCareSheet,
} from "@/lib/types";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const RECENT_SCANS_STORAGE_KEY = "mediplain_recent_scans_v1";
const MAX_RECENT_SCANS = 5;

const HTML_LANG_CODES: Record<Language, string> = {
  English: "en",
  Indonesian: "id",
  Spanish: "es",
};

const EMPTY_SCANS: SavedCareSheet[] = [];
let cachedRawScans: string | null = null;
let cachedParsedScans: SavedCareSheet[] = EMPTY_SCANS;
const historyListeners = new Set<() => void>();

function notifyHistoryListeners() {
  historyListeners.forEach((listener) => listener());
}

function subscribeToRecentScans(listener: () => void): () => void {
  historyListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === RECENT_SCANS_STORAGE_KEY) {
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    historyListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getRecentScansSnapshot(): SavedCareSheet[] {
  if (typeof window === "undefined") {
    return EMPTY_SCANS;
  }
  try {
    const raw = window.localStorage.getItem(RECENT_SCANS_STORAGE_KEY);
    if (raw === cachedRawScans) {
      return cachedParsedScans;
    }
    cachedRawScans = raw;
    if (!raw) {
      cachedParsedScans = EMPTY_SCANS;
      return EMPTY_SCANS;
    }
    const parsed = JSON.parse(raw) as SavedCareSheet[];
    cachedParsedScans = Array.isArray(parsed)
      ? parsed.slice(0, MAX_RECENT_SCANS)
      : EMPTY_SCANS;
    return cachedParsedScans;
  } catch {
    return EMPTY_SCANS;
  }
}

function getServerScansSnapshot(): SavedCareSheet[] {
  return EMPTY_SCANS;
}

function persistCareSheet(result: MediPlainResult, language: Language) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentScansSnapshot();
    const filtered = existing.filter(
      (item) =>
        !(
          item.result.title === result.title &&
          item.result.documentType === result.documentType
        )
    );
    const nextEntry: SavedCareSheet = {
      id: `${Date.now()}`,
      savedAt: new Date().toISOString(),
      language,
      result,
    };
    const updated = [nextEntry, ...filtered].slice(0, MAX_RECENT_SCANS);
    const serialized = JSON.stringify(updated);
    window.localStorage.setItem(RECENT_SCANS_STORAGE_KEY, serialized);
    cachedRawScans = serialized;
    cachedParsedScans = updated;
    notifyHistoryListeners();
  } catch {
    // Ignore storage quota or private browsing errors gracefully.
  }
}

function clearPersistedCareSheets() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(RECENT_SCANS_STORAGE_KEY);
    cachedRawScans = null;
    cachedParsedScans = EMPTY_SCANS;
    notifyHistoryListeners();
  } catch {
    // Ignore storage errors gracefully.
  }
}

function compressImageToJpegBase64(
  file: File,
  maxDimension = 1280,
  quality = 0.8
): Promise<{ imageBase64: string; mimeType: "image/jpeg" }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();

    img.onload = () => {
      try {
        const { naturalWidth, naturalHeight } = img;
        const scale = Math.min(
          1,
          maxDimension / Math.max(naturalWidth, naturalHeight)
        );
        const targetWidth = Math.max(1, Math.round(naturalWidth * scale));
        const targetHeight = Math.max(1, Math.round(naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not initialize image canvas context."));
          return;
        }

        // Fill white before JPEG encoding so transparent PNG/WebP backgrounds stay readable.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const commaIndex = dataUrl.indexOf(",");
        const imageBase64 =
          commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;

        resolve({ imageBase64, mimeType: "image/jpeg" });
      } catch (err) {
        reject(
          err instanceof Error ? err : new Error("Failed to process image.")
        );
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load selected image."));
    };

    img.src = objectUrl;
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
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

  const recentScans = useSyncExternalStore(
    subscribeToRecentScans,
    getRecentScansSnapshot,
    getServerScansSnapshot
  );

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
    if (activePreset) {
      setResult(SAMPLE_PRESETS[nextLanguage][activePreset]);
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
    setActivePreset(null);
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
      const { imageBase64, mimeType } = await compressImageToJpegBase64(
        selectedFile
      );
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          language,
        }),
      });

      const rawText = await response.text();
      let data: (MediPlainResult & { error?: string }) | null = null;
      try {
        data = JSON.parse(rawText) as MediPlainResult & { error?: string };
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        setErrorMessage(
          data?.error ||
            `Server returned ${response.status}. ${copy.genericError}`
        );
        return;
      }

      setActivePreset(null);
      setResult(data);
      persistCareSheet(data, language);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : copy.genericError
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: PresetKey) => {
    setErrorMessage(null);
    setActivePreset(preset);
    setResult(SAMPLE_PRESETS[language][preset]);
  };

  const handleSelectRecent = (scan: SavedCareSheet) => {
    setErrorMessage(null);
    setActivePreset(null);
    setLanguage(scan.language);
    setResult(scan.result);
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setActivePreset(null);
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

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8 sm:py-12">
        {isAnalyzing ? (
          <ResultSkeleton copy={copy} />
        ) : result ? (
          <ResultDashboard
            key={`${result.title}-${language}-${activePreset ?? "doc"}`}
            result={result}
            language={language}
            copy={copy}
            isSample={activePreset !== null}
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
            recentScans={recentScans}
            onSelectFile={handleSelectFile}
            onClearFile={handleClearFile}
            onAnalyze={handleAnalyze}
            onSelectPreset={handleSelectPreset}
            onSelectRecent={handleSelectRecent}
            onClearHistory={clearPersistedCareSheets}
          />
        )}
      </main>

      <DisclaimerFooter disclaimer={copy.disclaimer} />
    </div>
  );
}
