"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-bg/70 border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg">
          AIAS Platform
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-4">
          <Link href="/services" className="px-3 py-2 hover:underline text-sm">
            Services
          </Link>
          <Link href="/portfolio" className="px-3 py-2 hover:underline text-sm">
            Portfolio
          </Link>
          <Link href="/tasks" className="px-3 py-2 hover:underline text-sm">
            Our Builds
          </Link>
          <Link href="/case-studies" className="px-3 py-2 hover:underline text-sm">
            Case Studies
          </Link>
          <Link href="/pricing" className="px-3 py-2 hover:underline text-sm">
            Platform Pricing
          </Link>
          <Link href="/features" className="px-3 py-2 hover:underline text-sm">
            Features
          </Link>
          <Link href="/why-canadian" className="px-3 py-2 hover:underline text-sm">
            🇨🇦 Why Canadian
          </Link>
          <Link href="/blog" className="px-3 py-2 hover:underline text-sm">
            Blog
          </Link>
          <Button size="sm" asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <ThemeToggle />
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
