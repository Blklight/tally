"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "pt-BR" | "en";

const STORAGE_KEY = "tally-locale";

const messages = {
  "pt-BR": {
    language: "Idioma",
    portuguese: "Português",
    english: "English",
    stackedCards: "Fichas empilhadas",
    continuousList: "Lista contínua",
    index: "Índice",
    newCard: "Nova ficha",
    cards: "fichas",
    missing: "faltantes",
    searchCards: "Buscar fichas",
    searchPlaceholder: "Buscar fichas...",
    previousCard: "Ficha anterior",
    nextCard: "Próxima ficha",
    inOrder: "Em ordem",
    missingFirst: "Faltantes primeiro",
    opening: "Abrindo fichário…",
    noCardsFound: "Nenhuma ficha encontrada.",
  },
  en: {
    language: "Language",
    portuguese: "Português",
    english: "English",
    stackedCards: "Stacked cards",
    continuousList: "Continuous list",
    index: "Index",
    newCard: "New card",
    cards: "cards",
    missing: "missing",
    searchCards: "Search cards",
    searchPlaceholder: "Search cards...",
    previousCard: "Previous card",
    nextCard: "Next card",
    inOrder: "In order",
    missingFirst: "Missing first",
    opening: "Opening binder…",
    noCardsFound: "No cards found.",
  },
} as const;

type MessageKey = keyof typeof messages.en;

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}>({
  locale: "pt-BR",
  setLocale: () => undefined,
  t: (key) => messages["pt-BR"][key],
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "pt-BR" || saved === "en") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(STORAGE_KEY, nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: MessageKey) => messages[locale][key],
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
