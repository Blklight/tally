"use client";

import {
  CircleHelp,
  Languages,
  Layers,
  List,
  Menu,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/tally/language-switcher";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navButtonClassName =
  "size-12 shrink-0 cursor-pointer rounded-xs border-0 bg-clip-border p-0 text-[#252525] outline-none hover:bg-[#252525] hover:text-[#eaeaea] focus-visible:ring-2 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-0 dark:text-[#eaeaea] dark:hover:bg-[#eaeaea] dark:hover:text-[#252525] [&_svg]:size-4.5";

const activeButtonClassName =
  "bg-[#252525] text-[#eaeaea] hover:bg-[#252525] hover:text-[#eaeaea] dark:bg-[#eaeaea] dark:text-[#252525] dark:hover:bg-[#eaeaea] dark:hover:text-[#252525]";

type NavbarProps = {
  mode: "stack" | "list";
  onModeChange: (mode: "stack" | "list") => void;
  onStartAdding: () => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function Navbar({
  mode,
  onModeChange,
  onStartAdding,
  query,
  onQueryChange,
}: NavbarProps) {
  const { t } = useLocale();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <header className="background-header background-texture rounded-b-xs px-0">
      <div className="col-span-3 flex h-full min-w-0 items-center justify-between gap-2">
        <Link
          className="shrink-0 pl-2 font-display text-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          Tally<span className="text-muted-foreground">.</span>
        </Link>

        <Dialog onOpenChange={setHelpOpen} open={helpOpen}>
          <Button
            aria-label={t("help")}
            className={navButtonClassName}
            onClick={() => setHelpOpen(true)}
            title={t("help")}
            variant="ghost"
          >
            <CircleHelp />
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("helpTitle")}</DialogTitle>
              <DialogDescription>{t("helpIntro")}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>{t("helpCreate")}</p>
              <p>{t("helpCheck")}</p>
              <p>{t("helpViews")}</p>
              <p>{t("helpNavigation")}</p>
            </div>
          </DialogContent>
        </Dialog>

        <div className="ml-auto flex h-full items-center">
          <Button
            aria-label={t("newCard")}
            className={navButtonClassName}
            onClick={onStartAdding}
            size="icon"
            title={t("newCard")}
            variant="ghost"
          >
            <Plus />
          </Button>

          <div className="hidden h-full items-center sm:flex">
            <Button
              aria-label={t("stackedCards")}
              aria-pressed={mode === "stack"}
              className={cn(
                navButtonClassName,
                mode === "stack" && activeButtonClassName,
              )}
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
              className={cn(
                navButtonClassName,
                mode === "list" && activeButtonClassName,
              )}
              onClick={() => onModeChange("list")}
              size="icon"
              title={t("continuousList")}
              variant="ghost"
            >
              <List />
            </Button>
            <LanguageSwitcher className={navButtonClassName} />
          </div>

          <NavbarMobileMenu
            mode={mode}
            onModeChange={onModeChange}
            onQueryChange={onQueryChange}
            query={query}
          />

          <AnimatedThemeToggler className={navButtonClassName} />
        </div>
      </div>
    </header>
  );
}

function NavbarMobileMenu({
  mode,
  onModeChange,
  query,
  onQueryChange,
}: Pick<NavbarProps, "mode" | "onModeChange" | "query" | "onQueryChange">) {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const nextLocale = locale === "pt-BR" ? "en" : "pt-BR";

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger
        aria-label={t("menu")}
        className={cn(navButtonClassName, "sm:hidden")}
        title={t("menu")}
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        className="sheet-surface flex w-[min(20rem,100vw)] flex-col px-5"
        side="right"
      >
        <SheetHeader className="px-0">
          <SheetTitle>{t("menu")}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("searchCards")}
            </p>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 opacity-50" />
              <Input
                aria-label={t("searchCards")}
                className="h-9 pl-7"
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={t("searchPlaceholder")}
                value={query}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("language")}
            </p>
            <Button
              className="w-full justify-between"
              onClick={() => {
                setLocale(nextLocale);
                setOpen(false);
              }}
              variant="outline"
            >
              <span>{locale === "pt-BR" ? t("portuguese") : t("english")}</span>
              <Languages />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("view")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                aria-pressed={mode === "stack"}
                className="justify-start"
                onClick={() => {
                  onModeChange("stack");
                  setOpen(false);
                }}
                variant={mode === "stack" ? "secondary" : "outline"}
              >
                <Layers />
                <span className="truncate">{t("stackedCards")}</span>
              </Button>
              <Button
                aria-pressed={mode === "list"}
                className="justify-start"
                onClick={() => {
                  onModeChange("list");
                  setOpen(false);
                }}
                variant={mode === "list" ? "secondary" : "outline"}
              >
                <List />
                <span className="truncate">{t("continuousList")}</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
