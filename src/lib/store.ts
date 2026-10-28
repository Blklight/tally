"use client";

import { useEffect, useState } from "react";

export type Category = "Mangá" | "Livro" | "Revista" | "HQ" | "Outro";
export const CATEGORIES: Category[] = [
  "Mangá",
  "Livro",
  "Revista",
  "HQ",
  "Outro",
];

export type Nomenclature = "Volume" | "Edição";
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

export interface Series {
  id: string;
  title: string;
  category: Category;
  total: number;
  acquired?: number[];
  missing?: number[];
  nomenclature?: Nomenclature;
  appearance?: Appearance;
}

export interface LooseItem {
  id: string;
  title: string;
  category: Category;
  note?: string;
  found?: boolean;
}

export interface Data {
  series: Series[];
  items: LooseItem[];
  looseAppearance?: Appearance;
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
    category: series.category ?? "Outro",
    total,
    acquired: [...new Set(acquired)]
      .filter(
        (volume) => Number.isInteger(volume) && volume > 0 && volume <= total,
      )
      .sort((a, b) => a - b),
    nomenclature: series.nomenclature ?? "Volume",
    appearance: normalizeAppearance(series.appearance),
  };
}

function normalizeData(
  data: Data & { series?: Array<Partial<Series> & { missing?: number[] }> },
): Data {
  return {
    series: (data.series ?? []).map(normalizeSeries),
    items: (data.items ?? []).map((item) => ({
      id: item.id ?? uid(),
      title: item.title ?? "Sem título",
      category: item.category ?? "Outro",
      ...(item.note === undefined ? {} : { note: item.note }),
      found: item.found ?? false,
    })),
    looseAppearance: normalizeAppearance(data.looseAppearance),
    initialized: data.initialized ?? false,
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

export const HOLD_DURATION = 700;
export function volumeLabel(
  s: Pick<Series, "title" | "nomenclature">,
  volume: number,
) {
  return `${s.title} - ${s.nomenclature === "Edição" ? "Ed." : "Vol."} ${volume}`;
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
    category: "Mangá",
    total: 42,
    acquired: [29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    nomenclature: "Volume",
    appearance: { paper: "craft", ink: "graphite" },
  };
  return {
    ...existing,
    initialized: true,
    series: (hasDragonBall
      ? existing.series
      : [dragonBall, ...existing.series]
    ).map((series) => ({
      ...series,
      appearance: normalizeAppearance(series.appearance),
    })),
    looseAppearance: normalizeAppearance(existing.looseAppearance),
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
