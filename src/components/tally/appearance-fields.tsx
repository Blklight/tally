"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/lib/i18n";
import {
  type Appearance,
  getContrastInk,
  type Nomenclature,
  normalizeAppearance,
} from "@/lib/store";

const papers = [
  { id: "#fffdf7", name: "Branco" },
  { id: "#d7bc8b", name: "Craft" },
  { id: "#a98968", name: "Sépia" },
  { id: "#ead1d0", name: "Rosa" },
  { id: "#c9d9c4", name: "Verde" },
  { id: "#c9d9e8", name: "Azul" },
];

export function AppearanceFields({
  value,
  onChange,
}: {
  value: Appearance;
  onChange: (appearance: Appearance) => void;
}) {
  const { t } = useLocale();
  const appearance = normalizeAppearance(value);
  const setPaper = (paper: string) =>
    onChange({ paper, ink: getContrastInk(paper) });

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">{t("paperColor")}</legend>
        <div className="flex flex-wrap items-center gap-2">
          {papers.map((paper) => (
            <Button
              aria-label={`Papel ${paper.name}`}
              aria-pressed={appearance.paper === paper.id}
              className={`size-8 rounded-full bg-transparent p-0 ${
                appearance.paper === paper.id
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : ""
              }`}
              key={paper.id}
              onClick={() => setPaper(paper.id)}
              size="icon"
              style={{ backgroundColor: paper.id }}
              title={paper.name}
              type="button"
              variant="outline"
            />
          ))}
          <label
            className="relative size-8 cursor-pointer overflow-hidden rounded-full border border-border"
            title={t("customColor")}
          >
            <span className="sr-only">{t("customColor")}</span>
            <input
              aria-label={t("customColor")}
              className="absolute inset-[-8px] size-12 cursor-pointer"
              onChange={(event) => setPaper(event.target.value)}
              type="color"
              value={appearance.paper}
            />
          </label>
        </div>
      </fieldset>
      <p className="text-xs text-muted-foreground">{t("contrastHint")}</p>
    </div>
  );
}

export function NomenclatureField({
  value,
  onChange,
}: {
  value: Nomenclature;
  onChange: (value: Nomenclature) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{t("nomenclature")}</Label>
      <Select
        onValueChange={(next) => onChange(next as Nomenclature)}
        value={value}
      >
        <SelectTrigger aria-label={t("nomenclature")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="volume">Volume</SelectItem>
          <SelectItem value="issue">{t("issue")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
