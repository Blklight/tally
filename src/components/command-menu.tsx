"use client";

import {
  ArrowDownToLine,
  BookOpen,
  CircleHelp,
  Download,
  Languages,
  Layers,
  List,
  Moon,
  Plus,
  Search,
  Sun,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useLocale } from "@/lib/i18n";

export function CommandMenu({
  cardCount,
  commandOpen,
  missingCount,
  mode,
  onCommandOpenChange,
  onExport,
  onHelp,
  onImportOpen,
  onInstall,
  onModeChange,
  onQueryChange,
  onStartAdding,
  query,
}: {
  cardCount: number;
  commandOpen: boolean;
  missingCount: number;
  mode: "stack" | "list";
  onCommandOpenChange: (open: boolean) => void;
  onExport: () => void;
  onHelp: () => void;
  onImportOpen: () => void;
  onInstall?: (() => void) | undefined;
  onModeChange: (mode: "stack" | "list") => void;
  onQueryChange: (query: string) => void;
  onStartAdding: () => void;
  query: string;
}) {
  const { locale, setLocale, t } = useLocale();
  const { setTheme } = useTheme();

  const run = (action: () => void) => {
    action();
    onCommandOpenChange(false);
  };

  return (
    <CommandDialog
      description={t("commandDescription")}
      onOpenChange={onCommandOpenChange}
      open={commandOpen}
      title={t("commandMenu")}
    >
      <Command shouldFilter={false}>
        <CommandInput
          onValueChange={onQueryChange}
          placeholder={t("commandPlaceholder")}
          value={query}
        />
        <CommandList>
          <CommandEmpty>{t("noCommands")}</CommandEmpty>
          {query && (
            <CommandGroup heading={t("commandSearch")}>
              <CommandItem onSelect={() => onCommandOpenChange(false)}>
                <Search />
                {t("showFiltered")}
                <CommandShortcut>{query}</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          )}
          <CommandGroup heading={t("commandOverview")}>
            <CommandItem disabled>
              <span className="font-mono text-xs">
                {String(cardCount).padStart(2, "0")}{" "}
                {cardCount === 1 ? t("card") : t("cards")} · {missingCount}{" "}
                {t("missing")}
              </span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("commandActions")}>
            <CommandItem onSelect={() => run(onStartAdding)}>
              <Plus />
              {t("newCard")}
              <CommandShortcut>N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => run(onExport)}>
              <Download />
              {t("exportData")}
            </CommandItem>
            <CommandItem onSelect={onImportOpen}>
              <Upload />
              {t("importData")}
            </CommandItem>
            {onInstall && (
              <CommandItem onSelect={onInstall}>
                <ArrowDownToLine />
                {t("installApp")}
              </CommandItem>
            )}
            <CommandItem onSelect={() => run(() => onModeChange("stack"))}>
              <Layers />
              {t("stackedCards")}
              {mode === "stack" && (
                <CommandShortcut>{t("active")}</CommandShortcut>
              )}
            </CommandItem>
            <CommandItem onSelect={() => run(() => onModeChange("list"))}>
              <List />
              {t("continuousList")}
              {mode === "list" && (
                <CommandShortcut>{t("active")}</CommandShortcut>
              )}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("commandPreferences")}>
            <CommandItem
              onSelect={() =>
                run(() => setLocale(locale === "pt-BR" ? "en" : "pt-BR"))
              }
            >
              <Languages />
              {t("language")}:{" "}
              {locale === "pt-BR" ? t("portuguese") : t("english")}
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("light"))}>
              <Sun />
              {t("light")}
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("dark"))}>
              <Moon />
              {t("dark")}
            </CommandItem>
            <CommandItem onSelect={() => run(() => setTheme("book"))}>
              <BookOpen />
              {t("book")}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("commandHelp")}>
            <CommandItem onSelect={onHelp}>
              <CircleHelp />
              {t("help")}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
