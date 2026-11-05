import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeriesCard } from "@/components/tally/series-card";
import type { Series } from "@/lib/store";

const series: Series = {
  id: "berserk",
  title: "Berserk",
  category: "manga",
  total: 4,
  acquired: [2],
  nomenclature: "volume",
  priorityVolumes: [1],
  sort: { criterion: "order", direction: "desc" },
};

function renderCard(onSortChange = vi.fn()) {
  render(
    <SeriesCard
      onAppearance={vi.fn()}
      onDelete={vi.fn()}
      onEditNote={vi.fn()}
      onSortChange={onSortChange}
      onToggleVolume={vi.fn()}
      onTogglePriority={vi.fn()}
      onUpdate={vi.fn()}
      series={series}
    />,
  );
  return onSortChange;
}

describe("SeriesCard sorting", () => {
  it("renders volumes in the card's saved direction, keeping priorities on top", () => {
    renderCard();

    const volumes = screen
      .getAllByRole("checkbox")
      .map((row) => row.getAttribute("aria-label"));
    expect(volumes).toEqual([
      "Berserk - Vol. 1",
      "Berserk - Vol. 4",
      "Berserk - Vol. 3",
      "Berserk - Vol. 2",
    ]);
  });

  it("changes direction and criterion independently from the sort menu", async () => {
    const onSortChange = renderCard();

    fireEvent.click(screen.getByRole("button", { name: /Ordenar/ }));
    const menu = await screen.findByRole("menu");
    fireEvent.click(
      within(menu).getByRole("menuitemradio", { name: /Crescente/ }),
    );
    expect(onSortChange).toHaveBeenLastCalledWith({
      criterion: "order",
      direction: "asc",
    });

    fireEvent.click(
      within(menu).getByRole("menuitemradio", { name: "Faltantes primeiro" }),
    );
    expect(onSortChange).toHaveBeenLastCalledWith({
      criterion: "missing",
      direction: "desc",
    });
  });
});
