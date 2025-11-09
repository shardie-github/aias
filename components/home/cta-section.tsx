"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FadeIn from "@/components/motion/fade-in";
import { Check } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 bg-primary/5">
      <FadeIn>
        <div className="container max-w-4xl mx-auto">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="text-5xl mb-4">🚀</div>
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Start Saving 10+ Hours/Week Today
              </CardTitle>
              <CardDescription className="text-lg">
                Join 2,000+ businesses worldwide automating with AIAS Platform. 
                No credit card required. 14-day free trial. Cancel anytime.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">30-Minute Setup</div>
                    <p className="text-sm text-muted-foreground">Get started in minutes, not days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">100+ Integrations</div>
                    <p className="text-sm text-muted-foreground">Connect your existing tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold mb-1">PIPEDA Compliant</div>
                    <p className="text-sm text-muted-foreground">Enterprise security & privacy</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong className="text-foreground">CAD $49/month</strong> — Transparent pricing, no hidden fees. 
                  Save 10+ hours/week, reduce errors by 90%, focus on high-value work.
                </p>
                <p className="text-sm text-muted-foreground">
                  🇨🇦 Built in Canada • 🌍 Trusted Worldwide • 🔒 Enterprise Security
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base" asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base" asChild>
                  <Link href="/demo">Book Demo</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </section>
  );
}
