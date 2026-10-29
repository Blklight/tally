"use client";

import { Plus } from "lucide-react";
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
  appearance?: Appearance;
  onAppearanceChange?: (appearance: Appearance) => void;
}) {
  const { locale, t } = useLocale();
  const [title, setTitle] = useState("");
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
          onCreate(
            title.trim(),
            category,
            Math.max(1, Number(total) || 1),
            nomenclature,
            activeAppearance,
          );
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

      <div className="space-y-2">
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

      <NomenclatureField onChange={setNomenclature} value={nomenclature} />

      <div className="space-y-2">
        <Label htmlFor="create-total">
          {t("total")} {nomenclature === "issue" ? t("issue") : t("volume")}
        </Label>
        <Input
          id="create-total"
          min={1}
          onChange={(event) => setTotal(event.target.value)}
          required
          step={1}
          type="number"
          value={total}
        />
      </div>

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
