"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CornerPosition = "tl" | "tr" | "br" | "bl";

/**
 * Presets de tamanho pré-definidos:
 * - "2xs" ou "xxs": 8px (size-2) - ideal para tags, badges e botões compactos
 * - "xs": 12px (size-3) - sutil e discreto
 * - "sm": 16px (size-4) - compacto
 * - "md": 24px (size-6 - padrão)
 * - "lg": 32px (size-8) - destaque
 * - "xl": 40px (size-10) - painéis amplos
 */
export type CornerSizePreset = "2xs" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export type CornerDimension = number | string;

/**
 * Permite definir dimensões assimétricas ou livres para os cantos:
 * - Array: `[width, height]` (ex: `[20, 8]` ou `["1.5rem", "0.5rem"]`)
 * - Objeto: `{ width, height }` ou `{ x, y }`
 */
export type CornerCustomDimensions =
  | { width?: CornerDimension; height?: CornerDimension }
  | { x?: CornerDimension; y?: CornerDimension }
  | [CornerDimension, CornerDimension];

export type CornerSize =
  | CornerSizePreset
  | CornerDimension
  | CornerCustomDimensions;

export interface CornerMarkersProps {
  /**
   * Cor personalizada para os cantos (ex: "#fff", "rgb(...)", var(--cor)).
   * Quando não informada, herda a cor padrão (border-muted-foreground).
   */
  color?: string;

  /**
   * Tamanho dos cantos:
   * - Presets: "2xs" | "xxs" (8px), "xs" (12px), "sm" (16px), "md" (24px), "lg" (32px), "xl" (40px)
   * - Número direto em px: `cornerSize={8}` (8px), `cornerSize={10}` (10px)
   * - String CSS ou classe Tailwind: `"10px"`, `"0.5rem"`, `"size-2.5"`, `"w-4 h-2"`
   * - Assimétrico: `[width, height]` (ex: `[16, 6]`) ou `{ width: 20, height: 8 }`
   */
  cornerSize?: CornerSize;

  /**
   * Espessura da borda dos cantos (número em px ou string CSS).
   * Padrão inteligente: 1px para tamanhos muito pequenos (<= 8px ou "2xs"/"xxs"), 2px para os demais.
   */
  cornerThickness?: number | string;

  /**
   * Opacidade dos cantos (0 a 1). Padrão: 0.5 quando color é fornecido, ou 1.
   */
  cornerOpacity?: number;

  /**
   * Deslocamento/offset dos cantos em relação às bordas (ex: 0, 4, "-2px", ou [x, y]).
   */
  cornerOffset?:
    | number
    | string
    | { x?: number | string; y?: number | string }
    | [number | string, number | string];

  /**
   * Quais cantos exibir. Padrão: todos (["tl", "tr", "br", "bl"]).
   */
  corners?: readonly CornerPosition[] | CornerPosition[];

  /**
   * Classes Tailwind adicionais para cada canto.
   */
  cornerClassName?: string;
}

export interface CornerFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CornerMarkersProps {
  /**
   * Conteúdo interno do frame.
   */
  children?: React.ReactNode;

  /**
   * Cor de fundo base para mesclagem com a cor de destaque via color-mix.
   * Usado quando `color` é definido.
   */
  background?: string;

  /**
   * Se deve aplicar a textura sutil de ruído (.background-texture) ou uma classe de textura customizada.
   * Padrão: false (desativado por padrão para manter os frames limpos e não banalizar o efeito).
   *
   * Exemplos:
   * - `withTexture` ou `withTexture={true}`: aplica a classe `.background-texture`
   * - `withTexture="background-noise"`: aplica classe de textura específica
   */
  withTexture?: boolean | string;

  /**
   * Se deve aplicar o fundo sutil (bg-muted-foreground/10 ou color-mix). Padrão: true.
   */
  withBackground?: boolean;
}

const DEFAULT_CORNERS: readonly CornerPosition[] = [
  "tl",
  "tr",
  "br",
  "bl",
] as const;

const PRESET_MAP: Record<
  CornerSizePreset,
  { className: string; defaultSize: number }
> = {
  "2xs": { className: "size-2", defaultSize: 8 },
  xxs: { className: "size-2", defaultSize: 8 },
  xs: { className: "size-3", defaultSize: 12 },
  sm: { className: "size-4", defaultSize: 16 },
  md: { className: "size-6", defaultSize: 24 },
  lg: { className: "size-8", defaultSize: 32 },
  xl: { className: "size-10", defaultSize: 40 },
};

function formatDimension(dim: CornerDimension): string {
  return typeof dim === "number" ? `${dim}px` : dim;
}

/**
 * Converte qualquer especificação de tamanho (preset, number, string, array ou objeto)
 * em classes Tailwind ou estilos inline de width/height.
 */
function resolveCornerSize(size: CornerSize): {
  className?: string;
  style?: React.CSSProperties;
} {
  // 1. Array [width, height]
  if (Array.isArray(size)) {
    return {
      style: {
        width: formatDimension(size[0]),
        height: formatDimension(size[1]),
      },
    };
  }

  // 2. Objeto { width, height } ou { x, y }
  if (typeof size === "object" && size !== null) {
    const w = "width" in size ? size.width : "x" in size ? size.x : undefined;
    const h = "height" in size ? size.height : "y" in size ? size.y : undefined;
    return {
      style: {
        ...(w !== undefined ? { width: formatDimension(w) } : {}),
        ...(h !== undefined ? { height: formatDimension(h) } : {}),
      },
    };
  }

  // 3. Número direto em pixels (ex: 6, 8, 14, 20)
  if (typeof size === "number") {
    return {
      style: {
        width: `${size}px`,
        height: `${size}px`,
      },
    };
  }

  // 4. Presets ("2xs", "xxs", "xs", "sm", "md", "lg", "xl")
  if (size in PRESET_MAP) {
    return { className: PRESET_MAP[size as CornerSizePreset].className };
  }

  // 5. Classes Tailwind compostas (ex: "size-1.5", "size-2.5", "w-4 h-2", etc.)
  if (
    size.includes(" ") ||
    size.startsWith("size-") ||
    size.startsWith("w-") ||
    size.startsWith("h-")
  ) {
    return { className: size };
  }

  // 6. String CSS (ex: "8px", "0.5rem", "1.2em", "calc(...)")
  return {
    style: {
      width: size,
      height: size,
    },
  };
}

/**
 * Renderiza apenas os marcadores de canto (Top-Left, Top-Right, Bottom-Right, Bottom-Left).
 * Pode ser colocado diretamente dentro de qualquer elemento com posicionamento `relative`.
 */
export const CornerMarkers = ({
  color,
  cornerSize = "md",
  cornerThickness,
  cornerOpacity,
  cornerOffset = 0,
  corners = DEFAULT_CORNERS,
  cornerClassName,
}: CornerMarkersProps) => {
  const hasTheme = !!color;

  const sizeInfo = React.useMemo(
    () => resolveCornerSize(cornerSize),
    [cornerSize],
  );

  // Determina a espessura ideal: se o canto for muito pequeno (<= 8px ou "2xs"), usa 1px
  const resolvedThickness = React.useMemo(() => {
    if (cornerThickness !== undefined) {
      return typeof cornerThickness === "number"
        ? `${cornerThickness}px`
        : cornerThickness;
    }
    if (
      cornerSize === "2xs" ||
      cornerSize === "xxs" ||
      (typeof cornerSize === "number" && cornerSize <= 8)
    ) {
      return "1px";
    }
    return "2px";
  }, [cornerThickness, cornerSize]);

  const getCornerPositionStyle = (pos: CornerPosition): React.CSSProperties => {
    let offsetX: string;
    let offsetY: string;

    if (Array.isArray(cornerOffset)) {
      offsetX = formatDimension(cornerOffset[0]);
      offsetY = formatDimension(cornerOffset[1]);
    } else if (typeof cornerOffset === "object" && cornerOffset !== null) {
      offsetX = formatDimension(cornerOffset.x ?? 0);
      offsetY = formatDimension(cornerOffset.y ?? 0);
    } else {
      const val = formatDimension(cornerOffset);
      offsetX = val;
      offsetY = val;
    }

    const basePos: React.CSSProperties = {};
    if (pos === "tl") {
      basePos.top = offsetY;
      basePos.left = offsetX;
    } else if (pos === "tr") {
      basePos.top = offsetY;
      basePos.right = offsetX;
    } else if (pos === "br") {
      basePos.bottom = offsetY;
      basePos.right = offsetX;
    } else if (pos === "bl") {
      basePos.bottom = offsetY;
      basePos.left = offsetX;
    }
    return basePos;
  };

  const getCornerBorderStyle = (pos: CornerPosition): React.CSSProperties => {
    const borders: Record<CornerPosition, string> = {
      tl: `${resolvedThickness} 0 0 ${resolvedThickness}`,
      tr: `${resolvedThickness} ${resolvedThickness} 0 0`,
      br: `0 ${resolvedThickness} ${resolvedThickness} 0`,
      bl: `0 0 ${resolvedThickness} ${resolvedThickness}`,
    };

    return {
      borderWidth: borders[pos],
      borderStyle: "solid",
      borderColor: color ?? "currentColor",
      opacity: cornerOpacity ?? (hasTheme ? 0.5 : undefined),
    };
  };

  return (
    <>
      {corners.map((pos) => {
        const posStyle = getCornerPositionStyle(pos);
        const borderStyle = getCornerBorderStyle(pos);

        return (
          <div
            key={pos}
            aria-hidden="true"
            className={cn(
              "absolute pointer-events-none",
              sizeInfo.className,
              !hasTheme && "border-muted-foreground",
              cornerClassName,
            )}
            style={{
              ...sizeInfo.style,
              ...posStyle,
              ...borderStyle,
            }}
          />
        );
      })}
    </>
  );
};

CornerMarkers.displayName = "CornerMarkers";

/**
 * Componente de container com cantos estilizados e fundo adaptável,
 * baseado no estilo de cantos e frame do `digital-signature`.
 */
export const CornerFrame = React.forwardRef<HTMLDivElement, CornerFrameProps>(
  (
    {
      children,
      color,
      background,
      withTexture = false,
      withBackground = true,
      cornerSize = "md",
      cornerThickness,
      cornerOpacity,
      cornerOffset = 0,
      corners = DEFAULT_CORNERS,
      cornerClassName,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const hasTheme = !!color;

    const textureClass = React.useMemo(() => {
      if (!withTexture) return undefined;
      return typeof withTexture === "string"
        ? withTexture
        : "background-texture";
    }, [withTexture]);

    const frameBackgroundStyle = React.useMemo(() => {
      if (!withBackground) return undefined;

      if (hasTheme) {
        return {
          background: `color-mix(in srgb, ${color} 4%, ${background ?? "transparent"})`,
        };
      }
      return undefined;
    }, [withBackground, hasTheme, color, background]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          textureClass,
          withBackground && !hasTheme && "bg-muted-foreground/10",
          className,
        )}
        style={{
          ...frameBackgroundStyle,
          ...style,
        }}
        {...props}
      >
        <CornerMarkers
          color={color}
          cornerSize={cornerSize}
          cornerThickness={cornerThickness}
          cornerOpacity={cornerOpacity}
          cornerOffset={cornerOffset}
          corners={corners}
          cornerClassName={cornerClassName}
        />
        {children}
      </div>
    );
  },
);

CornerFrame.displayName = "CornerFrame";
