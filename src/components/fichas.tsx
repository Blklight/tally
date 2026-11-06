"use client";

import {
  Check,
  ChevronLeft,
  Pencil,
  Settings2,
  Star,
  StickyNote,
  Trash2,
} from "lucide-react";
import {
  Children,
  type CSSProperties,
  cloneElement,
  isValidElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import noisyTexture from "@/assets/images/noisy.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/lib/i18n";
import {
  type Appearance,
  DEFAULT_APPEARANCE,
  HOLD_DURATION,
  normalizeAppearance,
} from "@/lib/store";
import { cn } from "@/lib/utils";
import { CornerFrame, CornerMarkers } from "./corner-frame";
import SwipeRow, { type SwipeAction } from "./SwipeRow";
import { PingPongText } from "./tally/ping-pong-text";
import { useProgressiveCount } from "./tally/use-progressive-count";
import { ChamferButton } from "./ui/chamfer-button";

const DELETE_COLOR = "#e5484d";
const PRIORITY_COLOR = "#d97706";
const NEUTRAL_COLOR = "#52525b";
const FLIP_DURATION = 700;

export function HoldRow({
  label,
  note,
  checked,
  onToggle,
  priority = false,
  onTogglePriority,
  onEdit,
  onEditNote,
  onDelete,
}: {
  label: string;
  note?: string | undefined;
  checked: boolean;
  onToggle: () => void;
  priority?: boolean;
  onTogglePriority?: () => void;
  onEdit?: (title: string) => void;
  onEditNote?: (note: string) => void;
  onDelete?: () => void;
}) {
  const { t } = useLocale();
  const [holding, setHolding] = useState(false);
  const [editMode, setEditMode] = useState<"title" | "note" | null>(null);
  const [draft, setDraft] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const drawerOpen = useRef(false);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    origin.current = null;
    setHolding(false);
  };

  const begin = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(35);
        } catch {
          /* noop */
        }
      }
      onToggle();
    }, HOLD_DURATION);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const openEditor = (mode: "title" | "note") => {
    setDraft(mode === "title" ? label : (note ?? ""));
    setEditMode(mode);
  };

  const actions: SwipeAction[] = [];
  if (onDelete) {
    actions.push({
      id: "delete",
      label: t("delete"),
      icon: <Trash2 className="size-5" />,
      color: DELETE_COLOR,
      onSelect: onDelete,
    });
  }
  if (onTogglePriority) {
    actions.push({
      id: "priority",
      label: priority ? t("removePriority") : t("priority"),
      icon: <Star className={cn("size-5", priority && "fill-current")} />,
      color: PRIORITY_COLOR,
      dismiss: false,
      onSelect: onTogglePriority,
    });
  }
  if (onEdit) {
    actions.push({
      id: "edit",
      label: t("edit"),
      icon: <Pencil className="size-5" />,
      color: NEUTRAL_COLOR,
      dismiss: false,
      onSelect: () => openEditor("title"),
    });
  }
  if (onEditNote) {
    actions.push({
      id: "note",
      label: note ? t("editNote") : t("addNote"),
      icon: <StickyNote className="size-5" />,
      color: NEUTRAL_COLOR,
      dismiss: false,
      onSelect: () => openEditor("note"),
    });
  }

  const content = (
    <>
      <span className="hold-fill pointer-events-none absolute inset-0 origin-left bg-current/20" />
      {/* biome-ignore lint/a11y/useSemanticElements: o gesto de segurar não cabe num <input type="checkbox"> nativo */}
      <div
        role="checkbox"
        tabIndex={0}
        aria-checked={checked}
        aria-label={label}
        className="relative flex min-h-16 w-full min-w-0 items-center gap-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-current/40"
        onClick={(e) => {
          if (e.detail === 0) onToggle();
        }}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <span
          className={cn(
            "relative flex size-6 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] border-current",
            checked && "bg-current",
          )}
        >
          {checked && <Check className="check-pop size-4 text-paper" />}
        </span>
        <span
          className={cn(
            "relative min-w-0 flex-1 break-words text-left text-sm",
            checked && "opacity-50",
          )}
        >
          <span className={cn("strike", checked && "is-struck")}>{label}</span>
          {note && (
            <PingPongText className="mt-1 text-xs opacity-60">
              {note}
            </PingPongText>
          )}
        </span>
        {priority && (
          <Star
            aria-label={t("priorityItem")}
            className="relative size-4 shrink-0 fill-current"
            role="img"
          />
        )}
      </div>
    </>
  );

  const saveEdit = () => {
    const value = draft.trim();
    if (editMode === "title") {
      if (!value) return;
      onEdit?.(value);
    } else {
      onEditNote?.(value);
    }
    setEditMode(null);
  };

  return (
    <>
      <div
        className={cn(
          "hold-row w-full cursor-default",
          holding && "is-holding",
        )}
        onPointerDown={(e) => {
          if (e.button !== 0 || editMode || drawerOpen.current) return;
          if ((e.target as HTMLElement).closest("button")) return;
          origin.current = { x: e.clientX, y: e.clientY };
          begin();
        }}
        onPointerMove={(e) => {
          if (
            origin.current &&
            Math.hypot(
              e.clientX - origin.current.x,
              e.clientY - origin.current.y,
            ) > 10
          )
            cancel();
        }}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
      >
        {actions.length > 0 ? (
          <SwipeRow
            actionColor={onDelete ? DELETE_COLOR : PRIORITY_COLOR}
            actions={actions}
            className="border-b border-current/10"
            drawerColor={NEUTRAL_COLOR}
            fullSwipe={!!onDelete}
            height="auto"
            label={t("itemActions")}
            messages={{
              toggle: (count) =>
                `${count} ${count === 1 ? t("oneAction") : t("manyActions")}`,
              revealed: (count) => `${count} ${t("actionsRevealed")}`,
              release: (action) => `${t("releaseTo")} ${action}`,
            }}
            onOpenChange={(open) => {
              drawerOpen.current = open;
              if (open) cancel();
            }}
            radius={2}
            rowColor={`url(${noisyTexture.src}), var(--paper)`}
            textColor="inherit"
          >
            {content}
          </SwipeRow>
        ) : (
          <div className="relative flex border-b border-current/10 px-4">
            {content}
          </div>
        )}
      </div>
      <Dialog
        onOpenChange={(open) => {
          if (!open) setEditMode(null);
        }}
        open={editMode !== null}
      >
        <DialogContent className="max-w-sm">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveEdit();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {editMode === "title"
                  ? t("editItem")
                  : note
                    ? t("editNote")
                    : t("addNote")}
              </DialogTitle>
            </DialogHeader>
            {editMode === "note" ? (
              <Textarea
                aria-label={t("editNote")}
                autoFocus
                className="max-h-48 resize-none"
                onChange={(event) =>
                  setDraft(event.target.value.replace(/\s*\n\s*/g, " "))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder={t("notePlaceholder")}
                rows={2}
                value={draft}
              />
            ) : (
              <Input
                aria-label={t("title")}
                autoFocus
                onChange={(event) => setDraft(event.target.value)}
                value={draft}
              />
            )}
            <DialogFooter>
              <Button
                onClick={() => setEditMode(null)}
                type="button"
                variant="ghost"
              >
                {t("cancel")}
              </Button>
              <Button
                disabled={editMode === "title" && !draft.trim()}
                type="submit"
              >
                {t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CountUp({ value, pad = true }: { value: number; pad?: boolean }) {
  const [display, setDisplay] = useState(0);
  const shown = useRef(0);

  useEffect(() => {
    let frame = 0;
    const from = shown.current;
    const started = performance.now();
    const duration = 720;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(from + (value - from) * eased);
      shown.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{pad ? String(display).padStart(2, "0") : String(display)}</>;
}

const CHAMFER = 44,
  RADIUS = 16,
  FILLET = 8;

function filletPath(w: number, h: number, corner: "br" | "bl") {
  const c = CHAMFER,
    R = RADIUS,
    F = FILLET;
  const pts: [number, number, number][] =
    corner === "br"
      ? [
          [0, 0, R],
          [w, 0, R],
          [w, h - c, F],
          [w - c, h, F],
          [0, h, R],
        ]
      : [
          [0, 0, R],
          [w, 0, R],
          [w, h, R],
          [c, h, F],
          [0, h - c, F],
        ];
  const n = pts.length,
    f = (v: number) => +v.toFixed(2),
    out: string[] = [];
  for (let i = 0; i < n; i++) {
    const point = pts[i];
    const previousPoint = pts[(i - 1 + n) % n];
    const nextPoint = pts[(i + 1) % n];
    if (!point || !previousPoint || !nextPoint) continue;
    const [x, y, r] = point;
    const [px, py] = previousPoint;
    const [nx, ny] = nextPoint;
    const lp = Math.hypot(x - px, y - py),
      ln = Math.hypot(nx - x, ny - y),
      t = Math.min(r, lp / 2, ln / 2);
    const ax = x + ((px - x) / lp) * t,
      ay = y + ((py - y) / lp) * t,
      bx = x + ((nx - x) / ln) * t,
      by = y + ((ny - y) / ln) * t,
      k = 0.55;
    out.push(
      `${i ? "L" : "M"} ${f(ax)} ${f(ay)}`,
      `C ${f(ax + (x - ax) * k)} ${f(ay + (y - ay) * k)} ${f(bx + (x - bx) * k)} ${f(
        by + (y - by) * k,
      )} ${f(bx)} ${f(by)}`,
    );
  }
  return `path("${out.join(" ")} Z")`;
}

function Fillet({
  corner,
  className,
  children,
}: {
  corner: "br" | "bl";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [clip, setClip] = useState<string>();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setClip(filletPath(el.offsetWidth, el.offsetHeight, corner));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [corner]);

  return (
    <section
      ref={ref}
      className={cn(className, !clip && "rounded-2xl")}
      style={clip ? { clipPath: clip } : undefined}
    >
      {children}
    </section>
  );
}

export function HoldAction({
  label,
  onComplete,
}: {
  label: string;
  onComplete: () => void;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  };
  const begin = () => {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onComplete();
    }, HOLD_DURATION);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn(
        "hold-row relative min-h-10 justify-start overflow-hidden text-destructive",
        holding && "is-holding",
      )}
      onPointerDown={(e) => {
        if (e.button === 0) begin();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span className="hold-fill absolute inset-0 origin-left bg-current/20" />
      <span className="relative flex items-center gap-2">
        <Trash2 /> {label}
      </span>
    </Button>
  );
}

export function Ficha({
  title,
  category,
  summary,
  children,
  appearance = DEFAULT_APPEARANCE,
  onEdit,
  editContent,
  startEditing,
  onEditingChange,
  big,
  actions,
  count,
  countSuffix,
  countLabel,
}: {
  title: string;
  category: string;
  summary?: string;
  children: ReactNode;
  actions?: ReactNode;
  appearance?: Appearance | undefined;
  onEdit: () => void;
  big?: boolean;
  count?: number;
  countSuffix?: string;
  countLabel?: string;
  editContent?: ReactNode;
  startEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
}) {
  const { t } = useLocale();
  const [flipped, setFlipped] = useState(false);
  const backRows = Children.toArray(children);
  const mountedRows = useProgressiveCount(backRows.length);
  const [editing, setEditing] = useState(startEditing ?? false);
  useEffect(() => setEditing(startEditing ?? false), [startEditing]);
  const frontBtnRef = useRef<HTMLButtonElement>(null);
  const backBtnRef = useRef<HTMLButtonElement>(null);

  const [settledFlipped, setSettledFlipped] = useState(false);
  const focusAfterFlip = useRef(false);

  useEffect(() => {
    if (flipped === settledFlipped) return;
    // O verso só troca de `inert` depois do giro: com centenas de linhas, isso recalcula o estilo de todas.
    const id = setTimeout(() => {
      focusAfterFlip.current = true;
      setSettledFlipped(flipped);
    }, FLIP_DURATION);
    return () => clearTimeout(id);
  }, [flipped, settledFlipped]);

  useEffect(() => {
    if (!focusAfterFlip.current) return;
    focusAfterFlip.current = false;
    (settledFlipped ? backBtnRef : frontBtnRef).current?.focus();
  }, [settledFlipped]);

  const flip = () => setFlipped((f) => !f);

  const resolvedCountLabel = countLabel ?? t("manyMissing");
  const settings = (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-inherit hover:bg-current/10 hover:text-inherit"
      aria-label={`${t("editCard")} ${title}`}
      title={t("editCard")}
      onClick={() => {
        setEditing(true);
        onEditingChange?.(true);
        onEdit();
      }}
    >
      <Settings2 />
    </Button>
  );
  const resolvedAppearance = normalizeAppearance(appearance);
  const paperStyle = { "--paper": resolvedAppearance.paper } as CSSProperties;
  const face =
    "ficha relative flex h-full flex-col justify-between overflow-hidden bg-paper p-6 pb-7 text-paper-ink sm:p-8 background-texture";

  if (!big) {
    return (
      <div
        style={paperStyle}
        data-paper={resolvedAppearance.paper}
        data-ink={resolvedAppearance.ink}
        className="flip-scene h-full w-full"
      >
        <Fillet corner="br" className={face}>
          {editing && editContent ? (
            <div className="relative min-h-0">
              {isValidElement(editContent)
                ? cloneElement(
                    editContent as React.ReactElement<{
                      onEditingChange?: (value: boolean) => void;
                    }>,
                    {
                      onEditingChange: (value: boolean) => {
                        setEditing(value);
                        onEditingChange?.(value);
                      },
                    },
                  )
                : editContent}
            </div>
          ) : (
            <>
              <header className="relative mb-4 shrink-0 border-b border-current/25 pb-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs uppercase opacity-60">
                    {category}
                  </span>
                  {settings}
                </div>
                <h2 className="break-words font-display text-2xl font-medium">
                  {title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  {summary ? (
                    <p className="text-xs opacity-60">{summary}</p>
                  ) : (
                    <span />
                  )}
                  {actions}
                </div>
              </header>
              <div className="relative min-h-0">{children}</div>
            </>
          )}
        </Fillet>
      </div>
    );
  }

  return (
    <div
      style={paperStyle}
      data-paper={resolvedAppearance.paper}
      data-ink={resolvedAppearance.ink}
      className="flip-scene h-full w-full"
    >
      <div
        className={cn(
          "flip-inner relative h-full w-full",
          flipped && "flipped",
        )}
      >
        <div
          className="flip-face absolute inset-0 rounded-2xl"
          aria-hidden={flipped}
          inert={flipped ? true : undefined}
        >
          <Fillet corner="br" className={face}>
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="relative">
                <CornerMarkers
                  cornerSize={8}
                  cornerThickness={2}
                  cornerOpacity={0.5}
                />{" "}
                <span className="text-xs uppercase p-2">{category}</span>
              </div>
              {settings}
            </div>
            <div className="flex flex-1 flex-col my-10">
              <CornerFrame
                cornerSize={12}
                cornerThickness={2}
                cornerOpacity={0.7}
                className="p-2.5"
                withBackground={false}
              >
                <h2 className="wrap-break-word font-mono text-3xl font-medium sm:text-4xl uppercase">
                  {title}
                </h2>
                {summary && (
                  <p className="mt-2 text-sm opacity-80 font-mono">{summary}</p>
                )}
                {!summary && <span className="w-full h-5 mt-2 block"></span>}
              </CornerFrame>

              <div className="mt-6 border-current/25 pt-8">
                {count !== undefined && (
                  <p className="flex flex-col items-center gap-1 leading-none">
                    <span className="count-display flex items-baseline font-medium text-8xl sm:text-[144px]">
                      <CountUp pad={!countSuffix} value={count} />
                      {countSuffix && (
                        <span className="ml-1 select-none text-5xl font-light opacity-75 sm:text-8xl">
                          {countSuffix}
                        </span>
                      )}
                    </span>
                    {resolvedCountLabel && (
                      <span className="whitespace-nowrap px-2 text-sm font-normal opacity-60">
                        {resolvedCountLabel}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="grid mb-2">
              <ChamferButton
                ref={frontBtnRef}
                onClick={flip}
                className="bg-paper-ink text-paper hover:bg-paper-ink/85"
                corner="br"
                aria-label={t("viewItems")}
              >
                {t("viewItems")} ↻
              </ChamferButton>
              {/* <Button
                ref={frontBtnRef}
                variant="outline"
                size="sm"
                className="border-current/40 bg-transparent text-inherit hover:bg-current/10 hover:text-inherit"
                onClick={flip}
              >
                Ver itens ↻
              </Button> */}
            </div>
            {editing && editContent && (
              <div className="ficha ficha-form scrollbar-none absolute inset-0 z-10 overflow-y-auto bg-paper p-6 pb-7 text-paper-ink sm:p-8">
                {isValidElement(editContent)
                  ? cloneElement(
                      editContent as React.ReactElement<{
                        onEditingChange?: (value: boolean) => void;
                      }>,
                      {
                        onEditingChange: (value: boolean) => {
                          setEditing(value);
                          onEditingChange?.(value);
                        },
                      },
                    )
                  : editContent}
              </div>
            )}
          </Fillet>
        </div>
        <div
          className="flip-face flip-back absolute inset-0 rounded-2xl"
          aria-hidden={!flipped}
          inert={!settledFlipped ? true : undefined}
        >
          <Fillet corner="bl" className={face}>
            <header className="relative mb-2 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <Button
                  ref={backBtnRef}
                  variant="ghost"
                  size="sm"
                  className="-ml-2 text-inherit hover:bg-current/10 hover:text-inherit"
                  onClick={flip}
                >
                  <ChevronLeft /> {t("cover")}
                </Button>
                {actions}
              </div>
            </header>
            <CornerFrame
              cornerSize={16}
              cornerThickness={2}
              cornerOpacity={0.9}
              withBackground={false}
              withTexture
              className="relative flex min-h-0 flex-1 flex-col mb-5 p-2"
            >
              <div className="scrollbar-none relative min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
                {backRows.slice(0, mountedRows)}
              </div>
            </CornerFrame>
          </Fillet>
        </div>
      </div>
    </div>
  );
}

export function FichaSkeleton({ label }: { label: string }) {
  const paperStyle = {
    "--paper": DEFAULT_APPEARANCE.paper,
  } as CSSProperties;
  return (
    <div className="flex min-h-0 flex-1 flex-col pt-2">
      <div className="relative mx-auto mb-6 min-h-0 w-full max-w-md flex-1 px-3 sm:px-0">
        <div
          className="absolute inset-y-0 left-3 right-3 sm:inset-x-0"
          style={{
            filter:
              "drop-shadow(2px 3px 4px color-mix(in oklab, var(--foreground) 16%, transparent)) drop-shadow(5px 8px 14px color-mix(in oklab, var(--foreground) 10%, transparent))",
          }}
        >
          <div
            style={paperStyle}
            data-paper={DEFAULT_APPEARANCE.paper}
            data-ink={DEFAULT_APPEARANCE.ink}
            className="flip-scene h-full w-full"
          >
            <section
              aria-busy="true"
              className="ficha relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-paper p-6 pb-7 text-paper-ink sm:p-8 background-texture"
            >
              <span className="animate-pulse text-sm uppercase opacity-60">
                {label}
              </span>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StackView<T extends { id: string }>({
  cards,
  index,
  setIndex,
  render,
  navigation,
  disabled = false,
}: {
  cards: T[];
  index: number;
  setIndex: (n: number) => void;
  render: (c: T) => ReactNode;
  navigation?: { direction: number; token: number };
  disabled?: boolean;
}) {
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState<{ id: string; dir: number; d: number } | null>(
    null,
  );
  const start = useRef<{
    x: number;
    y: number;
    t: number;
    axis: "x" | "y" | null;
    id: number;
  } | null>(null);
  const busy = useRef(false);
  const n = cards.length;
  const width = () =>
    typeof window === "undefined" ? 400 : Math.min(window.innerWidth, 448);

  const go = (d: number, dir?: number) => {
    if (disabled || n < 2 || busy.current) return;
    const from = cards[index];
    if (!from) return;
    busy.current = true;
    const nextIndex = (index + d + n) % n;
    const side = dir ?? (dx !== 0 ? Math.sign(dx) : d < 0 ? -1 : 1);
    setFly({ id: from.id, dir: side, d });
    setTimeout(() => {
      setIndex(nextIndex);
      setFly(null);
      setDx(0);
      busy.current = false;
    }, 260);
  };

  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });

  const lastNavigationToken = useRef(0);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-card-nav]") &&
        target.closest(
          "input, textarea, button, [role='dialog'], [role='combobox']",
        )
      ) {
        return;
      }
      if (e.key === "ArrowRight") goRef.current(1, -1);
      if (e.key === "ArrowLeft") goRef.current(-1, 1);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (!navigation || navigation.token <= lastNavigationToken.current) return;
    lastNavigationToken.current = navigation.token;
    if (!disabled) goRef.current(navigation.direction);
  }, [navigation, disabled]);

  const current = cards[index];
  if (!current) return null;

  // Mantemos o comportamento de swipe seguro sem quebrar ou trocar os cards de trás
  const end = (commit: boolean) => {
    const s = start.current;
    start.current = null;
    setDragging(false);
    if (!s || s.axis !== "x") return;
    const v = Math.abs(dx) / Math.max(1, Date.now() - s.t);
    if (commit && (Math.abs(dx) > 60 || (Math.abs(dx) > 25 && v > 0.4))) {
      go(1, dx < 0 ? -1 : 1);
    } else {
      setDx(0);
    }
  };

  const depth = Math.min(n, 3);
  const targetStep = fly && fly.d < 0 ? -1 : 1;
  const layers = Array.from({ length: depth }, (_, o) =>
    o === 0 ? cards[index] : cards[(index + o * targetStep + n) % n],
  ).filter((card): card is T => Boolean(card));
  const ease =
    "transform 300ms cubic-bezier(.22,.8,.3,1), filter 300ms, opacity 300ms";

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-2">
      <div
        className="relative mx-auto mb-6 min-h-0 w-full max-w-md flex-1 touch-pan-y select-none overflow-visible px-3 sm:px-0"
        onPointerDown={(e) => {
          if (disabled || busy.current) return;
          if (
            (e.target as HTMLElement).closest(
              "input, textarea, button, select, [role='combobox'], [role='option'], form, .hold-row",
            )
          ) {
            return;
          }
          start.current = {
            x: e.clientX,
            y: e.clientY,
            t: Date.now(),
            axis: null,
            id: e.pointerId,
          };
        }}
        onPointerMove={(e) => {
          const s = start.current;
          if (!s) return;
          const x = e.clientX - s.x;
          const y = e.clientY - s.y;
          if (!s.axis && (Math.abs(x) > 8 || Math.abs(y) > 8)) {
            s.axis = Math.abs(x) > Math.abs(y) * 0.8 ? "x" : "y";
            if (s.axis === "x") {
              setDragging(true);
              try {
                e.currentTarget.setPointerCapture(s.id);
              } catch {
                /* noop */
              }
            }
          }
          if (s.axis === "x") setDx(x);
        }}
        onPointerUp={() => end(true)}
        onPointerCancel={() => end(false)}
      >
        {[...layers].reverse().map((c) => {
          const o = layers.indexOf(c);
          const isFly = fly?.id === c.id;
          const isTop = o === 0 && !isFly;
          // while dragging, cards behind rise toward the front
          const p = fly ? 1 : Math.min(1, Math.abs(dx) / width());
          const d = Math.max(0, o - p);
          let transform = `translate(${d * 10}px, ${d * 10}px)`;
          let z = 10 - o;
          if (isTop) transform = `translateX(${dx}px) rotate(${dx / 40}deg)`;
          if (isFly) {
            transform = `translateX(${fly.dir * width() * 1.15}px) rotate(${fly.dir * 12}deg)`;
            z = 20;
          }
          return (
            <div
              key={c.id}
              aria-hidden={!isTop}
              inert={!isTop ? true : undefined}
              className="absolute inset-y-0 left-3 right-3 sm:inset-x-0"
              style={{
                zIndex: z,
                transform,
                transformOrigin: o === 0 ? "50% 90%" : "0 0",
                filter: `brightness(${
                  1 - d * 0.04
                }) drop-shadow(2px 3px 4px color-mix(in oklab, var(--foreground) 16%, transparent)) drop-shadow(5px 8px 14px color-mix(in oklab, var(--foreground) 10%, transparent))`,
                transition: dragging ? "none" : ease,
              }}
            >
              {render(c)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
