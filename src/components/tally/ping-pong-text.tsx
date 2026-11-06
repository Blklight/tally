"use client";

import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const SPEED = 40;
const TRAVEL_SHARE = 0.6;
const MIN_DURATION = 3;

type VisibilityListener = (visible: boolean) => void;
const listeners = new WeakMap<Element, VisibilityListener>();
let sharedObserver: IntersectionObserver | null = null;

function observeVisibility(element: Element, listener: VisibilityListener) {
  if (typeof IntersectionObserver === "undefined") {
    listener(true);
    return () => undefined;
  }
  sharedObserver ??= new IntersectionObserver((entries) => {
    for (const entry of entries) {
      listeners.get(entry.target)?.(entry.isIntersecting);
    }
  });
  listeners.set(element, listener);
  sharedObserver.observe(element);
  return () => {
    listeners.delete(element);
    sharedObserver?.unobserve(element);
  };
}

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
  const [visible, setVisible] = useState(false);
  const overflowing = shift > 0;

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

  useEffect(() => {
    const box = outer.current;
    if (!overflowing || !box) return;
    return observeVisibility(box, setVisible);
  }, [overflowing]);

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
        overflowing && visible && "is-visible",
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
