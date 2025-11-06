import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrations — AIAS Platform | 100+ Global Business Tools & Platforms",
  description: "Connect 100+ business tools worldwide: Shopify, Stripe, PayPal, Google Workspace, Salesforce, HubSpot, QuickBooks, and more. Support for Canadian, US, EU, and APAC markets.",
};

const integrations = [
  {
    category: "E-Commerce",
    description: "Automate your online store operations globally",
    tools: [
      { name: "Shopify", description: "Order processing, inventory, customer support (Global)" },
      { name: "WooCommerce", description: "E-commerce automation for WordPress (Global)" },
      { name: "BigCommerce", description: "Store management and order fulfillment (Global)" },
      { name: "Magento", description: "Enterprise e-commerce automation" },
      { name: "Amazon", description: "Marketplace automation and fulfillment" },
    ],
  },
  {
    category: "Accounting & Finance",
    description: "Streamline your financial operations worldwide",
    tools: [
      { name: "QuickBooks", description: "Accounting automation (US, CA, UK, AU)" },
      { name: "Xero", description: "Cloud accounting (Global)" },
      { name: "Wave Accounting", description: "Invoicing, bookkeeping (CA, US)" },
      { name: "Sage", description: "Accounting software (Global)" },
      { name: "FreshBooks", description: "Cloud-based accounting (Global)" },
    ],
  },
  {
    category: "Payment Processing",
    description: "Global payment processors and banking",
    tools: [
      { name: "Stripe", description: "Payment processing (Global, multi-currency)" },
      { name: "PayPal", description: "Payment and invoice automation (Global)" },
      { name: "Square", description: "Payment processing (US, CA, UK, AU, JP)" },
      { name: "Adyen", description: "Enterprise payments (Global)" },
      { name: "RBC / TD Bank", description: "Canadian banking automation" },
      { name: "Wise (formerly TransferWise)", description: "International money transfers" },
    ],
  },
  {
    category: "CRM & Sales",
    description: "Manage your customer relationships globally",
    tools: [
      { name: "Salesforce", description: "Sales pipeline and customer data (Global)" },
      { name: "HubSpot", description: "CRM automation and lead management (Global)" },
      { name: "Pipedrive", description: "Sales process automation (Global)" },
      { name: "Zoho CRM", description: "CRM platform (Global)" },
      { name: "Microsoft Dynamics", description: "Enterprise CRM (Global)" },
    ],
  },
  {
    category: "Communication",
    description: "Automate your communication workflows worldwide",
    tools: [
      { name: "Gmail / Google Workspace", description: "Email automation (Global)" },
      { name: "Microsoft Outlook / 365", description: "Email and calendar (Global)" },
      { name: "Slack", description: "Team communication (Global)" },
      { name: "Microsoft Teams", description: "Workplace collaboration (Global)" },
      { name: "Zoom", description: "Video conferencing automation (Global)" },
      { name: "WhatsApp Business", description: "Messaging automation (Global)" },
    ],
  },
  {
    category: "Productivity & Education",
    description: "Boost productivity and support education workflows",
    tools: [
      { name: "Google Workspace", description: "Docs, Sheets, Calendar (Global)" },
      { name: "Microsoft 365", description: "Office productivity suite (Global)" },
      { name: "Notion", description: "Knowledge base and project management (Global)" },
      { name: "Airtable", description: "Database and workflow automation (Global)" },
      { name: "Asana", description: "Project management (Global)" },
      { name: "Trello", description: "Task management (Global)" },
      { name: "Moodle / Canvas", description: "Learning management systems (Global)" },
      { name: "Google Classroom", description: "Education platform automation" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Global Integrations for Every Market
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect 100+ business tools worldwide. Built in Canada, designed for global markets. 
          Support for North America, Europe, Asia-Pacific, and beyond. No coding required — connect in minutes.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🇨🇦 Built in Canada • 🌍 100+ Global Integrations
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
