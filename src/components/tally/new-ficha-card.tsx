"use client";

import { Ficha } from "@/components/fichas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";
import type { Appearance, Category, Nomenclature } from "@/lib/store";
import { InlineCreate } from "./inline-create";
import { useState } from "react";

export function NewFichaCard({
  appearance,
  big,
  onAppearanceChange,
  onCancel,
  onCreate,
  onCreateLoose,
}: {
  appearance: Appearance;
  big?: boolean;
  onAppearanceChange: (appearance: Appearance) => void;
  onCancel: () => void;
  onCreateLoose: (title: string) => void;
  onCreate: (
    title: string,
    category: Category,
    total: number,
    nomenclature: Nomenclature,
    appearance: Appearance,
  ) => void;
}) {
  const { t } = useLocale();
  const [looseTitle, setLooseTitle] = useState("");

  const createLoose = () => {
    const title = looseTitle.trim();
    if (!title) return;
    onCreateLoose(title);
    setLooseTitle("");
  };

  return (
    <Ficha
      appearance={appearance}
      big={big}
      category="other"
      editContent={
        <div className="flex flex-col gap-4">
          <InlineCreate
            appearance={appearance}
            onAppearanceChange={onAppearanceChange}
            onCancel={onCancel}
            onCreate={onCreate}
          />
          <div className="flex flex-col gap-2 border-t border-current/15 pt-4">
            <span className="text-xs uppercase tracking-widest opacity-60">
              {t("looseItems")}
            </span>
            <div className="flex items-center gap-2">
              <Input
                aria-label={t("newLooseItem")}
                onChange={(event) => setLooseTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    createLoose();
                  }
                }}
                placeholder={t("addItem")}
                value={looseTitle}
              />
              <Button onClick={createLoose} type="button">
                {t("addItem")}
              </Button>
            </div>
          </div>
        </div>
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
