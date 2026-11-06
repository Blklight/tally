import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useProgressiveCount } from "@/components/tally/use-progressive-count";

afterEach(() => vi.useRealTimers());

function idle(times: number) {
  for (let i = 0; i < times; i++) act(() => vi.advanceTimersByTime(40));
}

describe("useProgressiveCount", () => {
  it("grows in idle-time chunks until it reaches the total", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useProgressiveCount(100));

    expect(result.current).toBe(0);
    idle(1);
    expect(result.current).toBe(40);
    idle(5);
    expect(result.current).toBe(100);
  });

  it("never reports more than the current total", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(
      ({ total }) => useProgressiveCount(total),
      { initialProps: { total: 60 } },
    );

    idle(5);
    expect(result.current).toBe(60);
    rerender({ total: 10 });
    expect(result.current).toBe(10);
  });
});
