import { describe, expect, it } from "vitest";
import { categoryLabel } from "@/lib/i18n";

describe("categoryLabel", () => {
  it("translates categories in both locales", () => {
    expect(categoryLabel("individual-items", "pt-BR")).toBe(
      "Itens individuais",
    );
    expect(categoryLabel("individual-items", "en")).toBe("Individual items");
    expect(categoryLabel("comic", "pt-BR")).toBe("HQ");
    expect(categoryLabel("other", "en")).toBe("Other");
  });
});
