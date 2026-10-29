"use client";

import { HoldAction } from "@/components/fichas";
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
import {
  type Appearance,
  CATEGORIES,
  type Category,
  DEFAULT_APPEARANCE,
  type Series,
} from "@/lib/store";
import { AppearanceFields, NomenclatureField } from "./appearance-fields";

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
  const appearance = series.appearance ?? DEFAULT_APPEARANCE;

  return (
    <div
      className="flex min-h-full flex-col gap-4 pb-10"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onEditingChange?.(false);
          onClose();
        }
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-current/20 pb-3">
        <h3 className="font-display text-xl">Editar ficha</h3>
        <Button
          onClick={() => {
            onEditingChange?.(false);
            onClose();
          }}
          size="sm"
          type="button"
          variant="ghost"
        >
          Concluir
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inline-title">Título</Label>
        <Input
          defaultValue={series.title}
          id="inline-title"
          onBlur={(event) => {
            if (event.target.value.trim()) {
              onUpdate({ title: event.target.value.trim() });
            }
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select
          onValueChange={(category) =>
            onUpdate({ category: category as Category })
          }
          value={series.category}
        >
          <SelectTrigger aria-label="Categoria">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <NomenclatureField
        onChange={(nomenclature) => onUpdate({ nomenclature })}
        value={series.nomenclature ?? "volume"}
      />

      <div className="space-y-2">
        <Label htmlFor="inline-total">
          Total de {series.nomenclature === "issue" ? "edições" : "volumes"}
        </Label>
        <Input
          defaultValue={series.total}
          id="inline-total"
          min={1}
          onBlur={(event) => {
            const total = Math.max(
              1,
              Math.floor(Number(event.target.value) || series.total),
            );
            onUpdate({
              total,
              acquired: (series.acquired ?? []).filter(
                (volume) => volume <= total,
              ),
            });
          }}
          step={1}
          type="number"
        />
      </div>

      <AppearanceFields onChange={onAppearance} value={appearance} />

      <HoldAction
        label="Excluir ficha"
        onComplete={() => {
          onEditingChange?.(false);
          onDelete();
        }}
      />
    </div>
  );
}
