import type { UIStrings } from "@/lib/i18n";

interface ResultSkeletonProps {
  copy: UIStrings;
}

export function ResultSkeleton({ copy }: ResultSkeletonProps) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="space-y-6 py-2"
    >
      <div className="rounded-lg border border-border bg-surface p-6 hc-border">
        <p className="text-lg font-bold text-ink">{copy.loadingTitle}</p>
        <p className="mt-1 text-sm text-ink-muted">{copy.loadingSubtitle}</p>
        <div className="mt-5 h-3 w-48 animate-pulse rounded bg-surface-subtle" />
        <div className="mt-3 h-7 w-3/4 animate-pulse rounded bg-surface-subtle" />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 hc-border">
        <div className="h-4 w-36 animate-pulse rounded bg-surface-subtle" />
        <div className="mt-4 space-y-2.5">
          <div className="h-4 w-full animate-pulse rounded bg-surface-subtle" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-surface-subtle" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-surface-subtle" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((slot) => (
          <div
            key={slot}
            className="rounded-lg border border-border bg-surface p-5 hc-border"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-md bg-surface-subtle" />
              <div className="h-4 w-24 animate-pulse rounded bg-surface-subtle" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-surface-subtle" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-surface-subtle" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
