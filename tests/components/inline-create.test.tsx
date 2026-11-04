import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { InlineCreate } from "@/components/tally/inline-create";
import { DEFAULT_APPEARANCE } from "@/lib/store";

describe("InlineCreate", () => {
  it("creates a numbered collection with the chosen total", () => {
    const create = vi.fn();

    render(
      <InlineCreate
        appearance={DEFAULT_APPEARANCE}
        onAppearanceChange={vi.fn()}
        onCancel={vi.fn()}
        onCreate={create}
        onCreateLoose={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Berserk" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Aumentar total" }));
    fireEvent.click(screen.getByRole("button", { name: /Criar ficha/ }));

    expect(create).toHaveBeenCalledWith(
      "Berserk",
      "manga",
      2,
      "volume",
      DEFAULT_APPEARANCE,
    );
  });
});
