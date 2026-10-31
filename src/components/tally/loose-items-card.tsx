"use client";

import { BookOpen, Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Ficha, HoldRow } from "@/components/fichas";
import { Button } from "@/components/ui/button";
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
  type Data,
  CATEGORIES,
  DEFAULT_APPEARANCE,
  type Category,
  type LooseItem,
} from "@/lib/store";
import { AppearanceFields } from "./appearance-fields";
import type { SortMode } from "./types";

function LooseItemsEdit({
  appearance,
  onChange,
  onEditingChange,
  onClose,
}: {
  appearance: Appearance;
  onChange: (appearance: Appearance) => void;
  onEditingChange?: (editing: boolean) => void;
  onClose?: () => void;
}) {
  const { t } = useLocale();
  const finish = () => {
    onEditingChange?.(false);
    onClose?.();
  };

  return (
    <div
      className="scrollbar-none flex min-h-full flex-col gap-4 overflow-y-auto pb-10"
      onKeyDown={(event) => {
        if (event.key === "Escape") finish();
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-current/20 pb-3">
        <h3 className="font-display text-xl">{t("editLoose")}</h3>
        <Button onClick={finish} size="sm" type="button" variant="ghost">
          {t("done")}
        </Button>
      </div>
      <AppearanceFields onChange={onChange} value={appearance} />
    </div>
  );
}

export function LooseItemsCard({
  data,
  big,
  sort,
  sortButton,
  query,
  onToggleItem,
  onAddItem,
  onAppearanceChange,
  appearance,
  items: itemsOverride,
  title,
}: {
  data: Data;
  big?: boolean;
  sort: SortMode;
  sortButton: ReactNode;
  query: string;
  onToggleItem: (item: LooseItem) => void;
  onAddItem: (title: string, category: Category) => void;
  onAppearanceChange: (appearance: Appearance) => void;
  appearance?: Appearance;
  items?: LooseItem[];
  title?: string;
}) {
  const { locale, t } = useLocale();
  const [newItem, setNewItem] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<Category>("book");

  const cardAppearance = appearance ?? data.looseAppearance;
  const sourceItems = itemsOverride ?? data.items;
  const normalizedQuery = query.trim().toLowerCase();
  const items = sourceItems.filter(
    (item) =>
      !normalizedQuery ||
      "avulsos".includes(normalizedQuery) ||
      item.title.toLowerCase().includes(normalizedQuery),
  );
  const ordered =
    sort === "missing"
      ? [
          ...items.filter((item) => !item.found),
          ...items.filter((item) => item.found),
        ]
      : items;

  const missingCount = sourceItems.filter((item) => !item.found).length;

  return (
    <Ficha
      actions={sortButton}
      appearance={cardAppearance}
      big={big}
      category="individual-items"
      count={missingCount}
      countLabel={t("manyMissing")}
      editContent={
        <LooseItemsEdit
          appearance={cardAppearance ?? DEFAULT_APPEARANCE}
          onChange={onAppearanceChange}
        />
      }
      onEdit={() => undefined}
      title={title ?? t("looseItems")}
    >
      {ordered.map((item) => (
        <HoldRow
          checked={!!item.found}
          key={item.id}
          label={item.title}
          note={
            item.category === "other"
              ? undefined
              : item.note || categoryLabel(item.category, locale)
          }
          onToggle={() => onToggleItem(item)}
        />
      ))}
      {items.length === 0 && (
        <div className="py-8 text-center">
          <BookOpen className="mx-auto mb-3 size-6 opacity-40" />
          <p className="text-sm opacity-60">{t("noLooseItems")}</p>
        </div>
      )}
      <form
        className="mt-3 flex items-center gap-2 px-3"
        onSubmit={(event) => {
          event.preventDefault();
          const title = newItem.trim();
          if (!title) return;
          onAddItem(title, newItemCategory);
          setNewItem("");
        }}
      >
        <Plus className="size-4 shrink-0 opacity-60" />
        <Select
          onValueChange={(value) => setNewItemCategory(value as Category)}
          value={newItemCategory}
        >
          <SelectTrigger
            aria-label={t("category")}
            className="h-9 w-32 shrink-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {categoryLabel(category, locale)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          aria-label={t("newLooseItem")}
          className="min-w-0 flex-1 border-b border-current/25 bg-transparent py-2 text-sm outline-none placeholder:text-current/40 focus:border-current"
          onChange={(event) => setNewItem(event.target.value)}
          placeholder={t("addItem")}
          value={newItem}
        />
      </form>
    </Ficha>
  );
}
