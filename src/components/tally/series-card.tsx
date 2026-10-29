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
          ...volumes.filter((volume) => !series.acquired?.includes(volume)),
          ...volumes.filter((volume) => series.acquired?.includes(volume)),
        ]
      : volumes;

  const acquiredCount = series.acquired?.length ?? 0;
  const missingCount = series.total - acquiredCount;
  const progressPercent = Math.round(
    (acquiredCount / (series.total || 1)) * 100,
  );
  const unit = series.nomenclature === "issue" ? "edições" : "volumes";

  const summary =
    missingCount === 0
      ? "Coleção completa!"
      : `${missingCount} ${missingCount === 1 ? "faltante" : "faltantes"}`;

  return (
    <Ficha
      actions={sortButton}
      appearance={series.appearance}
      big={big}
      category={`${series.category} / ${unit}`}
      count={progressPercent}
      countSuffix="%"
      countLabel={`${acquiredCount} de ${series.total} ${unit}`}
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
      summary={summary}
      title={series.title}
    >
      {ordered.map((volume) => (
        <HoldRow
          checked={series.acquired?.includes(volume) ?? false}
          key={volume}
          label={volumeLabel(series, volume)}
          onToggle={() => onToggleVolume(volume)}
        />
      ))}
    </Ficha>
  );
}
