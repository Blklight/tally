import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PingPongText } from "@/components/tally/ping-pong-text";

function mockWidths(scrollWidth: number, clientWidth: number) {
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(
    scrollWidth,
  );
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(
    clientWidth,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("PingPongText", () => {
  it("stays still when the text fits on one line", () => {
    mockWidths(120, 200);
    render(<PingPongText>Juliana Paes - maio de 2004</PingPongText>);

    const text = screen.getByText("Juliana Paes - maio de 2004");
    expect(text.parentElement).not.toHaveAttribute("data-overflowing");
    expect(text.parentElement).not.toHaveAttribute("title");
  });

  it("slides back and forth by the overflow and exposes the full text", () => {
    mockWidths(500, 200);
    const note =
      "Belezas da Praia (Aricia Silva) / Kate Moss - janeiro de 2014";
    render(<PingPongText>{note}</PingPongText>);

    const box = screen.getByText(note).parentElement;
    expect(box).toHaveAttribute("data-overflowing", "true");
    expect(box).toHaveAttribute("title", note);
    expect(box?.style.getPropertyValue("--pp-shift")).toBe("-300px");
    expect(box?.style.getPropertyValue("--pp-duration")).toBe("12.50s");
  });

  it("only animates while the note is on screen", () => {
    let report: (visible: boolean) => void = () => undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          report = (visible) =>
            callback(
              [{ isIntersecting: visible, target: box } as never],
              this as never,
            );
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    mockWidths(500, 200);
    const note = "Garotas da Casa Bonita (Bianca Leão) - maio de 2013";
    render(<PingPongText>{note}</PingPongText>);
    const box = screen.getByText(note).parentElement as HTMLElement;

    expect(box).not.toHaveClass("is-visible");
    act(() => report(true));
    expect(box).toHaveClass("is-visible");
    act(() => report(false));
    expect(box).not.toHaveClass("is-visible");
  });
});
