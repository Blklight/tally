"use client";

import { ArrowDownToLine, CircleHelp, Plus, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { HelpDialog } from "@/components/help-dialog";
import { InstallDialog } from "@/components/install-dialog";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/i18n";
import { useInstallPrompt } from "@/lib/use-install-prompt";

const CommandMenu = dynamic(
  () => import("./command-menu").then((module) => module.CommandMenu),
  { ssr: false },
);

const navButtonClassName =
  "size-12 shrink-0 cursor-pointer rounded-none border-0 bg-clip-border p-0 text-[#252525] outline-none hover:bg-[#252525] hover:text-[#eaeaea] focus-visible:ring-2 focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-0 dark:text-[#eaeaea] dark:hover:bg-[#eaeaea] dark:hover:text-[#252525] [&_svg]:size-4.5";

type NavbarProps = {
  cardCount: number;
  missingCount: number;
  mode: "stack" | "list";
  onExport: () => void;
  onImport: (json: string) => { imported: number; error?: string };
  onModeChange: (mode: "stack" | "list") => void;
  onStartAdding: () => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function Navbar({
  cardCount,
  missingCount,
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
  const [commandRequested, setCommandRequested] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [installOpen, setInstallOpen] = useState(false);
  const install = useInstallPrompt();

  const startInstall = async () => {
    setCommandOpen(false);
    if (install.canPrompt) {
      if (await install.prompt()) toast.success(t("installDone"));
      return;
    }
    setInstallOpen(true);
  };

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

          <Button
            aria-label={t("commandMenu")}
            className={navButtonClassName}
            onClick={() => {
              setCommandRequested(true);
              setCommandOpen(true);
            }}
            onFocus={() => setCommandRequested(true)}
            onPointerEnter={() => setCommandRequested(true)}
            title={t("commandMenu")}
            variant="ghost"
          >
            <Sparkles />
          </Button>
          <AnimatedThemeToggler className={navButtonClassName} />
          {!install.installed && (install.canPrompt || install.ios) && (
            <Button
              aria-label={t("installApp")}
              className={navButtonClassName}
              onClick={startInstall}
              size="icon"
              title={t("installApp")}
              variant="ghost"
            >
              <ArrowDownToLine />
            </Button>
          )}
          <Button
            aria-label={t("help")}
            className={navButtonClassName}
            onClick={() => setHelpOpen(true)}
            size="icon"
            title={t("help")}
            variant="ghost"
          >
            <CircleHelp />
          </Button>
        </div>
      </div>

      {commandRequested && (
        <CommandMenu
          cardCount={cardCount}
          commandOpen={commandOpen}
          missingCount={missingCount}
          mode={mode}
          onCommandOpenChange={setCommandOpen}
          onExport={onExport}
          onHelp={() => {
            setCommandOpen(false);
            setHelpOpen(true);
          }}
          onInstall={install.installed ? undefined : startInstall}
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
      )}

      <HelpDialog onOpenChange={setHelpOpen} open={helpOpen} />
      <InstallDialog
        ios={install.ios}
        onOpenChange={setInstallOpen}
        open={installOpen}
      />

      <Dialog onOpenChange={setImportOpen} open={importOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("importData")}</DialogTitle>
            <DialogDescription>{t("importDataDescription")}</DialogDescription>
          </DialogHeader>
          <Textarea
            aria-label={t("importData")}
            className="max-h-[40svh] overflow-y-auto"
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
                toast.success(
                  result.imported === 0
                    ? t("nothingImported")
                    : `${result.imported} ${result.imported === 1 ? t("importedOne") : t("importedCount")}`,
                );
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
