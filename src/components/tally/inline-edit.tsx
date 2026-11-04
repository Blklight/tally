"use client";

import { useState } from "react";
import { HoldAction } from "@/components/fichas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/lib/i18n";
import {
  type Appearance,
  DEFAULT_APPEARANCE,
  type Series,
  trimSeriesToTotal,
} from "@/lib/store";
import {
  AppearanceFields,
  CategoryNomenclatureFields,
  TotalField,
} from "./appearance-fields";

export function InlineEdit({
  series,
  onClose,
  onUpdate,
  onAppearance,
  onDelete,
  onEditingChange,
}: {
  series: Series;
  onClose: () => void;
  onUpdate: (patch: Partial<Series>) => void;
  onAppearance: (appearance: Appearance) => void;
  onDelete: () => void;
  onEditingChange?: (editing: boolean) => void;
}) {
  const { t } = useLocale();
  const appearance = series.appearance ?? DEFAULT_APPEARANCE;
  const nomenclature = series.nomenclature ?? "volume";
  const [total, setTotal] = useState(String(series.total));

  const finish = () => {
    onEditingChange?.(false);
    onClose();
  };

  const commitTotal = (next: number) => {
    setTotal(String(next));
    if (next !== series.total) onUpdate(trimSeriesToTotal(series, next));
  };

  return (
    <div
      className="flex min-h-full flex-col gap-4 pb-10"
      onKeyDown={(event) => {
        if (event.key === "Escape") finish();
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-current/20 pb-3">
        <h3 className="font-display text-xl">{t("editCard")}</h3>
        <Button onClick={finish} size="sm" type="button" variant="ghost">
          {t("finish")}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-title">{t("title")}</Label>
        <Input
          defaultValue={series.title}
          id="inline-title"
          onBlur={(event) => {
            const title = event.target.value.trim();
            if (title && title !== series.title) onUpdate({ title });
          }}
          placeholder="Ex: Dragon Ball"
        />
      </div>

      <CategoryNomenclatureFields
        category={series.category}
        nomenclature={nomenclature}
        onChange={onUpdate}
      />

      <TotalField
        id="inline-total"
        nomenclature={nomenclature}
        onCommit={commitTotal}
        onValueChange={setTotal}
        value={total}
      />

      <AppearanceFields onChange={onAppearance} value={appearance} />

      <div className="mt-auto grid">
        <HoldAction
          label={t("deleteCard")}
          onComplete={() => {
            onEditingChange?.(false);
            onDelete();
          }}
        />
      </div>
    </div>
  );
}
