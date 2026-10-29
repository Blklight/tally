"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Locale, useLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();
  const nextLocale: Locale = locale === "pt-BR" ? "en" : "pt-BR";
  const label = nextLocale === "en" ? t("english") : t("portuguese");

  return (
    <Button
      aria-label={`${t("language")}: ${label}`}
      className="gap-1.5 px-2 text-xs"
      onClick={() => setLocale(nextLocale)}
      size="sm"
      title={`${t("language")}: ${label}`}
      variant="ghost"
    >
      <Languages data-icon="inline-start" />
      <span>{locale === "pt-BR" ? "PT" : "EN"}</span>
    </Button>
  );
}
