"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabel, useLocale } from "@/lib/i18n";
import {
  type Appearance,
  CATEGORIES,
  type Category,
  DEFAULT_APPEARANCE,
  type Nomenclature,
} from "@/lib/store";
import { AppearanceFields, NomenclatureField } from "./appearance-fields";

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
  const { locale, t } = useLocale();
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
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => setCardType("collection")}
            type="button"
            variant={cardType === "collection" ? "default" : "outline"}
          >
            {t("collectionCard")}
          </Button>
          <Button
            onClick={() => setCardType("loose")}
            type="button"
            variant={cardType === "loose" ? "default" : "outline"}
          >
            {t("looseCard")}
          </Button>
        </div>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <Label>{t("category")}</Label>
              <Select
                onValueChange={(next) => {
                  const nextCategory = next as Category;
                  setCategory(nextCategory);
                  setNomenclature(
                    nextCategory === "comic" || nextCategory === "magazine"
                      ? "issue"
                      : "volume",
                  );
                }}
                value={category}
              >
                <SelectTrigger aria-label={t("category")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {categoryLabel(item, locale)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-0">
              <NomenclatureField
                onChange={setNomenclature}
                value={nomenclature}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-total">
              {t("total")} {nomenclature === "issue" ? t("issue") : t("volume")}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                aria-label={t("decreaseTotal")}
                onClick={() =>
                  setTotal((currentTotal) =>
                    String(Math.max(1, Number(currentTotal) - 1)),
                  )
                }
                size="icon"
                type="button"
                variant="outline"
              >
                <Minus />
              </Button>
              <Input
                className="text-center"
                id="create-total"
                min={1}
                onChange={(event) => setTotal(event.target.value)}
                required
                step={1}
                type="number"
                value={total}
              />
              <Button
                aria-label={t("increaseTotal")}
                onClick={() =>
                  setTotal((currentTotal) =>
                    String(Math.max(1, Number(currentTotal) + 1)),
                  )
                }
                size="icon"
                type="button"
                variant="outline"
              >
                <Plus />
              </Button>
            </div>
          </div>
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
