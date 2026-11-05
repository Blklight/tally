"use client";

import { useEffect, useState } from "react";

export type Category = "manga" | "book" | "magazine" | "comic" | "other";
export const CATEGORIES: Category[] = [
  "manga",
  "book",
  "magazine",
  "comic",
  "other",
];

export type Nomenclature = "volume" | "issue";
export type PaperColor = string;
export type InkColor = "graphite" | "light";
export interface Appearance {
  paper: PaperColor;
  ink: InkColor;
}
export const DEFAULT_APPEARANCE: Appearance = {
  paper: "#fffdf7",
  ink: "graphite",
};

const LEGACY_CATEGORIES: Record<string, Category> = {
  Mangá: "manga",
  Livro: "book",
  Revista: "magazine",
  HQ: "comic",
  Outro: "other",
};
const LEGACY_NOMENCLATURES: Record<string, Nomenclature> = {
  Volume: "volume",
  Edição: "issue",
};

const LEGACY_PAPER_COLORS: Record<string, string> = {
  white: "#fffdf7",
  craft: "#d7bc8b",
  sepia: "#a98968",
  rose: "#ead1d0",
  sage: "#c9d9c4",
  blue: "#c9d9e8",
};

function isHexColor(value: string): value is PaperColor {
  return /^#[\da-f]{6}$/i.test(value);
}

export function normalizeAppearance(
  appearance?: Partial<Appearance>,
): Appearance {
  const paper = appearance?.paper ?? DEFAULT_APPEARANCE.paper;
  const normalizedPaper = LEGACY_PAPER_COLORS[paper] ?? paper;
  const safePaper = isHexColor(normalizedPaper)
    ? normalizedPaper
    : DEFAULT_APPEARANCE.paper;
  return { paper: safePaper, ink: getContrastInk(safePaper) };
}

export function getContrastInk(color: string): InkColor {
  const hex = color.replace("#", "");
  if (!/^[\da-f]{6}$/i.test(hex)) return "graphite";
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.58 ? "graphite" : "light";
}

export type SortCriterion = "order" | "missing";
export type SortDirection = "asc" | "desc";
export interface SortPreference {
  criterion: SortCriterion;
  direction: SortDirection;
}
export const DEFAULT_SORT: SortPreference = {
  criterion: "order",
  direction: "asc",
};

export function normalizeSort(sort?: Partial<SortPreference>): SortPreference {
  return {
    criterion: sort?.criterion === "missing" ? "missing" : "order",
    direction: sort?.direction === "desc" ? "desc" : "asc",
  };
}

export interface Series {
  id: string;
  title: string;
  category: Category;
  total: number;
  acquired?: number[];
  missing?: number[];
  nomenclature?: Nomenclature;
  appearance?: Appearance;
  isLoose?: boolean;
  looseItems?: LooseItem[];
  volumeNotes?: Record<number, string>;
  priorityVolumes?: number[];
  sort?: SortPreference;
}

export interface LooseItem {
  id: string;
  title: string;
  category: Category;
  note?: string;
  found?: boolean;
  priority?: boolean;
}

export function normalizeLooseItem(item: Partial<LooseItem>): LooseItem {
  return {
    id: item.id ?? uid(),
    title: item.title ?? "Sem título",
    category:
      (item.category && LEGACY_CATEGORIES[item.category]) ??
      item.category ??
      "other",
    ...(item.note === undefined ? {} : { note: item.note }),
    found: item.found ?? false,
    priority: item.priority ?? false,
  };
}

export function orderByPriority<T>(
  entries: T[],
  isPriority: (entry: T) => boolean,
): T[] {
  return [
    ...entries.filter((entry) => isPriority(entry)),
    ...entries.filter((entry) => !isPriority(entry)),
  ];
}

export function sortEntries<T>(
  entries: T[],
  sort: SortPreference,
  isDone: (entry: T) => boolean,
  isPriority: (entry: T) => boolean,
): T[] {
  const directed = sort.direction === "desc" ? [...entries].reverse() : entries;
  const grouped =
    sort.criterion === "missing"
      ? [
          ...directed.filter((entry) => !isDone(entry)),
          ...directed.filter((entry) => isDone(entry)),
        ]
      : directed;
  return orderByPriority(grouped, isPriority);
}

export interface Data {
  series: Series[];
  items: LooseItem[];
  looseAppearance?: Appearance;
  looseSort?: SortPreference;
  initialized?: boolean;
}

const DB_NAME = "tally-db";
const STORE_NAME = "data";
const DATA_KEY = "current";
const empty: Data = { series: [], items: [], initialized: false };

function normalizeSeries(
  series: Partial<Series> & { missing?: number[] },
): Series {
  const total = Math.max(0, Math.trunc(series.total ?? 0));
  const legacyMissing = series.missing ?? [];
  const acquired =
    series.acquired ??
    Array.from({ length: total }, (_, index) => index + 1).filter(
      (volume) => !legacyMissing.includes(volume),
    );

  return {
    id: series.id ?? uid(),
    title: series.title ?? "Sem título",
    category:
      (series.category && LEGACY_CATEGORIES[series.category]) ??
      series.category ??
      "other",
    total,
    acquired: [...new Set(acquired)]
      .filter(
        (volume) => Number.isInteger(volume) && volume > 0 && volume <= total,
      )
      .sort((a, b) => a - b),
    nomenclature:
      (series.nomenclature && LEGACY_NOMENCLATURES[series.nomenclature]) ??
      series.nomenclature ??
      "volume",
    appearance: normalizeAppearance(series.appearance),
    isLoose: series.isLoose ?? false,
    volumeNotes: series.volumeNotes ?? {},
    priorityVolumes: [...new Set(series.priorityVolumes ?? [])]
      .filter(
        (volume) => Number.isInteger(volume) && volume > 0 && volume <= total,
      )
      .sort((a, b) => a - b),
    looseItems: (series.looseItems ?? []).map(normalizeLooseItem),
    sort: normalizeSort(series.sort),
  };
}

function normalizeData(data: {
  series?: Array<Partial<Series> & { missing?: number[] }>;
  items?: Array<Partial<LooseItem>>;
  looseAppearance?: Partial<Appearance>;
  looseSort?: Partial<SortPreference>;
  initialized?: boolean;
}): Data {
  return {
    series: (data.series ?? []).map(normalizeSeries),
    items: (data.items ?? []).map(normalizeLooseItem),
    looseAppearance: normalizeAppearance(data.looseAppearance),
    looseSort: normalizeSort(data.looseSort),
    initialized: data.initialized ?? false,
  };
}

export function normalizeImportedData(value: unknown): Data | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (Array.isArray(value)) {
    const series: Array<Partial<Series>> = [];
    const items: Array<Partial<LooseItem>> = [];
    for (const entry of value) {
      if (!entry || typeof entry !== "object") continue;
      const candidate = entry as Record<string, unknown>;
      if (typeof candidate.total === "number" || candidate.isLoose === false) {
        series.push(candidate as Partial<Series>);
      } else if (typeof candidate.title === "string") {
        items.push(candidate as unknown as Partial<LooseItem>);
      }
    }
    return normalizeData({ series, items });
  }
  if (Array.isArray(input.series) || Array.isArray(input.items)) {
    return normalizeData(
      input as unknown as {
        series?: Array<Partial<Series> & { missing?: number[] }>;
        items?: Array<Partial<LooseItem>>;
      },
    );
  }
  if (typeof input.title === "string") {
    return typeof input.total === "number" || input.isLoose === false
      ? normalizeData({ series: [input as Partial<Series>], items: [] })
      : normalizeData({
          series: [],
          items: [input as unknown as Partial<LooseItem>],
        });
  }
  return null;
}

export function mergeImportedData(
  current: Data,
  imported: Data,
): { data: Data; imported: number } {
  const seriesIds = new Set(current.series.map((series) => series.id));
  const itemIds = new Set(current.items.map((item) => item.id));
  const series = imported.series.filter((entry) => {
    if (seriesIds.has(entry.id)) return false;
    seriesIds.add(entry.id);
    return true;
  });
  const items = imported.items.filter((entry) => {
    if (itemIds.has(entry.id)) return false;
    itemIds.add(entry.id);
    return true;
  });
  return {
    data: {
      ...current,
      series: [...current.series, ...series],
      items: [...current.items, ...items],
    },
    imported: series.length + items.length,
  };
}

function readData(): Promise<Data | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => {
      const transaction = request.result.transaction(STORE_NAME, "readonly");
      const get = transaction.objectStore(STORE_NAME).get(DATA_KEY);
      get.onsuccess = () => resolve((get.result as Data | undefined) ?? null);
      get.onerror = () => reject(get.error);
    };
    request.onerror = () => reject(request.error);
  });
}

function writeData(data: Data): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => {
      const transaction = request.result.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(data, DATA_KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    request.onerror = () => reject(request.error);
  });
}

export function trimSeriesToTotal(
  series: Pick<Series, "acquired" | "priorityVolumes" | "volumeNotes">,
  total: number,
): Pick<Series, "total" | "acquired" | "priorityVolumes" | "volumeNotes"> {
  const fits = (volume: number) => volume <= total;
  return {
    total,
    acquired: (series.acquired ?? []).filter(fits),
    priorityVolumes: (series.priorityVolumes ?? []).filter(fits),
    volumeNotes: Object.fromEntries(
      Object.entries(series.volumeNotes ?? {}).filter(([volume]) =>
        fits(Number(volume)),
      ),
    ),
  };
}

export function insertAt<T>(entries: T[], index: number, entry: T): T[] {
  const position = Math.max(0, Math.min(index, entries.length));
  return [...entries.slice(0, position), entry, ...entries.slice(position)];
}

export const HOLD_DURATION = 700;
export function volumeLabel(
  s: Pick<Series, "title" | "nomenclature">,
  volume: number,
) {
  return `${s.title} - ${s.nomenclature === "issue" ? "Ed." : "Vol."} ${volume}`;
}

export function initializeData(existing: Data = empty): Data {
  if (existing.initialized)
    return normalizeData({
      ...existing,
      series: existing.series.map(normalizeSeries),
      looseAppearance: normalizeAppearance(existing.looseAppearance),
    });

  const hasDragonBall = existing.series.some(
    (s) => s.title.trim().toLowerCase() === "dragon ball",
  );

  const dragonBall: Series = {
    id: "dragon-ball",
    title: "Dragon Ball",
    category: "manga",
    total: 42,
    acquired: [29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    nomenclature: "volume",
    appearance: { paper: "craft", ink: "graphite" },
  };
  return {
    ...existing,
    initialized: true,
    series: (hasDragonBall
      ? existing.series
      : [dragonBall, ...existing.series]
    ).map(normalizeSeries),
    looseAppearance: normalizeAppearance(existing.looseAppearance),
    looseSort: normalizeSort(existing.looseSort),
  };
}

export function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Toggle a volume in the missing list, keeping it sorted. */
export function toggleMissing(missing: number[], vol: number): number[] {
  return missing.includes(vol)
    ? missing.filter((v) => v !== vol)
    : [...missing, vol].sort((a, b) => a - b);
}

export function useData() {
  const [data, setData] = useState<Data>(empty);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    readData()
      .then((saved) => {
        if (active) setData(initializeData({ ...empty, ...(saved ?? {}) }));
      })
      .catch(() => {
        if (active) setData(initializeData());
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loaded) void writeData(data).catch(() => undefined);
  }, [data, loaded]);

  return [data, setData, loaded] as const;
}
