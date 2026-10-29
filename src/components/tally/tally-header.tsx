"use client";

import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  List,
  Plus,
  Search,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/tally/language-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";

export function TallyHeader({
  mode,
  onModeChange,
  onOpenIndex,
  onStartAdding,
  cardCount,
  missingCount,
  canNavigate,
  onPrevious,
  onNext,
  query,
  onQueryChange,
}: {
  mode: "stack" | "list";
  onModeChange: (mode: "stack" | "list") => void;
  onOpenIndex: () => void;
  onStartAdding: () => void;
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
    <header className="mb-4 w-full shrink-0">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-medium sm:text-3xl">
          Tally<span className="text-muted-foreground">.</span>
        </h1>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <Button
            aria-label={t("stackedCards")}
            aria-pressed={mode === "stack"}
            className={mode === "stack" ? "bg-secondary" : ""}
            onClick={() => onModeChange("stack")}
            size="icon"
            title={t("stackedCards")}
            variant="ghost"
          >
            <Layers />
          </Button>
          <Button
            aria-label={t("continuousList")}
            aria-pressed={mode === "list"}
            className={mode === "list" ? "bg-secondary" : ""}
            onClick={() => onModeChange("list")}
            size="icon"
            title={t("continuousList")}
            variant="ghost"
          >
            <List />
          </Button>
          <span className="mx-1 h-5 border-l border-border" />
          <Button
            aria-label={t("index")}
            onClick={onOpenIndex}
            size="icon"
            title={t("index")}
            variant="ghost"
          >
            <BookOpen />
          </Button>
          <Button
            aria-label={t("newCard")}
            className="ml-1"
            onClick={onStartAdding}
            size="sm"
            variant="outline"
          >
            <Plus />
            <span className="hidden sm:inline">{t("newCard")}</span>
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-b border-border pb-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
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
    </header>
  );
}
