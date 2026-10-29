import * as React from "react";
import { cn } from "@/lib/utils";
import {
  type ChamferBase,
  type Corner,
  chamferClass,
  chamferStyle,
  type Size,
} from "./chamfer-utils";

/* ---------------- Fillet (chanfro suavizado, experimental) ----------------
 * Versão à parte: não altera a classe `chamfer`. Mede o elemento e aplica
 * clip-path: path() com curvas nas duas pontas de cada diagonal. */
function filletPath(
  w: number,
  h: number,
  c: Record<Corner, number>,
  r: number,
) {
  // Lista de vértices (sentido horário) com raio próprio: só as pontas das diagonais são suavizadas.
  const pts: [number, number, number][] = [];
  const add = (x: number, y: number, rr: number) => pts.push([x, y, rr]);
  const { tl, tr, br, bl } = c;
  if (tl) {
    add(0, tl, r);
    add(tl, 0, r);
  } else add(0, 0, 0);
  if (tr) {
    add(w - tr, 0, r);
    add(w, tr, r);
  } else add(w, 0, 0);
  if (br) {
    add(w, h - br, r);
    add(w - br, h, r);
  } else add(w, h, 0);
  if (bl) {
    add(bl, h, r);
    add(0, h - bl, r);
  } else add(0, h, 0);
  const n = pts.length;
  const f = (v: number) => +v.toFixed(2);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y, rr] = pts[i]!;
    const [px, py] = pts[(i - 1 + n) % n]!;
    const [nx, ny] = pts[(i + 1) % n]!;
    const lp = Math.hypot(x - px, y - py),
      ln = Math.hypot(nx - x, ny - y);
    // Raio limitado a metade de cada aresta para nunca se sobrepor.
    const t = Math.min(rr, lp / 2, ln / 2);
    const ax = x + ((px - x) / lp) * t,
      ay = y + ((py - y) / lp) * t;
    const bx = x + ((nx - x) / ln) * t,
      by = y + ((ny - y) / ln) * t;
    out.push(`${i === 0 ? "M" : "L"} ${f(ax)} ${f(ay)}`);
    // Cúbica com fator 0.55 aproxima um arco circular (mais redondo que a quadrática).
    if (t > 0) {
      const k = 0.55;
      out.push(
        `C ${f(ax + (x - ax) * k)} ${f(ay + (y - ay) * k)} ${f(bx + (x - bx) * k)} ${f(by + (y - by) * k)} ${f(bx)} ${f(by)}`,
      );
    }
  }
  out.push("Z");
  return out.join(" ");
}

const SIZE_PX: Record<Exclude<Size, number>, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

function useFillet(
  corners: "all" | Corner[],
  size: Size,
  radius: number,
  inset = 0,
) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [clip, setClip] = React.useState<string>();
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const px = typeof size === "number" ? size : SIZE_PX[size];
    // Miolo 1px menor: perna do chanfro reduz (√2 − 1)·2 ≈ 0.83px para a diagonal ficar paralela.
    const leg = Math.max(0, px - inset * 2 * (Math.SQRT2 - 1));
    const rr = Math.max(0, radius - inset * 0.5);
    const on = (k: Corner) =>
      corners === "all" || corners.includes(k) ? leg : 0;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setClip(
        `path("${filletPath(width, height, { tl: on("tl"), tr: on("tr"), br: on("br"), bl: on("bl") }, rr)}")`,
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [corners, size, radius, inset]);
  return [ref, clip] as const;
}

export function FilletCard({
  corners = ["tl", "br"],
  size = "md",
  radius = 4,
  bordered = true,
  className,
  children,
  style,
  ...props
}: ChamferBase & { radius?: number } & React.HTMLAttributes<HTMLDivElement>) {
  const [outerRef, outerClip] = useFillet(corners, size, radius);
  const [innerRef, innerClip] = useFillet(corners, size, radius, 1);
  if (!bordered) {
    return (
      <div
        ref={outerRef}
        className={cn("bg-card text-card-foreground", className)}
        style={{ clipPath: outerClip, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      ref={outerRef}
      className="bg-border p-px"
      style={{ clipPath: outerClip, ...style }}
      {...props}
    >
      <div
        ref={innerRef}
        className={cn("h-full bg-card text-card-foreground", className)}
        style={{ clipPath: innerClip }}
      >
        {children}
      </div>
    </div>
  );
}
