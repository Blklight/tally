"use client";

import { BookOpen, Layers, List, Plus } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/tally/language-switcher";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

type NavbarProps = {
  mode: "stack" | "list";
  onModeChange: (mode: "stack" | "list") => void;
  onOpenIndex: () => void;
  onStartAdding: () => void;
};

export function Navbar({
  mode,
  onModeChange,
  onOpenIndex,
  onStartAdding,
}: NavbarProps) {
  const { t } = useLocale();

  return (
    <header className="background-header background-texture rounded-b-xs px-1">
      <div className="col-span-3 flex h-full min-w-0 items-center justify-between gap-2">
        <Link
          className="shrink-0 font-display text-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          Tally<span className="text-muted-foreground">.</span>
        </Link>

        <div className="flex min-w-0 items-center justify-center gap-1">
          <Button
            aria-label={t("stackedCards")}
            aria-pressed={mode === "stack"}
            className={mode === "stack" ? "bg-secondary" : ""}
            onClick={() => onModeChange("stack")}
            size="icon-sm"
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
            size="icon-sm"
            title={t("continuousList")}
            variant="ghost"
          >
            <List />
          </Button>

          <span className="mx-1 h-5 border-l border-border" />

          <Button
            aria-label={t("index")}
            className="gap-1.5 px-2"
            onClick={onOpenIndex}
            size="sm"
            title={t("index")}
            variant="ghost"
          >
            <BookOpen />
            <span className="hidden sm:inline">{t("index")}</span>
          </Button>
          <Button
            aria-label={t("newCard")}
            className="gap-1.5 px-2"
            onClick={onStartAdding}
            size="sm"
            title={t("newCard")}
            variant="outline"
          >
            <Plus />
            <span className="hidden sm:inline">{t("newCard")}</span>
          </Button>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1">
          <LanguageSwitcher />
          <AnimatedThemeToggler className="size-12 px-0" />
        </div>
      </div>
    </header>
  );
}
