import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HelpDialog } from "@/components/help-dialog";

describe("HelpDialog", () => {
  it("groups the guide into titled sections", () => {
    render(<HelpDialog onOpenChange={vi.fn()} open />);

    const dialog = screen.getByRole("dialog", { name: "Como usar o Tally" });
    const headings = within(dialog)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);

    expect(headings).toEqual([
      "Começar",
      "Marcar itens",
      "Ações do item",
      "Organizar fichas",
      "Navegar",
      "Seus dados",
      "Atalhos de teclado",
    ]);
  });

  it("explains the hold gesture, swipe actions and local storage", () => {
    render(<HelpDialog onOpenChange={vi.fn()} open />);

    expect(screen.getByText(/Pressione e segure um item/)).toBeInTheDocument();
    expect(
      screen.getByText(/Deslize um item para a esquerda/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Tudo fica salvo apenas neste navegador/),
    ).toBeInTheDocument();
  });

  it("lists keyboard shortcuts", () => {
    render(<HelpDialog onOpenChange={vi.fn()} open />);

    const shortcuts = screen.getByRole("region", {
      name: "Atalhos de teclado",
    });
    expect(within(shortcuts).getByText("N")).toBeInTheDocument();
    expect(within(shortcuts).getByText("Espaço")).toBeInTheDocument();
    expect(within(shortcuts).getByText("Nova ficha")).toBeInTheDocument();
  });

  it("renders nothing while closed", () => {
    render(<HelpDialog onOpenChange={vi.fn()} open={false} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
