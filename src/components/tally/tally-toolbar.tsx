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
    <div className="relative z-30 flex shrink-0 justify-center gap-2 px-0 py-1">
      <Button
        aria-label={t("previousCard")}
        className="size-8 rounded-none border-0 bg-transparent p-0 shadow-none"
        onClick={onPrevious}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft />
      </Button>
      <Button
        aria-label={t("nextCard")}
        className="size-8 rounded-none border-0 bg-transparent p-0 shadow-none"
        onClick={onNext}
        size="icon"
        variant="ghost"
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
