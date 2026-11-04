import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineEdit } from "@/components/tally/inline-edit";
import type { Series } from "@/lib/store";

const series: Series = {
  id: "berserk",
  title: "Berserk",
  category: "manga",
  total: 3,
  acquired: [1, 3],
  nomenclature: "volume",
  priorityVolumes: [3],
  volumeNotes: { 3: "capa dura" },
};

function renderEdit(onUpdate = vi.fn()) {
  render(
    <InlineEdit
      onAppearance={vi.fn()}
      onClose={vi.fn()}
      onDelete={vi.fn()}
      onUpdate={onUpdate}
      series={series}
    />,
  );
  return onUpdate;
}

describe("InlineEdit", () => {
  it("uses the same total stepper as creation and trims dropped volumes", () => {
    const onUpdate = renderEdit();

    fireEvent.click(screen.getByRole("button", { name: "Diminuir total" }));

    expect(screen.getByLabelText("Total de volumes")).toHaveValue(2);
    expect(onUpdate).toHaveBeenCalledWith({
      total: 2,
      acquired: [1],
      priorityVolumes: [],
      volumeNotes: {},
    });
  });

  it("shows translated categories in the selector", () => {
    renderEdit();

    expect(
      screen.getByRole("combobox", { name: "Categoria" }),
    ).toHaveTextContent("Mangá");
  });

  it("saves the title only when it changes", () => {
    const onUpdate = renderEdit();
    const input = screen.getByLabelText("Título");

    fireEvent.blur(input);
    expect(onUpdate).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: " Berserk Deluxe " } });
    fireEvent.blur(input);
    expect(onUpdate).toHaveBeenCalledWith({ title: "Berserk Deluxe" });
  });
});
