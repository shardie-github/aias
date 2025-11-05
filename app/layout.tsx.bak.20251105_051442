import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { PWARegistration } from "@/components/pwa-registration";
import { PerformanceHUD } from "@/components/dev/performance-hud";
import AgentProvider from "@/components/agent/AgentProvider";

export const metadata: Metadata = {
  title: "Hardonia",
  description: "Modern, fast, and accessible commerce experience.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Hardonia",
    description: "Modern, fast, and accessible commerce experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardonia",
    description: "Modern, fast, and accessible commerce experience.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // [STAKE+TRUST:BEGIN:i18n_layout]
  // TODO: Replace with dynamic locale detection when i18n is implemented
  // const locale = detectLocale(); // e.g., from cookie, header, or user preference
  // const isRTL = isRTLLocale(locale);
  const locale = "en";
  const isRTL = false;
  // [STAKE+TRUST:END:i18n_layout]

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          {/* [STAKE+TRUST:BEGIN:skip_link] */}
          {/* Skip link already exists - verified accessibility feature */}
          <a href="#main" className="skip-link">Skip to content</a>
          {/* [STAKE+TRUST:END:skip_link] */}
          <Header />
          <main id="main" className="container py-6">{children}</main>
          <Footer />
          <Toaster />
          <PWARegistration />
          <PerformanceHUD />
          {/* Agent Suggestions: show drawer site-wide when enabled */}
          <AgentProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
