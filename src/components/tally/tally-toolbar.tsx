"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const navClassName =
  "chamfer chamfer-sm h-11 w-20 rounded-none border-0 bg-[#252525] p-0 text-[#eaeaea] shadow-none hover:bg-[#252525]/85 hover:text-[#eaeaea] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:not-aria-[haspopup]:translate-y-0 dark:bg-[#eaeaea] dark:text-[#252525] dark:hover:bg-[#eaeaea]/85 dark:hover:text-[#252525]";

export function TallyToolbar({
  canNavigate,
  onPrevious,
  onNext,
}: {
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const { t } = useLocale();

  if (!canNavigate) return null;

  return (
    <div className="relative z-30 flex shrink-0 justify-center gap-3 px-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <Button
        aria-label={t("previousCard")}
        data-card-nav=""
        className={cn(navClassName, "chamfer-bl")}
        onClick={onPrevious}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft className="size-6" />
      </Button>
      <Button
        aria-label={t("nextCard")}
        data-card-nav=""
        className={cn(navClassName, "chamfer-br")}
        onClick={onNext}
        size="icon"
        variant="ghost"
      >
        <ChevronRight className="size-6" />
      </Button>
    </div>
  );
}
