import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Shield, Lock, Globe, DollarSign, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Why Canadian — AIAS Platform | Built in Canada, Trusted Worldwide",
  description: "Why choose a Canadian-built AI automation platform? PIPEDA compliance, Canadian data residency, transparent pricing, and Canadian business values.",
};

const benefits = [
  {
    icon: Shield,
    title: "PIPEDA Compliant",
    description: "Full compliance with Canada's Personal Information Protection and Electronic Documents Act. Your data is protected by Canadian privacy laws.",
  },
  {
    icon: Lock,
    title: "Canadian Data Residency",
    description: "Your data stays in Canada. Choose Canadian data centers for complete control and compliance with Canadian regulations.",
  },
  {
    icon: DollarSign,
    title: "Transparent CAD Pricing",
    description: "No hidden fees. Clear CAD pricing with GST/HST transparency. Affordable rates starting at CAD $49/month.",
  },
  {
    icon: Globe,
    title: "Canadian Integrations",
    description: "20+ Canadian-first integrations: Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac. Built for Canadian businesses.",
  },
  {
    icon: Users,
    title: "Canadian Business Values",
    description: "Built by Canadians, for Canadians. We understand Canadian business culture, regulations, and market needs.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified (in progress). Enterprise-grade security with Canadian data protection standards.",
  },
];

export default function WhyCanadianPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          🇨🇦 Built in Canada • 🌍 Trusted Worldwide
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Why Choose a Canadian-Built Platform?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built in Canada with Canadian values: transparency, privacy, and trust. 
          PIPEDA compliant, Canadian data residency, and designed for Canadian businesses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Card key={benefit.title}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle>{benefit.title}</CardTitle>
                </div>
                <CardDescription>{benefit.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>PIPEDA Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              The Personal Information Protection and Electronic Documents Act (PIPEDA) is Canada's federal privacy law. 
              AIAS Platform is fully PIPEDA compliant, ensuring your data is protected according to Canadian standards.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Consent-based data collection</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Purpose limitation and data minimization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Right to access and correct personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Data breach notification requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Accountability and transparency</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canadian Data Residency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your data stays in Canada. We offer Canadian data center options to ensure your data never leaves Canadian borders, 
              providing additional compliance and peace of mind for Canadian businesses.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Canadian data centers available</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>No cross-border data transfer required</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Compliance with Canadian regulations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Reduced latency for Canadian users</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Canadian Business Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Built by Canadians, for Canadians. We understand Canadian business culture, regulations, and market needs. 
              Our platform reflects Canadian values: transparency, fairness, and respect for privacy.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Transparent pricing with no hidden fees</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>GST/HST transparency</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Canadian customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Understanding of Canadian business needs</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">
          Join 2,000+ businesses worldwide trusting AIAS Platform for their automation needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">Book Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
