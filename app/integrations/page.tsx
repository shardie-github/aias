import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrations — AIAS Platform | Canadian Business Tools",
  description: "Connect 20+ Canadian business tools: Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac. Built for Canadian businesses.",
};

const integrations = [
  {
    category: "E-Commerce",
    description: "Automate your online store operations",
    tools: [
      { name: "Shopify", description: "Order processing, inventory, customer support" },
      { name: "WooCommerce", description: "E-commerce automation for WordPress" },
      { name: "BigCommerce", description: "Store management and order fulfillment" },
    ],
  },
  {
    category: "Accounting & Finance",
    description: "Streamline your financial operations",
    tools: [
      { name: "Wave Accounting", description: "Invoicing, bookkeeping, financial reporting" },
      { name: "QuickBooks", description: "Accounting automation and reconciliation" },
      { name: "Stripe CAD", description: "Payment processing and subscription management" },
    ],
  },
  {
    category: "Banking & Payments",
    description: "Connect with Canadian banks and payment processors",
    tools: [
      { name: "RBC", description: "Banking automation and transaction monitoring" },
      { name: "TD Bank", description: "Account management and payment processing" },
      { name: "Interac", description: "Canadian payment processing" },
      { name: "PayPal CAD", description: "Payment and invoice automation" },
    ],
  },
  {
    category: "CRM & Sales",
    description: "Manage your customer relationships",
    tools: [
      { name: "HubSpot", description: "CRM automation and lead management" },
      { name: "Salesforce", description: "Sales pipeline and customer data" },
      { name: "Pipedrive", description: "Sales process automation" },
    ],
  },
  {
    category: "Communication",
    description: "Automate your communication workflows",
    tools: [
      { name: "Gmail", description: "Email automation and smart responses" },
      { name: "Slack", description: "Team communication and notifications" },
      { name: "Microsoft Teams", description: "Workplace collaboration" },
    ],
  },
  {
    category: "Productivity",
    description: "Boost productivity with automation",
    tools: [
      { name: "Google Workspace", description: "Docs, Sheets, Calendar automation" },
      { name: "Notion", description: "Knowledge base and project management" },
      { name: "Airtable", description: "Database and workflow automation" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Canadian-First Integrations
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect 20+ Canadian business tools. Built for Canadian businesses. 
          No coding required — connect in minutes.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🇨🇦 Made in Canada • 20+ Integrations
        </div>
      </div>

      {integrations.map((category) => (
        <section key={category.category} className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{category.category}</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {category.tools.map((tool) => (
              <Card key={tool.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <div className="mt-12 text-center space-y-4">
        <h2 className="text-2xl font-bold">Don't See Your Tool?</h2>
        <p className="text-muted-foreground">
          We're constantly adding new integrations. Request one or build your own with our API.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/help">Request Integration</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/api">View API Docs</Link>
          </Button>
        </div>
      </div>

      <div className="mt-12 text-center space-y-4 bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold">Ready to Connect Your Tools?</h2>
        <p className="text-muted-foreground">
          Start automating your workflows today. Connect your first integration in minutes.
        </p>
        <Button size="lg" asChild>
          <Link href="/pricing">Start Free Trial</Link>
        </Button>
      </div>
    </div>
  );
}
