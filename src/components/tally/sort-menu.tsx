"use client";

import { ArrowDown01, ArrowDown10 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/lib/i18n";
import type { SortCriterion, SortDirection, SortPreference } from "@/lib/store";

export function SortMenu({
  value,
  onChange,
  total,
}: {
  value: SortPreference;
  onChange: (sort: SortPreference) => void;
  total?: number;
}) {
  const { t } = useLocale();
  const criterionLabel =
    value.criterion === "missing" ? t("missingFirst") : t("inOrder");
  const DirectionIcon = value.direction === "desc" ? ArrowDown10 : ArrowDown01;
  const ascendingHint = total === undefined ? t("oldestFirst") : `1 → ${total}`;
  const descendingHint =
    total === undefined ? t("newestFirst") : `${total} → 1`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={`${t("sortBy")}: ${criterionLabel}, ${
              value.direction === "desc" ? t("descending") : t("ascending")
            }`}
            className="h-7 px-2 text-xs text-inherit hover:bg-current/10 hover:text-inherit data-popup-open:bg-current/10"
            size="sm"
            variant="ghost"
          />
        }
      >
        <DirectionIcon className="size-3.5" />
        {criterionLabel}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("sortCriterion")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(criterion) =>
              onChange({ ...value, criterion: criterion as SortCriterion })
            }
            value={value.criterion}
          >
            <DropdownMenuRadioItem value="order">
              {t("inOrder")}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="missing">
              {t("missingFirst")}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t("sortDirection")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(direction) =>
              onChange({ ...value, direction: direction as SortDirection })
            }
            value={value.direction}
          >
            <DropdownMenuRadioItem value="asc">
              {t("ascending")}
              <span className="ml-auto text-xs text-muted-foreground">
                {ascendingHint}
              </span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">
              {t("descending")}
              <span className="ml-auto text-xs text-muted-foreground">
                {descendingHint}
              </span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
