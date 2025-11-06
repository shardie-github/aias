import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features — AIAS Platform | No-Code AI Agents & Automation",
  description: "Build custom AI agents with drag-and-drop interface. 20+ Canadian integrations. 50+ templates. Save 10+ hours/week. CAD $49/month.",
};

const featureCategories = [
  {
    title: "AI Agent Builder",
    description: "Create intelligent AI agents without coding",
    features: [
      {
        name: "No-Code Visual Builder",
        description: "Drag-and-drop interface to build AI agents. No coding required. Deploy in 30 minutes.",
      },
      {
        name: "Context-Aware AI",
        description: "AI agents understand your business context and workflows. Not just rule-based automation.",
      },
      {
        name: "Pre-Built Templates",
        description: "50+ industry-specific templates: e-commerce, customer support, invoicing, lead qualification.",
      },
      {
        name: "Custom AI Agents",
        description: "Build agents tailored to your specific business needs. Train on your data.",
      },
    ],
  },
  {
    title: "Canadian Integrations",
    description: "20+ Canadian-first integrations built for your business",
    features: [
      {
        name: "E-Commerce Platforms",
        description: "Shopify, WooCommerce, BigCommerce. Automate order processing, inventory, customer support.",
      },
      {
        name: "Accounting & Finance",
        description: "Wave Accounting, QuickBooks, Stripe CAD. Automate invoicing, payments, bookkeeping.",
      },
      {
        name: "Banking & Payments",
        description: "RBC, TD, Interac, PayPal CAD. Automate payments, transfers, reconciliation.",
      },
      {
        name: "CRM & Sales",
        description: "HubSpot, Salesforce, Pipedrive. Automate lead qualification, follow-ups, pipeline management.",
      },
    ],
  },
  {
    title: "Automation & Workflows",
    description: "Automate repetitive tasks and save 10+ hours/week",
    features: [
      {
        name: "Workflow Automation",
        description: "Connect tools with visual workflows. Automate multi-step processes across platforms.",
      },
      {
        name: "Smart Scheduling",
        description: "AI-powered scheduling that understands context. Avoid double-booking, optimize time slots.",
      },
      {
        name: "Data Processing",
        description: "Automatically process invoices, emails, forms. Extract and organize data intelligently.",
      },
      {
        name: "Error Reduction",
        description: "Reduce manual errors by 90%. AI validation and error handling built-in.",
      },
    ],
  },
  {
    title: "Analytics & Insights",
    description: "Real-time analytics on your AI agents and workflows",
    features: [
      {
        name: "Performance Dashboard",
        description: "Track agent performance, automation success rates, time saved, ROI metrics.",
      },
      {
        name: "Usage Analytics",
        description: "Monitor usage patterns, identify optimization opportunities, track costs.",
      },
      {
        name: "Custom Reports",
        description: "Generate reports for stakeholders. Export data for further analysis.",
      },
      {
        name: "ROI Tracking",
        description: "See how much time and money you're saving. Calculate ROI automatically.",
      },
    ],
  },
  {
    title: "Security & Compliance",
    description: "Enterprise-grade security with Canadian compliance",
    features: [
      {
        name: "PIPEDA Compliant",
        description: "Canadian privacy law compliance. PIPEDA-compliant privacy policy and data handling.",
      },
      {
        name: "Data Residency",
        description: "Canadian data centers (primary). US fallback disclosed. Your data stays in Canada where possible.",
      },
      {
        name: "Enterprise Security",
        description: "SOC 2 Type II (planned Q2 2024). AES-256 encryption. Regular security audits.",
      },
      {
        name: "Access Controls",
        description: "Role-based access control. Audit logging. Compliance reporting.",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Everything You Need to Automate Your Business
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          No-code AI agents, Canadian integrations, and powerful automation workflows. 
          Built for Canadian businesses who want to save time without the complexity.
        </p>
      </div>

      {featureCategories.map((category) => (
        <section key={category.title} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.features.map((feature) => (
              <Card key={feature.name}>
                <CardHeader>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
        <p className="text-muted-foreground">
          Start automating your business today. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">Book Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
