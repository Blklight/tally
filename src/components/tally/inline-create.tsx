"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/lib/i18n";
import {
  type Appearance,
  type Category,
  DEFAULT_APPEARANCE,
  type Nomenclature,
} from "@/lib/store";
import {
  AppearanceFields,
  CategoryNomenclatureFields,
  TotalField,
} from "./appearance-fields";

export function InlineCreate({
  onCancel,
  onCreate,
  onCreateLoose,
  appearance = DEFAULT_APPEARANCE,
  onAppearanceChange,
}: {
  onCancel: () => void;
  onCreate: (
    title: string,
    category: Category,
    total: number,
    nomenclature: Nomenclature,
    appearance: Appearance,
  ) => void;
  onCreateLoose: (title: string, appearance: Appearance) => void;
  appearance?: Appearance;
  onAppearanceChange?: (appearance: Appearance) => void;
}) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [cardType, setCardType] = useState<"collection" | "loose">(
    "collection",
  );
  const [category, setCategory] = useState<Category>("manga");
  const [total, setTotal] = useState("1");
  const [nomenclature, setNomenclature] = useState<Nomenclature>("volume");
  const [localAppearance, setLocalAppearance] =
    useState<Appearance>(appearance);

  const activeAppearance = appearance ?? localAppearance;
  const handleAppearanceChange = (next: Appearance) => {
    setLocalAppearance(next);
    onAppearanceChange?.(next);
  };

  return (
    <form
      className="flex min-h-full flex-col gap-4 pb-10"
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
      }}
      onPointerDown={(event) => event.stopPropagation()}
      onSubmit={(event) => {
        event.preventDefault();
        if (title.trim()) {
          if (cardType === "loose") {
            onCreateLoose(title.trim(), activeAppearance);
          } else {
            onCreate(
              title.trim(),
              category,
              Math.max(1, Number(total) || 1),
              nomenclature,
              activeAppearance,
            );
          }
        }
      }}
    >
      <div className="flex items-center justify-between border-b border-current/20 pb-3">
        <h3 className="font-display text-xl">{t("newCardTitle")}</h3>
        <Button
          aria-label={t("cancel")}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          {t("cancel")}
        </Button>
      </div>

      <div className="space-y-2">
        <Label>{t("cardType")}</Label>
        <fieldset
          aria-label={t("cardType")}
          className="grid min-w-0 grid-cols-2 gap-1 rounded-md border border-border p-1"
        >
          {(
            [
              ["collection", t("collectionCard")],
              ["loose", t("looseCard")],
            ] as const
          ).map(([value, label]) => (
            <Button
              aria-pressed={cardType === value}
              className="h-8"
              key={value}
              onClick={() => setCardType(value)}
              type="button"
              variant={cardType === value ? "default" : "ghost"}
            >
              {label}
            </Button>
          ))}
        </fieldset>
        {cardType === "loose" && (
          <p className="text-xs text-muted-foreground">
            {t("looseCardDescription")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-title">{t("title")}</Label>
        <Input
          autoFocus
          id="create-title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ex: Dragon Ball"
          required
          value={title}
        />
      </div>

      {cardType === "collection" && (
        <>
          <CategoryNomenclatureFields
            category={category}
            nomenclature={nomenclature}
            onChange={(patch) => {
              if (patch.category) setCategory(patch.category);
              setNomenclature(patch.nomenclature);
            }}
          />
          <TotalField
            id="create-total"
            nomenclature={nomenclature}
            onValueChange={setTotal}
            value={total}
          />
        </>
      )}

      <AppearanceFields
        onChange={handleAppearanceChange}
        value={activeAppearance}
      />

      <Button className="mt-auto" type="submit">
        <Plus /> {t("create")}
      </Button>
    </form>
  );
}
