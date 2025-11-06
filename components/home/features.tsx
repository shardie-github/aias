"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";

const features = [
  {
    title: "No-Code AI Agents",
    description: "Build custom AI agents with drag-and-drop interface. No coding required. Deploy in 30 minutes.",
    icon: "🤖",
  },
  {
    title: "Canadian Integrations",
    description: "20+ Canadian-first integrations: Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac. Built for Canadian businesses.",
    icon: "🇨🇦",
  },
  {
    title: "Save 10+ Hours/Week",
    description: "Automate repetitive tasks automatically. Reduce manual errors by 90%. Focus on high-value work.",
    icon: "⏱️",
  },
  {
    title: "Affordable CAD Pricing",
    description: "CAD $49/month (vs. $150+ competitors). Transparent GST/HST. Annual discounts available. Cancel anytime.",
    icon: "💰",
  },
  {
    title: "PIPEDA Compliant",
    description: "Canadian data residency. PIPEDA-compliant privacy policy. Enterprise security. Your data stays in Canada.",
    icon: "🔒",
  },
  {
    title: "50+ Pre-Built Templates",
    description: "E-commerce automation, customer support, invoice processing, lead qualification. Industry-specific templates.",
    icon: "📋",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose AIAS Platform</h2>
          <p className="text-muted-foreground text-lg">
            Built in Canada with global perspective. Trusted by businesses worldwide across industries and markets
          </p>
        </div>
      </FadeIn>
      <StaggerList>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <Card className="h-full">
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerList>
    </section>
  );
}
