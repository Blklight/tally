"use client";

import {
  ArrowDownUp,
  CircleCheck,
  Compass,
  HardDrive,
  Keyboard,
  type LucideIcon,
  Plus,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useLocale } from "@/lib/i18n";

type HelpKey = Parameters<ReturnType<typeof useLocale>["t"]>[0];

const sections: { icon: LucideIcon; title: HelpKey; body: HelpKey[] }[] = [
  {
    icon: Plus,
    title: "helpStartTitle",
    body: ["helpStartCreate", "helpStartLoose"],
  },
  {
    icon: CircleCheck,
    title: "helpCheckTitle",
    body: ["helpCheckHold", "helpCheckProgress"],
  },
  {
    icon: Star,
    title: "helpItemTitle",
    body: ["helpItemSwipe", "helpItemFull"],
  },
  {
    icon: ArrowDownUp,
    title: "helpOrganizeTitle",
    body: ["helpOrganizeSort", "helpOrganizeEdit"],
  },
  {
    icon: Compass,
    title: "helpNavTitle",
    body: ["helpNavMove", "helpNavCommands"],
  },
  {
    icon: HardDrive,
    title: "helpDataTitle",
    body: ["helpDataLocal", "helpDataBackup"],
  },
];

export function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const shortcuts: { keys: string[]; label: HelpKey }[] = [
    { keys: ["N"], label: "keyNewCard" },
    { keys: ["←", "→"], label: "keyChangeCard" },
    { keys: [t("keySpace")], label: "keyToggleItem" },
    { keys: ["←"], label: "keyItemActions" },
  ];

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[calc(100dvh-8rem)] grid-rows-[auto_minmax(0,1fr)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("helpTitle")}</DialogTitle>
          <DialogDescription>{t("helpIntro")}</DialogDescription>
        </DialogHeader>
        <div className="-mx-6 flex min-h-0 flex-col gap-5 overflow-y-auto px-6">
          {sections.map(({ icon: Icon, title, body }) => (
            <section aria-labelledby={`help-${title}`} key={title}>
              <h3
                className="mb-1.5 flex items-center gap-2 font-medium text-foreground"
                id={`help-${title}`}
              >
                <Icon aria-hidden className="size-4 text-muted-foreground" />
                {t(title)}
              </h3>
              <div className="flex flex-col gap-1.5 pl-6 text-muted-foreground">
                {body.map((key) => (
                  <p key={key}>{t(key)}</p>
                ))}
              </div>
            </section>
          ))}
          <section aria-labelledby="help-keys" className="hidden sm:block">
            <h3
              className="mb-1.5 flex items-center gap-2 font-medium text-foreground"
              id="help-keys"
            >
              <Keyboard aria-hidden className="size-4 text-muted-foreground" />
              {t("helpKeysTitle")}
            </h3>
            <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 pl-6 text-muted-foreground">
              {shortcuts.map(({ keys, label }) => (
                <div className="contents" key={label}>
                  <dt>
                    <KbdGroup>
                      {keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </KbdGroup>
                  </dt>
                  <dd>{t(label)}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
