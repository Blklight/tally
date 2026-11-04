"use client";

import { useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: { toast: "cn-toast background-texture tally-toast" },
      }}
    />
  );
}
