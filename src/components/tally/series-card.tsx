"use client";

import type { ReactNode } from "react";
import { Ficha, HoldRow } from "@/components/fichas";
import { type Appearance, type Series, volumeLabel } from "@/lib/store";
import { InlineEdit } from "./inline-edit";
import type { SortMode } from "./types";

export function SeriesCard({
  series,
  big,
  sort,
  sortButton,
  onUpdate,
  onAppearance,
  onDelete,
  onToggleVolume,
}: {
  series: Series;
  big?: boolean;
  sort: SortMode;
  sortButton: ReactNode;
  onUpdate: (patch: Partial<Series>) => void;
  onAppearance: (appearance: Appearance) => void;
  onDelete: () => void;
  onToggleVolume: (volume: number) => void;
}) {
  const volumes = Array.from({ length: series.total }, (_, index) => index + 1);
  const ordered =
    sort === "missing"
      ? [
          ...volumes.filter((volume) => series.missing.includes(volume)),
          ...volumes.filter((volume) => !series.missing.includes(volume)),
        ]
      : volumes;

  return (
    <Ficha
      actions={sortButton}
      appearance={series.appearance}
      big={big}
      category={`${series.category} / ${
        series.nomenclature === "Edição" ? "edições" : "volumes"
      }`}
      count={series.missing.length}
      editContent={
        <InlineEdit
          onAppearance={onAppearance}
          onClose={() => undefined}
          onDelete={onDelete}
          onUpdate={onUpdate}
          series={series}
        />
      }
      onEdit={() => undefined}
      summary={`${series.missing.length} faltantes · ${
        series.total - series.missing.length
      } na coleção · ${series.total} no total`}
      title={series.title}
    >
      {ordered.map((volume) => (
        <HoldRow
          checked={!series.missing.includes(volume)}
          key={volume}
          label={volumeLabel(series, volume)}
          onToggle={() => onToggleVolume(volume)}
        />
      ))}
    </Ficha>
  );
}
