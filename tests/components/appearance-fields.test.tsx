import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppearanceFields } from "@/components/tally/appearance-fields";
import { DEFAULT_APPEARANCE } from "@/lib/store";

describe("AppearanceFields", () => {
  it("selects a preset paper and derives the contrasting ink", async () => {
    const onChange = vi.fn();
    render(<AppearanceFields onChange={onChange} value={DEFAULT_APPEARANCE} />);

    await userEvent.click(screen.getByRole("button", { name: "Papel Sépia" }));

    expect(onChange).toHaveBeenCalledWith({
      paper: "#a98968",
      ink: "light",
    });
  });

  it("accepts a custom paper color and derives the contrasting ink", () => {
    const onChange = vi.fn();
    render(<AppearanceFields onChange={onChange} value={DEFAULT_APPEARANCE} />);

    fireEvent.change(screen.getByLabelText("Escolher cor personalizada"), {
      target: { value: "#000000" },
    });

    expect(onChange).toHaveBeenCalledWith({
      paper: "#000000",
      ink: "light",
    });
  });

  it("does not offer manual ink color controls", () => {
    render(
      <AppearanceFields
        onChange={() => undefined}
        value={DEFAULT_APPEARANCE}
      />,
    );

    expect(screen.queryByText("Cor do texto")).not.toBeInTheDocument();
    expect(
      screen.getByText(
        "A cor do texto é definida automaticamente para manter o contraste.",
      ),
    ).toBeInTheDocument();
  });
});
