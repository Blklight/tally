"use client";

import { type CSSProperties, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const SPEED = 40;
const TRAVEL_SHARE = 0.6;
const MIN_DURATION = 3;

export function PingPongText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const [shift, setShift] = useState(0);

  useLayoutEffect(() => {
    const box = outer.current;
    const text = track.current;
    if (!box || !text) return;
    const measure = () =>
      setShift(Math.max(0, Math.ceil(text.scrollWidth - box.clientWidth)));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(text);
    return () => observer.disconnect();
  }, []);

  const overflowing = shift > 0;
  const style = overflowing
    ? ({
        "--pp-shift": `-${shift}px`,
        "--pp-duration": `${Math.max(MIN_DURATION, shift / (SPEED * TRAVEL_SHARE)).toFixed(2)}s`,
      } as CSSProperties)
    : undefined;

  return (
    <span
      className={cn(
        "ping-pong block overflow-hidden whitespace-nowrap",
        overflowing && "is-overflowing",
        className,
      )}
      data-overflowing={overflowing || undefined}
      ref={outer}
      style={style}
      title={overflowing ? children : undefined}
    >
      <span className="ping-pong-track inline-block" ref={track}>
        {children}
      </span>
    </span>
  );
}
