import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useInstallPrompt } from "@/lib/use-install-prompt";

describe("useInstallPrompt", () => {
  it("offers the browser prompt once it is available and reports acceptance", async () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canPrompt).toBe(false);
    expect(result.current.installed).toBe(false);

    const event = Object.assign(
      new Event("beforeinstallprompt", { cancelable: true }),
      {
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice: Promise.resolve({ outcome: "accepted" }),
      },
    );
    act(() => {
      window.dispatchEvent(event);
    });
    expect(event.defaultPrevented).toBe(true);
    expect(result.current.canPrompt).toBe(true);

    let accepted = false;
    await act(async () => {
      accepted = await result.current.prompt();
    });
    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(accepted).toBe(true);
    expect(result.current.canPrompt).toBe(false);
  });

  it("hides the offer once the app is installed", () => {
    const { result } = renderHook(() => useInstallPrompt());
    act(() => {
      window.dispatchEvent(new Event("appinstalled"));
    });
    expect(result.current.installed).toBe(true);
  });
});
