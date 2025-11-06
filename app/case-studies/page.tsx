import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — AIAS Platform | Success Stories",
  description: "See how Canadian businesses save 10+ hours/week with AIAS Platform. Real results from e-commerce, consulting, and real estate businesses.",
};

const caseStudies = [
  {
    title: "Chen's Boutique: E-Commerce Automation",
    company: "Chen's Boutique",
    industry: "E-Commerce",
    location: "Toronto, ON",
    challenge: "Manual order processing and customer support was taking 15+ hours per week.",
    solution: "Implemented AIAS Platform with Shopify integration to automate order processing, inventory updates, and customer support responses.",
    results: [
      "Saved 12 hours per week on repetitive tasks",
      "Reduced order processing time by 80%",
      "Improved customer response time from 24h to 2h",
      "ROI: CAD $2,400/month in time savings",
    ],
    quote: "AIAS saves me 12 hours per week on order processing and customer support. The Shopify integration alone is worth the CAD $49/month. Setup took 25 minutes.",
    author: "Emma Chen",
    role: "Store Owner",
  },
  {
    title: "Robertson Consulting: Client Management Automation",
    company: "Robertson Consulting",
    industry: "Consulting",
    location: "Vancouver, BC",
    challenge: "Solo consultant spending 8+ hours/week on invoice processing and client follow-ups.",
    solution: "Automated invoice processing with Wave Accounting integration and client follow-up workflows with email automation.",
    results: [
      "Saved 8 hours per week on administrative tasks",
      "Reduced invoice processing time by 90%",
      "Improved client follow-up consistency",
      "ROI: CAD $1,600/month in time savings",
    ],
    quote: "As a solo consultant, I needed automation without the complexity. AIAS's no-code builder and Canadian integrations (Wave, Stripe) made it easy. I've automated invoice processing and client follow-ups.",
    author: "Michael Robertson",
    role: "Business Consultant",
  },
  {
    title: "Dubois Realty: Lead Qualification Automation",
    company: "Dubois Realty",
    industry: "Real Estate",
    location: "Montreal, QC",
    challenge: "Real estate agent spending 10+ hours/week qualifying leads and scheduling viewings.",
    solution: "Implemented AI-powered lead qualification agent and automated scheduling system with calendar integration.",
    results: [
      "Saved 10 hours per week on lead qualification",
      "Improved lead response time by 70%",
      "Automated scheduling reduced no-shows by 40%",
      "ROI: CAD $2,000/month in time savings",
    ],
    quote: "The Canadian-first approach sold me. PIPEDA compliance, CAD pricing, and Shopify integration. I tried Zapier but it was too expensive and didn't have the Canadian tools I needed.",
    author: "Sarah Dubois",
    role: "Real Estate Agent",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Real Results from Canadian Businesses
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how Canadian businesses save 10+ hours/week with AIAS Platform. 
          Real case studies from e-commerce, consulting, and real estate.
        </p>
      </div>

      <div className="space-y-12 max-w-4xl mx-auto">
        {caseStudies.map((study) => (
          <Card key={study.title} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{study.title}</CardTitle>
                  <CardDescription className="text-base">
                    {study.company} • {study.industry} • {study.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">The Challenge</h3>
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
          Join 500+ Canadian businesses automating with AIAS Platform. Start your free trial today.
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
