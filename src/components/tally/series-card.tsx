"use client";

import { memo, type RefObject, useRef } from "react";
import { Ficha, HoldRow } from "@/components/fichas";
import { categoryLabel, useLocale } from "@/lib/i18n";
import {
  type Appearance,
  normalizeSort,
  type Series,
  type SortPreference,
  sortEntries,
  volumeLabel,
} from "@/lib/store";
import { InlineEdit } from "./inline-edit";
import { SortMenu } from "./sort-menu";

type VolumeHandlers = {
  onToggleVolume: (volume: number) => void;
  onTogglePriority: (volume: number) => void;
  onEditNote: (volume: number, note: string) => void;
};

const VolumeRow = memo(function VolumeRow({
  volume,
  label,
  note,
  checked,
  priority,
  handlers,
}: {
  volume: number;
  label: string;
  note: string | undefined;
  checked: boolean;
  priority: boolean;
  handlers: RefObject<VolumeHandlers>;
}) {
  return (
    <HoldRow
      checked={checked}
      label={label}
      note={note}
      onEditNote={(value) => handlers.current.onEditNote(volume, value)}
      onToggle={() => handlers.current.onToggleVolume(volume)}
      onTogglePriority={() => handlers.current.onTogglePriority(volume)}
      priority={priority}
    />
  );
});

export function SeriesCard({
  series,
  big,
  onSortChange,
  onUpdate,
  onAppearance,
  onDelete,
  onToggleVolume,
  onTogglePriority,
  onEditNote,
}: {
  series: Series;
  big?: boolean;
  onSortChange: (sort: SortPreference) => void;
  onUpdate: (patch: Partial<Series>) => void;
  onAppearance: (appearance: Appearance) => void;
  onDelete: () => void;
  onToggleVolume: (volume: number) => void;
  onTogglePriority: (volume: number) => void;
  onEditNote: (volume: number, note: string) => void;
}) {
  const { locale, t } = useLocale();
  const handlers = useRef<VolumeHandlers>({
    onToggleVolume,
    onTogglePriority,
    onEditNote,
  });
  handlers.current = { onToggleVolume, onTogglePriority, onEditNote };
  const volumes = Array.from({ length: series.total }, (_, index) => index + 1);
  const acquired = new Set(series.acquired);
  const priorities = new Set(series.priorityVolumes);
  const sort = normalizeSort(series.sort);
  const ordered = sortEntries(
    volumes,
    sort,
    (volume) => acquired.has(volume),
    (volume) => priorities.has(volume) && !acquired.has(volume),
  );

  const acquiredCount = series.acquired?.length ?? 0;
  const missingCount = series.total - acquiredCount;
  const progressPercent = Math.round(
    (acquiredCount / (series.total || 1)) * 100,
  );
  const unit = series.nomenclature === "issue" ? t("issue") : t("volume");

  const summary =
    missingCount === 0
      ? t("complete")
      : `${missingCount} ${missingCount === 1 ? t("oneMissing") : t("manyMissing")}`;

  return (
    <Ficha
      actions={
        <SortMenu onChange={onSortChange} total={series.total} value={sort} />
      }
      appearance={series.appearance}
      big={big}
      category={`${categoryLabel(series.category, locale)} / ${unit}`}
      count={progressPercent}
      countSuffix="%"
      countLabel={`${acquiredCount} ${t("acquiredOf")} ${series.total} ${unit}`}
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
        <VolumeRow
          checked={acquired.has(volume)}
          handlers={handlers}
          key={volume}
          label={volumeLabel(series, volume)}
          note={series.volumeNotes?.[volume]}
          priority={priorities.has(volume)}
          volume={volume}
        />
      ))}
    </Ficha>
  );
}
