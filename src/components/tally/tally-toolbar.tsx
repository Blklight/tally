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
    <div className="relative z-30 flex shrink-0 justify-center gap-6 px-0 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <Button
        aria-label={t("previousCard")}
        data-card-nav=""
        className="size-11 rounded-none border-0 bg-transparent p-0 shadow-none"
        onClick={onPrevious}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        aria-label={t("nextCard")}
        data-card-nav=""
        className="size-11 rounded-none border-0 bg-transparent p-0 shadow-none"
        onClick={onNext}
        size="icon"
        variant="ghost"
      >
        <ChevronRight className="size-6" />
      </Button>
    </div>
  );
}
