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
import type {
  Appearance,
  InkColor,
  Nomenclature,
  PaperColor,
} from "@/lib/store";

const papers: { id: PaperColor; name: string }[] = [
  { id: "white", name: "Branco" },
  { id: "craft", name: "Craft" },
  { id: "sepia", name: "Sépia" },
  { id: "rose", name: "Rosa" },
  { id: "sage", name: "Verde" },
  { id: "blue", name: "Azul" },
];

const inks: { id: InkColor; name: string }[] = [
  { id: "graphite", name: "Grafite" },
  { id: "blue", name: "Azul" },
  { id: "red", name: "Vermelho" },
  { id: "light", name: "Branco" },
];

export function AppearanceFields({
  value,
  onChange,
}: {
  value: Appearance;
  onChange: (appearance: Appearance) => void;
}) {
  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Cor do papel</legend>
        <div className="flex flex-wrap gap-2">
          {papers.map((paper) => (
            <Button
              aria-label={`Papel ${paper.name}`}
              aria-pressed={value.paper === paper.id}
              className={`size-8 rounded-full bg-paper hover:bg-paper ${
                value.paper === paper.id
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : ""
              }`}
              data-paper={paper.id}
              key={paper.id}
              onClick={() => onChange({ ...value, paper: paper.id })}
              size="icon"
              title={paper.name}
              type="button"
              variant="outline"
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Cor do texto</legend>
        <div className="flex gap-2">
          {inks.map((ink) => (
            <Button
              aria-label={`Texto ${ink.name}`}
              aria-pressed={value.ink === ink.id}
              className={`size-8 rounded-full bg-paper-ink hover:bg-paper-ink ${
                value.ink === ink.id
                  ? "ring-2 ring-ring ring-offset-2 ring-offset-background"
                  : ""
              }`}
              data-ink={ink.id}
              key={ink.id}
              onClick={() => onChange({ ...value, ink: ink.id })}
              size="icon"
              title={ink.name}
              type="button"
              variant="outline"
            />
          ))}
        </div>
      </fieldset>
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
