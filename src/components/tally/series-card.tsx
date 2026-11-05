"use client";

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
  const volumes = Array.from({ length: series.total }, (_, index) => index + 1);
  const sort = normalizeSort(series.sort);
  const ordered = sortEntries(
    volumes,
    sort,
    (volume) => !!series.acquired?.includes(volume),
    (volume) =>
      !!series.priorityVolumes?.includes(volume) &&
      !series.acquired?.includes(volume),
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
        <HoldRow
          checked={series.acquired?.includes(volume) ?? false}
          key={volume}
          label={volumeLabel(series, volume)}
          note={series.volumeNotes?.[volume]}
          onEditNote={(note) => onEditNote(volume, note)}
          onTogglePriority={() => onTogglePriority(volume)}
          priority={series.priorityVolumes?.includes(volume) ?? false}
          onToggle={() => onToggleVolume(volume)}
        />
      ))}
    </Ficha>
  );
}
