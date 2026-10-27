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
  const appearance = normalizeAppearance(value);
  const setPaper = (paper: string) =>
    onChange({ paper, ink: getContrastInk(paper) });

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Cor do papel</legend>
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
            title="Escolher cor personalizada"
          >
            <span className="sr-only">Escolher cor personalizada</span>
            <input
              aria-label="Escolher cor personalizada"
              className="absolute inset-[-8px] size-12 cursor-pointer"
              onChange={(event) => setPaper(event.target.value)}
              type="color"
              value={appearance.paper}
            />
          </label>
        </div>
      </fieldset>
      <p className="text-xs text-muted-foreground">
        A cor do texto é definida automaticamente para manter o contraste.
      </p>
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
      <Label>Nomenclatura</Label>
      <Select
        onValueChange={(next) => onChange(next as Nomenclature)}
        value={value}
      >
        <SelectTrigger aria-label="Nomenclatura">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Volume">Volume</SelectItem>
          <SelectItem value="Edição">Edição</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
