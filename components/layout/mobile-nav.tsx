"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="/services" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Services
          </Link>
          <Link href="/portfolio" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Portfolio
          </Link>
          <Link href="/tasks" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Our Builds
          </Link>
          <Link href="/case-studies" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Case Studies
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Platform Pricing
          </Link>
          <Link href="/features" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Features
          </Link>
          <Link href="/systems-thinking" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline text-primary">
            Systems Thinking
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Blog
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            About
          </Link>
          <Link href="/demo" onClick={() => setOpen(false)} className="text-lg font-medium hover:underline">
            Demo
          </Link>
          <div className="pt-4 border-t">
            <Button className="w-full" asChild>
              <Link href="/pricing" onClick={() => setOpen(false)}>
                Start Free
              </Link>
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
