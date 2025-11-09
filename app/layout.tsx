import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { PWARegistration } from "@/components/pwa-registration";
import { PerformanceHUD } from "@/components/dev/performance-hud";
import { PerformanceBeacon } from "@/components/performance-beacon";
import AgentProvider from "@/components/agent/AgentProvider";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Systems Thinking + AI: The Critical Skill for the AI Age | AIAS Platform",
  description: "Systems thinking is THE skill needed more than ever in the AI age. It's what makes you stand out in the job market, succeed in business, and achieve optimal outcomes. Combined with AI automation.",
  keywords: ["systems thinking", "AI age skills", "job market advantage", "business success", "systems thinking training", "critical thinking skills", "AI automation", "holistic problem solving", "root cause analysis", "multi-perspective thinking", "career differentiation", "systems thinking methodology", "genai content engine", "automated website creation", "ai blog analysis", "website automation", "genai website generator"],
  authors: [{ name: "AIAS Platform Team" }],
  creator: "AIAS Platform",
  publisher: "AIAS Platform",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  manifest: "/manifest.webmanifest",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://aias-platform.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AIAS Platform — AI Automation for Global Businesses | Canadian-Built",
    description: "Save 10+ hours/week with no-code AI agents. Built in Canada, trusted by businesses worldwide. Multi-currency, 100+ integrations, enterprise security.",
    type: "website",
    url: "https://aias-platform.com",
    siteName: "AIAS Platform",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AIAS Platform — AI Automation for Canadian Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIAS Platform — AI Automation for Canadian Businesses",
    description: "Save 10+ hours/week with no-code AI agents. CAD $49/month. Made in Canada.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* [META:BEGIN:pwa] */}
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{__html:`if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}`}} />
        {/* [META:END:pwa] */}
        <OrganizationSchema />
        <WebSiteSchema />
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
          <PerformanceBeacon />
          {/* Agent Suggestions: show drawer site-wide when enabled */}
          <AgentProvider />
          {/* [META:BEGIN:mounts] */}
          {/* Example mounts — wire auth user ID + app meta in your layout or provider */}
          {/* <meta name="x-app-id" content={process.env.NEXT_PUBLIC_APP_ID || 'generic'} /> */}
          {/* <ConsentPanel /> */}
          {/* <RecoDrawer userId="{AUTH_USER_ID}" /> */}
          {/* [META:END:mounts] */}
        </ThemeProvider>
      </body>
    </html>
  );
}
