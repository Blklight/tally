"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

export function TallyToolbar({
  canNavigate,
  onPrevious,
  onNext,
}: {
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { t } = useLocale();

  if (!canNavigate) return null;

  return (
    <div className="relative z-30 flex shrink-0 justify-between gap-4 px-4 py-6 pr-16 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-0 sm:h-0 sm:px-0 sm:py-0">
      <Button
        aria-label={t("previousCard")}
        className="pointer-events-auto size-10 rounded-none border border-current/15 bg-background/75 shadow-sm backdrop-blur-sm sm:absolute sm:top-3 sm:left-1 sm:size-8 sm:border-0"
        onClick={onPrevious}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label={t("nextCard")}
        className="pointer-events-auto size-10 rounded-none border border-current/15 bg-background/75 shadow-sm backdrop-blur-sm sm:absolute sm:top-3 sm:right-1 sm:size-8 sm:border-0"
        onClick={onNext}
        size="icon"
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
