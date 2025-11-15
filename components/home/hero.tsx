"use client";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/motion/fade-in";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <FadeIn>
        <div className="relative container text-center space-y-8 max-w-5xl mx-auto">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
            <Sparkles className="h-4 w-4" />
            Custom AI Platforms Built by AIAS Consultancy
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Custom AI Platforms
            <br />
            <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              That Transform Your Business
            </span>
          </h1>
          
          {/* Subhead */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We don't sell software. We architect, build, and deploy custom AI solutions — 
            from TikTok analytics platforms to e-commerce automation ecosystems.
          </p>
          
          {/* Proof points */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Built TokPulse & Hardonia Suite
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Custom AI Agents & Workflows
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              From Strategy to Deployment
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" className="text-base px-8" asChild>
              <Link href="/demo">
                Schedule Strategy Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8" asChild>
              <Link href="/tasks">
                See Our Builds
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="text-base px-8" asChild>
              <Link href="/pricing">
                Try AIAS Platform
              </Link>
            </Button>
          </div>
          
          {/* Trust signals */}
          <div className="pt-8 text-sm text-muted-foreground">
            <p className="mb-2">
              Trusted by e-commerce brands, agencies, and enterprises worldwide
            </p>
            <p>
              🇨🇦 Built in Canada • 🌍 Serving Global Clients • 🔒 Enterprise Security
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
