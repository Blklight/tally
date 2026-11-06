"use client";

import { startTransition, useEffect, useState } from "react";

const CHUNK = 40;
const IDLE_TIMEOUT = 500;
const FALLBACK_DELAY = 32;

type Cancel = () => void;

function whenIdle(callback: () => void): Cancel {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, FALLBACK_DELAY);
  return () => window.clearTimeout(id);
}

export function useProgressiveCount(total: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= total) return;
    return whenIdle(() =>
      startTransition(() =>
        setCount((current) => Math.min(total, current + CHUNK)),
      ),
    );
  }, [count, total]);

  return Math.min(count, total);
}
