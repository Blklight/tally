import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HoldRow } from "@/components/fichas";
import { HOLD_DURATION } from "@/lib/store";

afterEach(() => vi.useRealTimers());

describe("HoldRow", () => {
  it("requires a sustained hold rather than a tap, and confirms exactly once", () => {
    vi.useFakeTimers();
    const toggle = vi.fn();

    render(
      <HoldRow
        checked={false}
        label="Dragon Ball - Vol. 25"
        onToggle={toggle}
      />,
    );

    const row = screen.getByRole("checkbox", {
      name: "Dragon Ball - Vol. 25",
    });

    fireEvent.click(row);
    expect(toggle).not.toHaveBeenCalled();

    fireEvent.keyDown(row, { key: " " });
    act(() => vi.advanceTimersByTime(HOLD_DURATION - 1));
    expect(toggle).not.toHaveBeenCalled();

    fireEvent.keyUp(row, { key: " " });
    act(() => vi.advanceTimersByTime(1000));
    expect(toggle).not.toHaveBeenCalled();

    fireEvent.keyDown(row, { key: " " });
    act(() => vi.advanceTimersByTime(HOLD_DURATION));
    expect(toggle).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(1000));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});

describe("HoldRow actions", () => {
  it("toggles priority and opens the note editor from the drawer", () => {
    const priority = vi.fn();
    const editNote = vi.fn();

    render(
      <HoldRow
        checked={false}
        label="Berserk - Vol. 3"
        note="capa dura"
        onEditNote={editNote}
        onToggle={vi.fn()}
        onTogglePriority={priority}
        priority
      />,
    );

    expect(screen.getByRole("img", { name: "Item prioritário" })).toBeVisible();

    fireEvent.click(screen.getByText("Tirar prioridade"));
    expect(priority).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Editar nota"));
    const input = screen.getByRole("textbox", { name: "Editar nota" });
    expect(input).toHaveValue("capa dura");
    fireEvent.change(input, { target: { value: "  1ª edição " } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar" }));
    expect(editNote).toHaveBeenCalledWith("1ª edição");
  });
});
