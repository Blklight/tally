import { describe, expect, it } from "vitest";
import {
  DEFAULT_APPEARANCE,
  getContrastInk,
  initializeData,
  normalizeAppearance,
  toggleMissing,
  uid,
  volumeLabel,
} from "@/lib/store";

describe("Collection rules", () => {
  it("initializes Dragon Ball with 42 volumes and the expected acquired list", () => {
    const dragonBall = initializeData().series.find(
      (series) => series.title === "Dragon Ball",
    );

    expect(dragonBall?.total).toBe(42);
    expect(dragonBall?.acquired).toEqual([
      29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
    ]);
    expect(dragonBall?.appearance).toEqual({
      paper: "#d7bc8b",
      ink: "graphite",
    });
  });

  it("preserves existing loose items and does not re-add deleted defaults", () => {
    const item = {
      id: "owned-item",
      title: "Meu livro",
      category: "Livro" as const,
    };
    const initialized = initializeData({ series: [], items: [item] });

    expect(initialized.items).toEqual([item]);
    expect(initializeData({ ...initialized, series: [] }).series).toEqual([]);
  });

  it("does not duplicate or overwrite an existing Dragon Ball series", () => {
    const series = {
      id: "existing",
      title: "Dragon Ball",
      category: "Mangá" as const,
      total: 42,
      missing: [30],
    };
    const initialized = initializeData({ series: [series], items: [] });

    expect(initialized.series[0]).toMatchObject({
      ...series,
      acquired: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42,
      ],
      appearance: DEFAULT_APPEARANCE,
    });
  });

  it("uses Volume nomenclature for numbered manga", () => {
    expect(
      volumeLabel({ title: "Dragon Ball", nomenclature: "Volume" }, 25),
    ).toBe("Dragon Ball - Vol. 25");
  });

  it("uses Edição nomenclature for numbered editions", () => {
    expect(volumeLabel({ title: "Minha HQ", nomenclature: "Edição" }, 7)).toBe(
      "Minha HQ - Ed. 7",
    );
  });

  it("toggles collection ownership reversibly", () => {
    expect(toggleMissing([1, 2, 30], 2)).toEqual([1, 30]);
    expect(toggleMissing([1, 30], 2)).toEqual([1, 2, 30]);
  });

  it("generates unique ids", () => {
    expect(uid()).not.toBe(uid());
  });
});

describe("Appearance", () => {
  it("maps legacy paper names and derives the contrasting ink", () => {
    expect(normalizeAppearance({ paper: "white" })).toEqual({
      paper: "#fffdf7",
      ink: "graphite",
    });
    expect(normalizeAppearance({ paper: "sepia", ink: "graphite" })).toEqual({
      paper: "#a98968",
      ink: "light",
    });
  });

  it("derives ink color from custom paper colors", () => {
    expect(normalizeAppearance({ paper: "#000000" })).toEqual({
      paper: "#000000",
      ink: "light",
    });
    expect(normalizeAppearance({ paper: "#ffffff" })).toEqual({
      paper: "#ffffff",
      ink: "graphite",
    });
  });

  it("falls back to graphite for invalid colors", () => {
    expect(getContrastInk("not-a-color")).toBe("graphite");
  });

  it("normalizes stored appearances when initializing data", () => {
    const initialized = initializeData({
      initialized: true,
      series: [
        {
          id: "legacy",
          title: "Legacy",
          category: "Livro",
          total: 1,
          missing: [1],
          appearance: { paper: "craft", ink: "light" },
        },
      ],
      items: [],
      looseAppearance: { paper: "white", ink: "light" },
    });

    expect(initialized.series[0]?.appearance).toEqual({
      paper: "#d7bc8b",
      ink: "graphite",
    });
    expect(initialized.looseAppearance).toEqual(DEFAULT_APPEARANCE);
  });
});
