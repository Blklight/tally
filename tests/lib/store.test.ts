import { describe, expect, it } from "vitest";
import { initializeData, toggleMissing, uid, volumeLabel } from "@/lib/store";

describe("Collection rules", () => {
  it("initializes Dragon Ball with 42 volumes and the expected missing list", () => {
    const dragonBall = initializeData().series.find(
      (series) => series.title === "Dragon Ball",
    );

    expect(dragonBall?.total).toBe(42);
    expect(dragonBall?.missing).toEqual([
      ...Array.from({ length: 28 }, (_, index) => index + 1),
      30,
    ]);
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

    expect(initialized.series).toEqual([series]);
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
