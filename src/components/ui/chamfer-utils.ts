import * as React from "react";
import { cn } from "@/lib/utils";

export type Corner = "tl" | "tr" | "br" | "bl";
/** Escala nomeada ou valor arbitrário em px (número) */
export type Size = "xs" | "sm" | "md" | "lg" | "xl" | number;

export function chamferClass(
  corners: "all" | Corner[] = "all",
  size: Size = "md",
) {
  return cn(
    "chamfer",
    typeof size === "string" && size !== "md" && `chamfer-${size}`,
    corners === "all" ? "chamfer-all" : corners.map((c) => `chamfer-${c}`),
  );
}

/** Estilo inline para tamanhos arbitrários (size numérico) */
export function chamferStyle(size: Size): React.CSSProperties | undefined {
  return typeof size === "number"
    ? ({ "--c": `${size}px` } as React.CSSProperties)
    : undefined;
}

export interface ChamferBase {
  corners?: "all" | Corner[];
  size?: Size;
  /** Desenha contorno de 1px que acompanha as diagonais */
  bordered?: boolean;
}
