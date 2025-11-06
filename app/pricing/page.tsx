import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — AIAS Platform | Starting at $49/month | Multi-Currency Support",
  description: "Affordable AI automation for businesses worldwide. Free plan available. Starting at $49/month (CAD/USD/EUR). Multi-currency support. Cancel anytime.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "Perfect for trying AIAS Platform",
    features: [
      "3 AI agents",
      "100 automations/month",
      "Basic templates",
      "Email support",
      "Community access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$49",
    period: "month",
    description: "For solo operators and small businesses",
    features: [
      "10 AI agents",
      "Unlimited automations",
      "50+ templates",
      "Canadian integrations (20+)",
      "Email support (24-48h)",
      "Analytics dashboard",
      "Cancel anytime",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Pro",
    price: "$149",
    period: "month",
    description: "For small teams (2-10 employees)",
    features: [
      "50 AI agents",
      "Unlimited automations",
      "All templates",
      "Advanced integrations",
      "Priority support (24h)",
      "Advanced analytics",
      "Team collaboration",
      "API access",
      "White-label options",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Multi-currency support: CAD, USD, EUR, GBP, and more. Prices shown in your local currency. Transparent pricing. Cancel anytime.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🇨🇦 Built in Canada • 🌍 Global Pricing • Multi-Currency Support
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
                <p className="text-xs text-muted-foreground mt-1">Multi-currency available</p>
              </div>
              {plan.name === "Starter" && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground line-through">$490/year</span>
                  <span className="text-sm font-medium text-primary ml-2">
                    $490/year (save $98) • Save 20%
                  </span>
                </div>
              )}
              {plan.name === "Pro" && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground line-through">$1,490/year</span>
                  <span className="text-sm font-medium text-primary ml-2">
                    $1,490/year (save $298) • Save 20%
                  </span>
                </div>
              )}
              <CardDescription className="mt-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                size="lg"
                asChild
              >
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What currencies and payment methods do you accept?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We accept all major credit cards (Visa, Mastercard, American Express) and process payments through Stripe. 
              Multi-currency support: CAD, USD, EUR, GBP, AUD, and more. Prices are displayed in your local currency. 
              Taxes (GST/HST, VAT, etc.) are calculated automatically based on your location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Can I cancel anytime?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Yes! Cancel anytime with no questions asked. You'll continue to have access until the end of your billing period.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Do you offer annual discounts?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Yes! Save 20% when you pay annually. Starter plan: CAD $490/year (save $98). Pro plan: CAD $1,490/year (save $298).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Is there a free trial?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Yes! Start with our free plan (3 agents, 100 automations/month) or get a 14-day free trial of any paid plan. 
              No credit card required.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Canadian integrations do you support?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We support 20+ Canadian integrations including Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac, 
              and more. See our <Link href="/integrations" className="text-primary hover:underline">integrations page</Link> for the full list.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Need a custom plan for your team?
        </p>
        <Button variant="outline" asChild>
          <Link href="/demo">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
}
