import { describe, expect, it } from "vitest";
import {
  DEFAULT_APPEARANCE,
  getContrastInk,
  initializeData,
  insertAt,
  mergeImportedData,
  normalizeAppearance,
  normalizeImportedData,
  normalizeSort,
  orderByPriority,
  sortEntries,
  toggleMissing,
  trimSeriesToTotal,
  uid,
  volumeLabel,
} from "@/lib/store";

describe("Collection rules", () => {
  it("initializes with an empty collection", () => {
    const initialized = initializeData();

    expect(initialized.initialized).toBe(true);
    expect(initialized.series).toEqual([]);
    expect(initialized.items).toEqual([]);
  });

  it("preserves existing loose items and does not re-add deleted defaults", () => {
    const item = {
      id: "owned-item",
      title: "Meu livro",
      category: "book" as const,
    };
    const initialized = initializeData({ series: [], items: [item] });

    expect(initialized.items).toEqual([item]);
    expect(initializeData({ ...initialized, series: [] }).series).toEqual([]);
  });

  it("keeps an existing series and converts its legacy missing list", () => {
    const series = {
      id: "existing",
      title: "Dragon Ball",
      category: "manga" as const,
      total: 42,
      missing: [30],
    };
    const initialized = initializeData({ series: [series], items: [] });

    const { missing: _missing, ...storedSeries } = series;
    expect(initialized.series[0]).toMatchObject({
      ...storedSeries,
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
      volumeLabel({ title: "Dragon Ball", nomenclature: "volume" }, 25),
    ).toBe("Dragon Ball - Vol. 25");
  });

  it("uses Edition nomenclature for numbered editions", () => {
    expect(volumeLabel({ title: "Minha HQ", nomenclature: "issue" }, 7)).toBe(
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
          category: "book",
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

describe("priority", () => {
  it("moves priority entries to the top, keeping relative order", () => {
    expect(orderByPriority([1, 2, 3, 4], (n) => n === 3 || n === 4)).toEqual([
      3, 4, 1, 2,
    ]);
  });

  it("normalizes priority on loose items and priority volumes on series", () => {
    const data = normalizeImportedData({
      series: [
        { id: "s", title: "S", total: 5, priorityVolumes: [4, 2, 2, 9] },
      ],
      items: [
        { id: "i", title: "I", priority: true },
        { id: "j", title: "J" },
      ],
    });
    expect(data?.series[0]?.priorityVolumes).toEqual([2, 4]);
    expect(data?.items.map((item) => item.priority)).toEqual([true, false]);
  });
});

describe("Series and import helpers", () => {
  it("drops acquired, priority and notes beyond a reduced total", () => {
    expect(
      trimSeriesToTotal(
        {
          acquired: [1, 4, 6],
          priorityVolumes: [2, 5],
          volumeNotes: { 3: "ok", 5: "fora" },
        },
        4,
      ),
    ).toEqual({
      total: 4,
      acquired: [1, 4],
      priorityVolumes: [2],
      volumeNotes: { 3: "ok" },
    });
  });

  it("inserts an entry back at its original position", () => {
    expect(insertAt(["a", "c"], 1, "b")).toEqual(["a", "b", "c"]);
    expect(insertAt(["a"], 10, "z")).toEqual(["a", "z"]);
  });

  it("merges imported data skipping ids that already exist", () => {
    const current = initializeData({
      series: [
        {
          id: "dragon-ball",
          title: "Dragon Ball",
          category: "manga",
          total: 42,
          acquired: [],
        },
      ],
      items: [],
    });
    const imported = normalizeImportedData({
      series: [
        { id: "dragon-ball", title: "Dragon Ball", total: 42 },
        { id: "berserk", title: "Berserk", total: 41 },
      ],
      items: [{ id: "piaui", title: "Piauí 200" }],
    });
    if (!imported) throw new Error("import should parse");

    const result = mergeImportedData(current, imported);

    expect(result.imported).toBe(2);
    expect(result.data.series.map((series) => series.id)).toEqual([
      "dragon-ball",
      "berserk",
    ]);
    expect(result.data.items.map((item) => item.id)).toEqual(["piaui"]);
    expect(mergeImportedData(result.data, imported).imported).toBe(0);
  });
});

describe("Sorting inside a card", () => {
  const acquired = [2, 4];
  const priority = [1, 4];
  const sortVolumes = (
    criterion: "order" | "missing",
    direction: "asc" | "desc",
  ) =>
    sortEntries(
      [1, 2, 3, 4, 5],
      { criterion, direction },
      (volume) => acquired.includes(volume),
      (volume) => priority.includes(volume) && !acquired.includes(volume),
    );

  it("lists volumes ascending or descending, always with pending priorities first", () => {
    expect(sortVolumes("order", "asc")).toEqual([1, 2, 3, 4, 5]);
    expect(sortVolumes("order", "desc")).toEqual([1, 5, 4, 3, 2]);
  });

  it("combines missing first with either direction", () => {
    expect(sortVolumes("missing", "asc")).toEqual([1, 3, 5, 2, 4]);
    expect(sortVolumes("missing", "desc")).toEqual([1, 5, 3, 4, 2]);
  });

  it("does not mutate the source list", () => {
    const volumes = [1, 2, 3];
    sortEntries(
      volumes,
      { criterion: "order", direction: "desc" },
      () => false,
      () => false,
    );
    expect(volumes).toEqual([1, 2, 3]);
  });

  it("falls back to ascending order for missing or invalid preferences", () => {
    expect(normalizeSort()).toEqual({ criterion: "order", direction: "asc" });
    expect(normalizeSort({ criterion: "x", direction: "y" } as never)).toEqual({
      criterion: "order",
      direction: "asc",
    });
  });

  it("keeps each card's sort preference through normalization", () => {
    const data = normalizeImportedData({
      series: [
        {
          id: "db",
          title: "Dragon Ball",
          total: 42,
          sort: { criterion: "missing", direction: "desc" },
        },
        { id: "op", title: "One Piece", total: 3 },
      ],
      items: [],
      looseSort: { criterion: "order", direction: "desc" },
    });

    expect(data?.series.map((series) => series.sort)).toEqual([
      { criterion: "missing", direction: "desc" },
      { criterion: "order", direction: "asc" },
    ]);
    expect(data?.looseSort).toEqual({ criterion: "order", direction: "desc" });
  });
});
