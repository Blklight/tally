"use client";

import {
  CircleHelp,
  Download,
  Languages,
  Layers,
  List,
  Moon,
  Plus,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n";

const navButtonClassName =
  "size-12 shrink-0 cursor-pointer rounded-none border-0 bg-clip-border p-0 text-[#252525] outline-none hover:bg-[#252525] hover:text-[#eaeaea] focus-visible:ring-2 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-0 dark:text-[#eaeaea] dark:hover:bg-[#eaeaea] dark:hover:text-[#252525] [&_svg]:size-4.5";

type NavbarProps = {
  mode: "stack" | "list";
  onExport: () => void;
  onImport: (json: string) => { imported: number; error?: string };
  onModeChange: (mode: "stack" | "list") => void;
  onStartAdding: () => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function Navbar({
  mode,
  onExport,
  onImport,
  onModeChange,
  onStartAdding,
  query,
  onQueryChange,
}: NavbarProps) {
  const { t } = useLocale();
  const [commandOpen, setCommandOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");

  return (
    <header className="background-header background-texture rounded-b-xs px-0">
      <div className="col-span-3 flex h-full min-w-0 items-center justify-between gap-2">
        <Link
          className="shrink-0 pl-2 font-display text-xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/"
        >
          Tally<span className="text-muted-foreground">.</span>
        </Link>

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

          <AnimatedThemeToggler className={navButtonClassName} />
          <Button
            aria-label={t("commandMenu")}
            className={navButtonClassName}
            onClick={() => setCommandOpen(true)}
            title={t("commandMenu")}
            variant="ghost"
          >
            <Sparkles />
          </Button>
        </div>
      </div>

      <CommandMenu
        commandOpen={commandOpen}
        mode={mode}
        onCommandOpenChange={setCommandOpen}
        onExport={onExport}
        onHelp={() => {
          setCommandOpen(false);
          setHelpOpen(true);
        }}
        onImportOpen={() => {
          setCommandOpen(false);
          setImportError("");
          setImportOpen(true);
        }}
        onModeChange={onModeChange}
        onQueryChange={onQueryChange}
        onStartAdding={onStartAdding}
        query={query}
      />

      <Dialog onOpenChange={setHelpOpen} open={helpOpen}>
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
            <p>{t("helpGestures")}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setImportOpen} open={importOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("importData")}</DialogTitle>
            <DialogDescription>{t("importDataDescription")}</DialogDescription>
          </DialogHeader>
          <Textarea
            aria-label={t("importData")}
            onChange={(event) => setImportText(event.target.value)}
            placeholder='{"series": [], "items": []}'
            rows={10}
            value={importText}
          />
          {importError && (
            <p className="text-sm text-destructive">{importError}</p>
          )}
          <div className="flex justify-end gap-2">
            <Button onClick={() => setImportOpen(false)} variant="ghost">
              {t("cancel")}
            </Button>
            <Button
              onClick={() => {
                const result = onImport(importText);
                if (result.error) {
                  setImportError(result.error);
                  return;
                }
                setImportText("");
                setImportOpen(false);
              }}
            >
              {t("import")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function CommandMenu({
  commandOpen,
  mode,
  onCommandOpenChange,
  onExport,
  onHelp,
  onImportOpen,
  onModeChange,
  onQueryChange,
  onStartAdding,
  query,
}: {
  commandOpen: boolean;
  mode: "stack" | "list";
  onCommandOpenChange: (open: boolean) => void;
  onExport: () => void;
  onHelp: () => void;
  onImportOpen: () => void;
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
      <Command>
        <CommandInput
          onValueChange={onQueryChange}
          placeholder={t("commandPlaceholder")}
          value={query}
        />
        <CommandList>
          <CommandEmpty>{t("noCommands")}</CommandEmpty>
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
            <CommandItem onSelect={() => run(() => onModeChange("stack"))}>
              <Layers />
              {t("stackedCards")}
              {mode === "stack" && <CommandShortcut>Ativo</CommandShortcut>}
            </CommandItem>
            <CommandItem onSelect={() => run(() => onModeChange("list"))}>
              <List />
              {t("continuousList")}
              {mode === "list" && <CommandShortcut>Ativo</CommandShortcut>}
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
