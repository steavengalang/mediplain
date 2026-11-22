import type { UIStrings } from "@/lib/i18n";

interface ResultSkeletonProps {
  copy: UIStrings;
}

export function ResultSkeleton({ copy }: ResultSkeletonProps) {
  return (
    <section
      aria-live="polite"
      aria-busy="true"
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-5 space-y-6">
        <div className="border-b border-border pb-6">
          <p className="text-base font-bold text-ink">{copy.loadingTitle}</p>
          <p className="mt-1 text-sm text-ink-muted">{copy.loadingSubtitle}</p>
          <div className="mt-5 h-8 w-4/5 animate-pulse rounded-sm bg-surface-subtle" />
          <div className="mt-4 flex gap-3">
            <div className="h-11 w-36 animate-pulse rounded-sm bg-surface-subtle" />
            <div className="h-11 w-40 animate-pulse rounded-sm bg-surface-subtle" />
          </div>
        </div>

        <div className="space-y-2.5 border-b border-border pb-6">
          <div className="h-3 w-32 animate-pulse rounded-sm bg-surface-subtle" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-surface-subtle" />
          <div className="h-4 w-11/12 animate-pulse rounded-sm bg-surface-subtle" />
          <div className="h-4 w-3/4 animate-pulse rounded-sm bg-surface-subtle" />
        </div>

        <div className="border-l-4 border-border pl-4 space-y-2.5">
          <div className="h-4 w-44 animate-pulse rounded-sm bg-surface-subtle" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-surface-subtle" />
          <div className="h-4 w-5/6 animate-pulse rounded-sm bg-surface-subtle" />
        </div>
      </div>

      <div className="lg:col-span-7 space-y-8">
        <div>
          <div className="h-3 w-36 animate-pulse rounded-sm bg-surface-subtle" />
          <div className="mt-4 divide-y divide-border border-t border-b border-border">
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                className="grid grid-cols-1 gap-3 py-5 sm:grid-cols-12"
              >
                <div className="sm:col-span-3 h-8 w-20 animate-pulse rounded-sm bg-surface-subtle" />
                <div className="sm:col-span-9 space-y-2">
                  <div className="h-4 w-24 animate-pulse rounded-sm bg-surface-subtle" />
                  <div className="h-4 w-full animate-pulse rounded-sm bg-surface-subtle" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
