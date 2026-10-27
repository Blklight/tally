"use client";

import { BookOpen, Plus } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Ficha, HoldRow } from "@/components/fichas";
import { Button } from "@/components/ui/button";
import {
  type Appearance,
  type Data,
  DEFAULT_APPEARANCE,
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
        <h3 className="font-display text-xl">Editar Avulsos</h3>
        <Button onClick={finish} size="sm" type="button" variant="ghost">
          Concluir
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
}: {
  data: Data;
  big?: boolean;
  sort: SortMode;
  sortButton: ReactNode;
  query: string;
  onToggleItem: (item: LooseItem) => void;
  onAddItem: (title: string) => void;
  onAppearanceChange: (appearance: Appearance) => void;
}) {
  const [newItem, setNewItem] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const items = data.items.filter(
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

  return (
    <Ficha
      actions={sortButton}
      appearance={data.looseAppearance}
      big={big}
      category="Itens individuais"
      count={data.items.filter((item) => !item.found).length}
      editContent={
        <LooseItemsEdit
          appearance={data.looseAppearance ?? DEFAULT_APPEARANCE}
          onChange={onAppearanceChange}
        />
      }
      onEdit={() => undefined}
      summary={`${data.items.filter((item) => !item.found).length} faltantes · ${
        data.items.filter((item) => item.found).length
      } na coleção`}
      title="Avulsos"
    >
      {ordered.map((item) => (
        <HoldRow
          checked={!!item.found}
          key={item.id}
          label={item.title}
          note={item.note || item.category}
          onToggle={() => onToggleItem(item)}
        />
      ))}
      {items.length === 0 && (
        <div className="py-8 text-center">
          <BookOpen className="mx-auto mb-3 size-6 opacity-40" />
          <p className="text-sm opacity-60">Nenhum item avulso</p>
        </div>
      )}
      <form
        className="mt-3 flex items-center gap-2 px-3"
        onSubmit={(event) => {
          event.preventDefault();
          const title = newItem.trim();
          if (!title) return;
          onAddItem(title);
          setNewItem("");
        }}
      >
        <Plus className="size-4 shrink-0 opacity-60" />
        <input
          aria-label="Novo item avulso"
          className="min-w-0 flex-1 border-b border-current/25 bg-transparent py-2 text-sm outline-none placeholder:text-current/40 focus:border-current"
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Adicionar item…"
          value={newItem}
        />
      </form>
    </Ficha>
  );
}
