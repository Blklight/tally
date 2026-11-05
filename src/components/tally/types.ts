import type { Series } from "@/lib/store";

export type Card = { id: string; series?: Series; draft?: boolean };

export const LOOSE_ID = "loose-items";
export const NEW_ID = "new-ficha";
