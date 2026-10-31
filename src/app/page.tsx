"use client";

import { ArrowDownUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { StackView } from "@/components/fichas";
import { Navbar } from "@/components/navbar";
import { LooseItemsCard } from "@/components/tally/loose-items-card";
import { NewFichaCard } from "@/components/tally/new-ficha-card";
import { SeriesCard } from "@/components/tally/series-card";
import { TallyToolbar } from "@/components/tally/tally-toolbar";
import {
  type Card,
  LOOSE_ID,
  NEW_ID,
  type SortMode,
} from "@/components/tally/types";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { TextureOverlay } from "@/components/ui/texture-overlay";
import { useLocale } from "@/lib/i18n";
import {
  type Appearance,
  type Category,
  DEFAULT_APPEARANCE,
  type Nomenclature,
  normalizeAppearance,
  type Series,
  toggleMissing,
  uid,
  useData,
} from "@/lib/store";

export default function HomePage() {
  const { t } = useLocale();
  const [data, setData, loaded] = useData();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("order");
  const [mode, setMode] = useState<"stack" | "list">("stack");
  const [index, setIndex] = useState(0);
  const [navigation, setNavigation] = useState({ direction: 1, token: 0 });
  const [adding, setAdding] = useState(false);
  const [draftAppearance, setDraftAppearance] =
    useState<Appearance>(DEFAULT_APPEARANCE);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const allCards = useMemo<Card[]>(
    () => [
      ...(adding ? [{ id: NEW_ID, draft: true }] : []),
      ...data.series.map((series) => ({ id: series.id, series })),
      { id: LOOSE_ID },
    ],
    [adding, data.series],
  );

  const matches = useCallback(
    (card: Card, value: string) => {
      const normalized = value.trim().toLowerCase();
      if (card.draft) return true;
      if (card.series) {
        return card.series.title.toLowerCase().includes(normalized);
      }
      return (
        "avulsos".includes(normalized) ||
        data.items.some((item) => item.title.toLowerCase().includes(normalized))
      );
    },
    [data.items],
  );

  const cards = useMemo(
    () => allCards.filter((card) => matches(card, query)),
    [allCards, matches, query],
  );

  const current = Math.min(index, Math.max(0, cards.length - 1));

  const missingCount = useMemo(
    () =>
      data.series.reduce(
        (total, series) =>
          total + Math.max(0, series.total - (series.acquired?.length ?? 0)),
        0,
      ) + data.items.filter((item) => !item.found).length,
    [data.series, data.items],
  );

  const updateSeries = useCallback(
    (id: string, patch: Partial<Series>) => {
      setData((currentData) => ({
        ...currentData,
        series: currentData.series.map((series) => {
          if (series.id !== id) return series;
          const next = { ...series, ...patch };
          return patch.appearance
            ? { ...next, appearance: normalizeAppearance(patch.appearance) }
            : next;
        }),
      }));
    },
    [setData],
  );

  const removeSeries = useCallback(
    (id: string) => {
      setData((currentData) => ({
        ...currentData,
        series: currentData.series.filter((series) => series.id !== id),
      }));
    },
    [setData],
  );

  const toggleVolume = useCallback(
    (id: string, volume: number) => {
      setData((currentData) => ({
        ...currentData,
        series: currentData.series.map((series) =>
          series.id === id
            ? {
                ...series,
                acquired: toggleMissing(series.acquired ?? [], volume),
              }
            : series,
        ),
      }));
    },
    [setData],
  );

  const toggleItem = useCallback(
    (id: string) => {
      setData((currentData) => ({
        ...currentData,
        items: currentData.items.map((item) =>
          item.id === id ? { ...item, found: !(item.found ?? false) } : item,
        ),
      }));
    },
    [setData],
  );

  const addItem = useCallback(
    (title: string) => {
      setData((currentData) => ({
        ...currentData,
        items: [
          ...currentData.items,
          { id: uid(), title, category: "book" as Category, found: false },
        ],
      }));
    },
    [setData],
  );

  const setLooseAppearance = useCallback(
    (looseAppearance: Appearance) => {
      setData((currentData) => ({
        ...currentData,
        looseAppearance: normalizeAppearance(looseAppearance),
      }));
    },
    [setData],
  );

  const startAdding = useCallback(() => {
    setDraftAppearance(DEFAULT_APPEARANCE);
    setAdding(true);
    setIndex(0);
  }, []);

  const handleCreate = useCallback(
    (
      title: string,
      category: Category,
      total: number,
      nomenclature: Nomenclature,
      appearance: Appearance,
    ) => {
      setData((currentData) => ({
        ...currentData,
        series: [
          {
            id: uid(),
            title,
            category,
            total,
            acquired: [],
            nomenclature,
            appearance: normalizeAppearance(appearance),
          },
          ...currentData.series,
        ],
      }));
      setAdding(false);
      setIndex(0);
    },
    [setData],
  );

  const sortButton = useMemo(
    () => (
      <Button
        aria-label={t("missingFirst")}
        className="h-7 px-2 text-xs text-inherit hover:bg-current/10 hover:text-inherit"
        onClick={() =>
          setSort((currentSort) =>
            currentSort === "order" ? "missing" : "order",
          )
        }
        size="sm"
        variant="ghost"
      >
        <ArrowDownUp className="size-3.5" />
        {sort === "order" ? t("inOrder") : t("missingFirst")}
      </Button>
    ),
    [sort, t],
  );

  const renderCard = useCallback(
    (card: Card, big = false) => {
      if (card.draft) {
        return (
          <NewFichaCard
            appearance={draftAppearance}
            big={big}
            onAppearanceChange={setDraftAppearance}
            onCancel={() => setAdding(false)}
            onCreateLoose={(title, appearance) => {
              setData((currentData) => ({
                ...currentData,
                series: [
                  {
                    id: uid(),
                    title,
                    category: "other",
                    total: 0,
                    acquired: [],
                    appearance: normalizeAppearance(appearance),
                    isLoose: true,
                    looseItems: [],
                  },
                  ...currentData.series,
                ],
              }));
              setAdding(false);
              setIndex(0);
            }}
            onCreate={handleCreate}
          />
        );
      }

      if (card.series) {
        const { series } = card;
        if (series.isLoose) {
          return (
            <LooseItemsCard
              appearance={series.appearance}
              big={big}
              data={{ ...data, items: series.looseItems ?? [] }}
              items={series.looseItems ?? []}
              onAddItem={(title) =>
                updateSeries(series.id, {
                  looseItems: [
                    ...(series.looseItems ?? []),
                    { id: uid(), title, category: "other", found: false },
                  ],
                })
              }
              onAppearanceChange={(appearance) =>
                updateSeries(series.id, { appearance })
              }
              onToggleItem={(item) =>
                updateSeries(series.id, {
                  looseItems: (series.looseItems ?? []).map((currentItem) =>
                    currentItem.id === item.id
                      ? { ...currentItem, found: !currentItem.found }
                      : currentItem,
                  ),
                })
              }
              query={query}
              sort={sort}
              sortButton={sortButton}
              title={series.title}
            />
          );
        }
        return (
          <SeriesCard
            big={big}
            onAppearance={(appearance) =>
              updateSeries(series.id, { appearance })
            }
            onDelete={() => removeSeries(series.id)}
            onToggleVolume={(volume) => toggleVolume(series.id, volume)}
            onUpdate={(patch) => updateSeries(series.id, patch)}
            series={series}
            sort={sort}
            sortButton={sortButton}
          />
        );
      }

      return (
        <LooseItemsCard
          big={big}
          data={data}
          onAddItem={addItem}
          onAppearanceChange={setLooseAppearance}
          onToggleItem={(item) => toggleItem(item.id)}
          query={query}
          sort={sort}
          sortButton={sortButton}
        />
      );
    },
    [
      addItem,
      data,
      draftAppearance,
      handleCreate,
      query,
      removeSeries,
      setLooseAppearance,
      sort,
      sortButton,
      toggleItem,
      toggleVolume,
      updateSeries,
    ],
  );

  const renderBigCard = useCallback(
    (card: Card) => renderCard(card, true),
    [renderCard],
  );

  const goToPrevious = () => {
    if (mode === "list") {
      carouselApi?.scrollPrev();
      return;
    }
    setNavigation((currentNavigation) => ({
      direction: -1,
      token: currentNavigation.token + 1,
    }));
  };

  const goToNext = () => {
    if (mode === "list") {
      carouselApi?.scrollNext();
      return;
    }
    setNavigation((currentNavigation) => ({
      direction: 1,
      token: currentNavigation.token + 1,
    }));
  };

  return (
    <main className="flex min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-hidden bg-light book:bg-sepia dark:bg-dark relative background-texture rounded-xs">
      <TextureOverlay texture={"grid"} className="mix-blend-overlay z-0" />
      <Navbar
        mode={mode}
        onModeChange={setMode}
        onQueryChange={setQuery}
        onStartAdding={startAdding}
        query={query}
      />
      <TallyToolbar
        canNavigate={cards.length > 1}
        cardCount={allCards.length}
        missingCount={missingCount}
        onNext={goToNext}
        onPrevious={goToPrevious}
        onQueryChange={setQuery}
        query={query}
      />

      {!loaded ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("opening")}
        </p>
      ) : cards.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("noCardsFound")}
        </p>
      ) : mode === "stack" ? (
        <StackView
          cards={cards}
          index={current}
          navigation={navigation}
          render={renderBigCard}
          setIndex={setIndex}
        />
      ) : (
        <Carousel
          className="carousel-ficha flex min-h-0 w-full flex-1 flex-col"
          opts={{ align: "start", loop: true }}
          setApi={setCarouselApi}
        >
          <CarouselContent className="-ml-4 w-full px-3 py-6">
            {cards.map((card) => (
              <CarouselItem
                className="basis-[min(28rem,calc(100vw-2rem))] pl-4 drop-shadow-[0_10px_18px_rgba(0,0,0,0.16)] dark:drop-shadow-[0_12px_20px_rgba(0,0,0,0.42)]"
                key={card.id}
              >
                {renderCard(card, true)}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </main>
  );
}
