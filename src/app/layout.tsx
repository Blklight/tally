import { GeistPixelCircle, GeistPixelSquare } from "geist/font/pixel";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { PwaRegister } from "@/components/pwa-register";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";
import { LayoutBase } from "@/components/layout-base";
import { LocaleProvider } from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tally — seu fichário de coleções",
  description: "Organize séries, coleções e itens avulsos em fichas de papel.",
  icons: { icon: "/favicon.png", apple: "/icon-512.png" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Tally — seu fichário de coleções",
    description:
      "Organize mangás, livros, revistas e avulsos em um fichário pessoal.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        inter.variable,
        "font-mono",
        jetBrainsMono.variable,
        GeistPixelSquare.variable,
        GeistPixelCircle.variable,
      )}
    >
      <body>
        <PwaRegister />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark", "book"]}
        >
          <LocaleProvider>
            <QueryProvider>
              <TooltipProvider>
                <LayoutBase>{children}</LayoutBase>
              </TooltipProvider>
              <Toaster />
            </QueryProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
