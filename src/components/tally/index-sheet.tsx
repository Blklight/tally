"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Card } from "./types";

export function IndexSheet({
  open,
  onOpenChange,
  cards,
  query,
  onQueryChange,
  onJump,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: Card[];
  query: string;
  onQueryChange: (query: string) => void;
  onJump: (id: string) => void;
}) {
  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent
        className="sheet-surface flex w-80 flex-col px-5"
        side="left"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Índice</SheetTitle>
        </SheetHeader>
        <Input
          aria-label="Pular para ficha"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Pular para..."
          value={query}
        />
        <div className="flex-1 overflow-y-auto">
          {cards.map((card) => (
            <Button
              className="h-auto w-full justify-between rounded-none border-b py-4 text-left whitespace-normal"
              key={card.id}
              onClick={() => onJump(card.id)}
              variant="ghost"
            >
              <span className="min-w-0 break-words">
                {card.series?.title ?? (card.draft ? "Nova ficha" : "Avulsos")}
              </span>
              <ArrowUpRight className="shrink-0" />
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
