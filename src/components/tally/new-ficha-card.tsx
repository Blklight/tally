"use client";

import { Ficha } from "@/components/fichas";
import { useLocale } from "@/lib/i18n";
import type { Appearance, Category, Nomenclature } from "@/lib/store";
import { InlineCreate } from "./inline-create";

export function NewFichaCard({
  appearance,
  big,
  onAppearanceChange,
  onCancel,
  onCreate,
}: {
  appearance: Appearance;
  big?: boolean;
  onAppearanceChange: (appearance: Appearance) => void;
  onCancel: () => void;
  onCreate: (
    title: string,
    category: Category,
    total: number,
    nomenclature: Nomenclature,
    appearance: Appearance,
  ) => void;
}) {
  const { t } = useLocale();

  return (
    <Ficha
      appearance={appearance}
      big={big}
      category="other"
      editContent={
        <InlineCreate
          appearance={appearance}
          onAppearanceChange={onAppearanceChange}
          onCancel={onCancel}
          onCreate={onCreate}
        />
      }
      onEdit={() => undefined}
      onEditingChange={(editing) => {
        if (!editing) onCancel();
      }}
      startEditing
      summary={t("fillNewCollection")}
      title={t("newCardTitle")}
    >
      {null}
    </Ficha>
  );
}
