import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — AIAS Platform | Global Success Stories",
  description: "See how businesses worldwide save 10+ hours/week with AIAS Platform. Real results from e-commerce, education, consulting, and global enterprises across multiple markets.",
};

const caseStudies = [
  {
    title: "Global Education Partners: International Program Management",
    company: "Global Education Partners",
    industry: "Education",
    location: "London, UK",
    flag: "🇬🇧",
    challenge: "Managing educational programs across 15 countries with different currencies, languages, and regulatory requirements. Manual stakeholder communication and administrative tasks consumed 20+ hours per week.",
    solution: "Implemented AIAS Platform with multi-currency support, Google Workspace automation, and custom AI agents for stakeholder communication across different time zones and markets.",
    results: [
      "Saved 18 hours per week on administrative tasks",
      "Automated stakeholder communications across 15 countries",
      "Reduced currency conversion errors by 95%",
      "Improved response time across time zones",
      "ROI: $3,600/month in time savings",
    ],
    quote: "As an education consultant working with stakeholders across 15 countries, I needed a platform that understands global markets. AIAS's multi-currency support and international integrations made it easy to automate workflows across different regions. The platform's understanding of education workflows is unmatched.",
    author: "Dr. Michael Rodriguez",
    role: "International Education Consultant",
  },
  {
    title: "Chen's Boutique: Multi-Market E-Commerce Automation",
    company: "Chen's Boutique",
    industry: "E-Commerce",
    location: "Toronto, Canada",
    flag: "🇨🇦",
    challenge: "Manual order processing and customer support was taking 15+ hours per week. Expanding to US and EU markets required handling multiple currencies and payment processors.",
    solution: "Implemented AIAS Platform with Shopify integration, multi-currency Stripe automation, and AI-powered customer support agents that handle inquiries in multiple languages.",
    results: [
      "Saved 12 hours per week on repetitive tasks",
      "Reduced order processing time by 80%",
      "Improved customer response time from 24h to 2h",
      "Seamlessly expanded to US and EU markets",
      "ROI: $2,400/month in time savings",
    ],
    quote: "AIAS saves me 12 hours per week on order processing and customer support. The global integrations and multi-currency support make it perfect for our international e-commerce business. Setup took 25 minutes, and we expanded to new markets without any additional complexity.",
    author: "Emma Chen",
    role: "Store Owner",
  },
  {
    title: "Tech Solutions Inc.: Global Operations Automation",
    company: "Tech Solutions Inc.",
    industry: "Technology",
    location: "Singapore",
    flag: "🇸🇬",
    challenge: "Tech company serving clients in North America, Europe, and APAC needed to automate operations across different time zones, currencies, and compliance requirements (GDPR, PIPEDA).",
    solution: "Deployed AIAS Platform with enterprise security features, regional data residency options, and automated workflows for CRM, invoicing, and client communication across all markets.",
    results: [
      "Saved 15 hours per week on cross-regional operations",
      "Automated compliance reporting (GDPR, PIPEDA)",
      "Reduced currency conversion errors by 90%",
      "Improved client response time across time zones",
      "ROI: $3,000/month in time savings",
    ],
    quote: "The enterprise security and global compliance (GDPR, PIPEDA) are crucial for our organization. We serve clients in North America, Europe, and APAC, and AIAS handles all our automation needs seamlessly. The platform's understanding of global business operations is exactly what we needed.",
    author: "Sarah Watanabe",
    role: "Operations Director",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Real Results from Businesses Worldwide
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how businesses across North America, Europe, and Asia-Pacific save 10+ hours/week with AIAS Platform. 
          Real case studies from e-commerce, education, consulting, and global enterprises.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🇨🇦 Built in Canada • 🌍 Serving the World
        </div>
      </div>

      <div className="space-y-12 max-w-4xl mx-auto">
        {caseStudies.map((study) => (
          <Card key={study.title} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{study.title}</CardTitle>
                  <CardDescription className="text-base flex items-center gap-2">
                    {study.company} • {study.industry} • {study.location} {study.flag}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">The Challenge</h3>
                    <span className="text-2xl">{study.flag}</span>
                  </div>
                  <p className="text-muted-foreground">{study.challenge}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">The Solution</h3>
                  <p className="text-muted-foreground">{study.solution}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">The Results</h3>
                  <ul className="space-y-2">
                    {study.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-muted-foreground">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t pt-6">
                  <blockquote className="text-lg italic text-muted-foreground mb-4">
                    &ldquo;{study.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="font-semibold">{study.author}</p>
                    <p className="text-sm text-muted-foreground">{study.role}, {study.company}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center space-y-4 bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold">Ready to Get Similar Results?</h2>
        <p className="text-muted-foreground">
          Join 2,000+ businesses worldwide automating with AIAS Platform. Start your free trial today—no matter where you are.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/pricing">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">Book Demo</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Serving clients across North America, Europe, Asia-Pacific, and beyond
        </p>
      </div>
    </div>
  );
}
