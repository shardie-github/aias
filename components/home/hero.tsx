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
            🇨🇦 Built in Canada • 🤖 AI-Powered Automation • 🌍 Trusted Worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Save 10+ Hours/Week with
            <br />
            <span className="text-primary">AI Automation</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Automate repetitive tasks, reduce manual errors by 90%, and focus on high-value work. 
            <strong className="text-foreground"> CAD $49/month</strong> — transparent pricing, no hidden fees. 
            Built in Canada with <strong className="text-foreground">100+ integrations</strong> for global businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-base" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base" asChild>
              <Link href="/demo">Book Demo</Link>
            </Button>
          </div>
          <div className="pt-6 text-sm text-muted-foreground">
            <p className="mb-2">
              ✅ <strong className="text-foreground">No credit card required</strong> • ✅ 14-day free trial • ✅ Cancel anytime
            </p>
            <p className="mb-2">
              ✅ <strong className="text-foreground">30-minute setup</strong> • ✅ 100+ integrations • ✅ PIPEDA compliant
            </p>
            <p className="mt-4">
              Join <strong className="text-foreground">2,000+ businesses worldwide</strong> saving time with AI automation
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
