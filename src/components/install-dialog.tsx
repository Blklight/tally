"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n";

export function InstallDialog({
  ios,
  open,
  onOpenChange,
}: {
  ios: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useLocale();
  const steps = ios
    ? [t("installIosStep1"), t("installIosStep2"), t("installIosStep3")]
    : [t("installOtherStep1"), t("installOtherStep2")];

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("installTitle")}</DialogTitle>
          <DialogDescription>{t("installIntro")}</DialogDescription>
        </DialogHeader>
        <ol className="grid list-decimal gap-2 pl-5 text-sm">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
