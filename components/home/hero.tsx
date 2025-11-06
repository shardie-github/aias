"use client";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/motion/fade-in";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <FadeIn>
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            🇨🇦 Made in Canada • PIPEDA Compliant
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            AI Automation That
            <br />
            <span className="text-primary">Speaks Canadian Business</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Save <strong className="text-foreground">10+ hours per week</strong> with no-code AI agents. 
            Connect Shopify, Wave, Stripe, and 20+ Canadian tools. <strong className="text-foreground">CAD $49/month</strong> — 
            no coding required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/pricing">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href="/demo">Book Demo</Link>
            </Button>
          </div>
          <div className="pt-6 text-sm text-muted-foreground">
            <p>✅ No credit card required • ✅ 30-minute setup • ✅ Cancel anytime</p>
            <p className="mt-2">Join <strong className="text-foreground">500+ Canadian businesses</strong> automating with AIAS</p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
