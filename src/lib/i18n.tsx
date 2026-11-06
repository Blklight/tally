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
    installApp: "Instalar app",
    installTitle: "Instalar o Tally",
    installIntro:
      "Instalado, o Tally abre em tela cheia pelo ícone na tela inicial e funciona sem internet.",
    installIosStep1: "Toque em Compartilhar na barra do Safari.",
    installIosStep2: "Escolha Adicionar à Tela de Início.",
    installIosStep3: "Toque em Adicionar.",
    installOtherStep1: "Abra o menu do navegador.",
    installOtherStep2: "Escolha Instalar app ou Adicionar à tela inicial.",
    installDone: "Tally instalado",
    importData: "Importar dados",
    importDataDescription:
      "Cole um JSON exportado pelo Tally. Itens repetidos serão ignorados.",
    import: "Importar",
    help: "Ajuda",
    helpTitle: "Como usar o Tally",
    helpIntro:
      "Cada coleção é uma ficha. Marque o que já tem e veja o que falta.",
    helpStartTitle: "Começar",
    helpStartCreate:
      "Toque em + para criar uma ficha. Escolha Coleção numerada para séries com total (mangás, HQs) ou Itens avulsos para uma lista livre.",
    helpStartLoose:
      "A ficha de Avulsos fica sempre no fim do fichário, para itens que não pertencem a uma série.",
    helpCheckTitle: "Marcar itens",
    helpCheckHold:
      "Na capa, toque em Ver itens para virar a ficha. Pressione e segure um item até a barra encher para marcá-lo ou desmarcá-lo.",
    helpCheckProgress:
      "O progresso e a contagem de faltantes na capa se atualizam sozinhos.",
    helpItemTitle: "Ações do item",
    helpItemSwipe:
      "Deslize um item para a esquerda para ver as ações: prioridade (fica no topo com uma estrela), editar, nota e excluir.",
    helpItemFull:
      "Um deslize longo executa a primeira ação de uma vez. Se excluir algo sem querer, use Desfazer no aviso que aparece.",
    helpOrganizeTitle: "Organizar fichas",
    helpOrganizeSort:
      "Cada ficha guarda sua própria ordenação: por ordem ou faltantes primeiro, crescente ou decrescente.",
    helpOrganizeEdit:
      "Use o lápis na capa para mudar título, total e cor do papel, ou para excluir a ficha.",
    helpNavTitle: "Navegar",
    helpNavMove:
      "Troque de ficha pelas setas abaixo do fichário, deslizando a ficha para os lados ou arrastando com o mouse.",
    helpNavCommands:
      "Em Comandos (✨) você filtra fichas pelo nome, alterna entre fichas empilhadas e lista contínua e muda tema e idioma.",
    helpDataTitle: "Seus dados",
    helpDataLocal:
      "Tudo fica salvo apenas neste navegador. Limpar os dados do site apaga suas fichas.",
    helpDataBackup:
      "Use Exportar dados em Comandos para guardar um backup em JSON. Importar ignora itens repetidos.",
    helpKeysTitle: "Atalhos de teclado",
    keyNewCard: "Nova ficha",
    keySpace: "Espaço",
    keyChangeCard: "Trocar de ficha",
    keyToggleItem: "Marcar item em foco",
    keyItemActions: "Abrir ações do item",
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
    sortBy: "Ordenar",
    sortCriterion: "Critério",
    sortDirection: "Direção",
    ascending: "Crescente",
    descending: "Decrescente",
    oldestFirst: "antigos → novos",
    newestFirst: "novos → antigos",
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
    installApp: "Install app",
    installTitle: "Install Tally",
    installIntro:
      "Once installed, Tally opens full screen from its home screen icon and works offline.",
    installIosStep1: "Tap Share in Safari's toolbar.",
    installIosStep2: "Choose Add to Home Screen.",
    installIosStep3: "Tap Add.",
    installOtherStep1: "Open the browser menu.",
    installOtherStep2: "Choose Install app or Add to Home screen.",
    installDone: "Tally installed",
    importData: "Import data",
    importDataDescription:
      "Paste JSON exported by Tally. Duplicate items will be ignored.",
    import: "Import",
    help: "Help",
    helpTitle: "How to use Tally",
    helpIntro:
      "Each collection is a card. Check what you own and see what's missing.",
    helpStartTitle: "Getting started",
    helpStartCreate:
      "Tap + to create a card. Pick Numbered collection for series with a total (manga, comics) or Loose items for a free-form list.",
    helpStartLoose:
      "The Loose items card always sits at the end of the binder, for things that don't belong to a series.",
    helpCheckTitle: "Checking items",
    helpCheckHold:
      "On the cover, tap View items to flip the card. Press and hold an item until the bar fills to check or uncheck it.",
    helpCheckProgress:
      "Progress and the missing count on the cover update on their own.",
    helpItemTitle: "Item actions",
    helpItemSwipe:
      "Swipe an item to the left to see its actions: priority (pinned to the top with a star), edit, note and delete.",
    helpItemFull:
      "A long swipe runs the first action right away. If you delete something by mistake, use Undo on the notice that appears.",
    helpOrganizeTitle: "Organizing cards",
    helpOrganizeSort:
      "Each card keeps its own sort: in order or missing first, ascending or descending.",
    helpOrganizeEdit:
      "Use the pencil on the cover to change title, total and paper color, or to delete the card.",
    helpNavTitle: "Getting around",
    helpNavMove:
      "Change cards with the arrows below the binder, by swiping the card sideways or dragging it with the mouse.",
    helpNavCommands:
      "In Commands (✨) you can filter cards by name, switch between stacked cards and continuous list, and change theme and language.",
    helpDataTitle: "Your data",
    helpDataLocal:
      "Everything is stored only in this browser. Clearing site data deletes your cards.",
    helpDataBackup:
      "Use Export data in Commands to keep a JSON backup. Import skips duplicate items.",
    helpKeysTitle: "Keyboard shortcuts",
    keyNewCard: "New card",
    keySpace: "Space",
    keyChangeCard: "Change card",
    keyToggleItem: "Check focused item",
    keyItemActions: "Open item actions",
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
    sortBy: "Sort",
    sortCriterion: "Criterion",
    sortDirection: "Direction",
    ascending: "Ascending",
    descending: "Descending",
    oldestFirst: "old → new",
    newestFirst: "new → old",
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
