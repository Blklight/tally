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
    <div className="pointer-events-none relative z-10 h-0">
      <Button
        aria-label={t("previousCard")}
        className="pointer-events-auto absolute top-3 left-1 size-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={onPrevious}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label={t("nextCard")}
        className="pointer-events-auto absolute top-3 right-1 size-8 rounded-full bg-background/80 shadow-sm backdrop-blur-sm"
        onClick={onNext}
        size="icon"
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
