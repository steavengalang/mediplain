import { ShieldAlert } from "lucide-react";

interface DisclaimerFooterProps {
  disclaimer: string;
}

export function DisclaimerFooter({ disclaimer }: DisclaimerFooterProps) {
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl items-start gap-3 px-4 py-5 sm:px-8">
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
          aria-hidden="true"
        />
        <p className="text-sm leading-relaxed text-ink-muted">{disclaimer}</p>
      </div>
    </footer>
  );
}
