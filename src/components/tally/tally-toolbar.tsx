"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";

export function TallyToolbar({
  cardCount,
  missingCount,
  canNavigate,
  onPrevious,
  onNext,
  query,
  onQueryChange,
}: {
  cardCount: number;
  missingCount: number;
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const { t } = useLocale();

  return (
    <div className="flex shrink-0 flex-col gap-3 border-b border-border py-1 px-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        {String(cardCount).padStart(2, "0")} {t("cards")} · {missingCount}{" "}
        {t("missing")}
      </span>
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-50" />
          <Input
            aria-label={t("searchCards")}
            className="h-8 pl-7 text-xs"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            value={query}
          />
        </div>
        {canNavigate && (
          <span className="flex items-center gap-1">
            <Button
              aria-label={t("previousCard")}
              className="size-7"
              onClick={onPrevious}
              size="icon"
              variant="ghost"
            >
              <ChevronLeft />
            </Button>
            <Button
              aria-label={t("nextCard")}
              className="size-7"
              onClick={onNext}
              size="icon"
              variant="ghost"
            >
              <ChevronRight />
            </Button>
          </span>
        )}
      </div>
    </div>
  );
}
