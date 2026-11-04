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
    theme: "Tema",
    toggleTheme: "Alternar tema",
    light: "Claro",
    dark: "Escuro",
    book: "Livro",
    system: "Sistema",
    menu: "Menu",
    commandMenu: "Comandos",
    commandDescription: "Acesse rapidamente as ações do Tally.",
    commandPlaceholder: "Filtrar fichas...",
    commandActions: "Ações",
    commandOverview: "Resumo",
    commandSearch: "Filtro de fichas",
    commandPreferences: "Preferências",
    commandHelp: "Ajuda",
    noCommands: "Nenhum comando encontrado.",
    exportData: "Exportar dados",
    importData: "Importar dados",
    importDataDescription:
      "Cole um JSON exportado pelo Tally. Itens repetidos serão ignorados.",
    import: "Importar",
    help: "Ajuda",
    helpTitle: "Como usar o Tally",
    helpIntro: "Organize suas coleções e acompanhe o que já foi adquirido.",
    helpCreate:
      "Use Nova ficha para criar uma coleção ou abrir uma ficha de avulsos.",
    helpCheck:
      "Marque os itens conforme você os adquire. O progresso é atualizado automaticamente.",
    helpViews:
      "Alterne entre fichas empilhadas e lista contínua no menu de visualização.",
    helpNavigation:
      "Use as setas para navegar entre fichas e voltar para a ficha anterior.",
    helpGestures:
      "No mobile, deslize para a esquerda ou direita para trocar de ficha. No desktop, você também pode arrastar a ficha horizontalmente com o mouse ou trackpad.",
    view: "Visualização",
    stackedCards: "Fichas empilhadas",
    continuousList: "Lista contínua",
    index: "Índice",
    newCard: "Nova ficha",
    card: "ficha",
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
    newCardTitle: "Nova ficha",
    fillNewCollection: "Preencha os dados da nova coleção",
    create: "Criar ficha",
    cancel: "Cancelar",
    finish: "Concluir",
    editCard: "Editar ficha",
    deleteCard: "Excluir ficha",
    title: "Título",
    category: "Categoria",
    nomenclature: "Nomenclatura",
    total: "Total de",
    decreaseTotal: "Diminuir total",
    increaseTotal: "Aumentar total",
    volume: "volumes",
    issue: "edições",
    paperColor: "Cor do papel",
    customColor: "Escolher cor personalizada",
    contrastHint:
      "A cor do texto é definida automaticamente para manter o contraste.",
    newLooseItem: "Novo item avulso",
    createLooseCard: "Abrir ficha de avulsos",
    cardType: "Tipo de ficha",
    collectionCard: "Coleção numerada",
    looseCard: "Itens avulsos",
    looseCardDescription: "Sem categoria, nomenclatura ou total obrigatório.",
    addLooseItem: "Adicionar item…",
    looseItems: "Avulsos",
    individualItems: "itens individuais",
    noLooseItems: "Nenhum item avulso",
    indexJump: "Pular para ficha",
    jumpTo: "Pular para...",
    complete: "Coleção completa!",
    oneMissing: "faltante",
    manyMissing: "faltantes",
    viewItems: "Ver itens",
    cover: "Capa",
    editLoose: "Editar avulsos",
    addItem: "Adicionar item…",
    done: "Concluir",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    editItem: "Editar item",
    editNote: "Editar nota",
    addNote: "Adicionar nota",
    notePlaceholder: "Ex.: edição de capa dura",
    priority: "Prioridade",
    removePriority: "Tirar prioridade",
    priorityItem: "Item prioritário",
    itemActions: "Ações do item",
    acquiredOf: "de",
    active: "Ativo",
    importInvalid: "JSON inválido ou sem itens.",
    importReadError: "Não foi possível ler esse JSON.",
    oneAction: "ação",
    manyActions: "ações",
    actionsRevealed: "ações visíveis",
    releaseTo: "Solte para",
    deletedCard: "Ficha excluída",
    deletedItem: "Item excluído",
    undo: "Desfazer",
    showFiltered: "Ver fichas filtradas",
    importedCount: "itens importados",
    importedOne: "item importado",
    nothingImported: "Nada novo para importar",
    colors: {
      white: "Branco",
      craft: "Craft",
      sepia: "Sépia",
      pink: "Rosa",
      green: "Verde",
      blue: "Azul",
    },
  },
  en: {
    language: "Language",
    portuguese: "Português",
    english: "English",
    theme: "Theme",
    toggleTheme: "Toggle theme",
    light: "Light",
    dark: "Dark",
    book: "Book",
    system: "System",
    menu: "Menu",
    commandMenu: "Commands",
    commandDescription: "Quickly access Tally actions.",
    commandPlaceholder: "Filter cards...",
    commandActions: "Actions",
    commandOverview: "Overview",
    commandSearch: "Card filter",
    commandPreferences: "Preferences",
    commandHelp: "Help",
    noCommands: "No commands found.",
    exportData: "Export data",
    importData: "Import data",
    importDataDescription:
      "Paste JSON exported by Tally. Duplicate items will be ignored.",
    import: "Import",
    help: "Help",
    helpTitle: "How to use Tally",
    helpIntro: "Organize your collections and track what you have acquired.",
    helpCreate:
      "Use New card to create a collection or open the loose-items card.",
    helpCheck:
      "Mark items as you acquire them. Progress updates automatically.",
    helpViews:
      "Switch between stacked cards and the continuous list from the view menu.",
    helpNavigation:
      "Use the arrows to move between cards and return to the previous card.",
    helpGestures:
      "On mobile, swipe left or right to change cards. On desktop, drag the card horizontally with your mouse or trackpad.",
    view: "View",
    stackedCards: "Stacked cards",
    continuousList: "Continuous list",
    index: "Index",
    newCard: "New card",
    card: "card",
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
    newCardTitle: "New card",
    fillNewCollection: "Fill in the new collection details",
    create: "Create card",
    cancel: "Cancel",
    finish: "Done",
    editCard: "Edit card",
    deleteCard: "Delete card",
    title: "Title",
    category: "Category",
    nomenclature: "Nomenclature",
    total: "Total of",
    decreaseTotal: "Decrease total",
    increaseTotal: "Increase total",
    volume: "volumes",
    issue: "issues",
    paperColor: "Paper color",
    customColor: "Choose custom color",
    contrastHint: "Text color is set automatically to preserve contrast.",
    newLooseItem: "New loose item",
    createLooseCard: "Open loose-items card",
    cardType: "Card type",
    collectionCard: "Numbered collection",
    looseCard: "Loose items",
    looseCardDescription: "No category, nomenclature, or required total.",
    addLooseItem: "Add item…",
    looseItems: "Loose items",
    individualItems: "individual items",
    noLooseItems: "No loose items",
    indexJump: "Jump to card",
    jumpTo: "Jump to...",
    complete: "Collection complete!",
    oneMissing: "missing",
    manyMissing: "missing",
    viewItems: "View items",
    cover: "Cover",
    editLoose: "Edit loose items",
    addItem: "Add item…",
    done: "Done",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    editItem: "Edit item",
    editNote: "Edit note",
    addNote: "Add note",
    notePlaceholder: "E.g. hardcover edition",
    priority: "Priority",
    removePriority: "Remove priority",
    priorityItem: "Priority item",
    itemActions: "Item actions",
    acquiredOf: "of",
    active: "Active",
    importInvalid: "Invalid JSON or no items.",
    importReadError: "Could not read this JSON.",
    oneAction: "action",
    manyActions: "actions",
    actionsRevealed: "actions revealed",
    releaseTo: "Release to",
    deletedCard: "Card deleted",
    deletedItem: "Item deleted",
    undo: "Undo",
    showFiltered: "Show filtered cards",
    importedCount: "items imported",
    importedOne: "item imported",
    nothingImported: "Nothing new to import",
    colors: {
      white: "White",
      craft: "Craft",
      sepia: "Sepia",
      pink: "Pink",
      green: "Green",
      blue: "Blue",
    },
  },
} as const;

type MessageKey = Exclude<keyof typeof messages.en, "colors">;

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
    if (saved === "pt-BR" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
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

export function categoryLabel(category: string, locale: Locale) {
  const labels = {
    "pt-BR": {
      manga: "Mangá",
      book: "Livro",
      magazine: "Revista",
      comic: "HQ",
      other: "Outro",
      "individual-items": "Itens individuais",
    },
    en: {
      manga: "Manga",
      book: "Book",
      magazine: "Magazine",
      comic: "Comic",
      other: "Other",
      "individual-items": "Individual items",
    },
  } as const;
  return labels[locale][category as keyof (typeof labels)["en"]] ?? category;
}

export function nomenclatureLabel(nomenclature: string, locale: Locale) {
  return locale === "pt-BR"
    ? nomenclature === "issue"
      ? "Edição"
      : "Volume"
    : nomenclature === "issue"
      ? "Issue"
      : "Volume";
}
