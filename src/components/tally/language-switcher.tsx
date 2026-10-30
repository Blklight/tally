"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Locale, useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();
  const nextLocale: Locale = locale === "pt-BR" ? "en" : "pt-BR";
  const label = nextLocale === "en" ? t("english") : t("portuguese");

  return (
    <Button
      aria-label={`${t("language")}: ${label}`}
      className={cn(
        "size-12 shrink-0 rounded-xs p-0 [&_svg]:size-4.5",
        className,
      )}
      onClick={() => setLocale(nextLocale)}
      size="icon"
      title={`${t("language")}: ${label}`}
      variant="ghost"
    >
      <Languages />
    </Button>
  );
}
