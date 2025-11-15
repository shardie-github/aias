import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Case Studies — AIAS Consultancy | Custom Builds & Platform Success Stories",
  description: "See custom AI platforms and automation systems built by AIAS Consultancy. Case studies include TokPulse TikTok analytics and Hardonia Suite ecosystems, plus client success stories.",
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

const consultancyBuilds = [
  {
    title: "TokPulse — TikTok Analytics Platform",
    company: "Built by AIAS Consultancy",
    industry: "Custom AI Platform Build",
    location: "Canada",
    flag: "🇨🇦",
    challenge: "TikTok advertising requires constant monitoring, optimization, and creative testing. Manual management is time-consuming and inefficient for e-commerce brands and agencies.",
    solution: "AIAS Consultancy designed and built TokPulse as a complete TikTok analytics platform with custom AI agents that automate campaign optimization, creative testing, and performance analysis. This isn't a backend integration—it's a full platform we built from the ground up.",
    results: [
      "Automated campaign optimization reduces manual work by 80%",
      "AI-powered trend detection identifies opportunities 3x faster",
      "Creative optimization improves ad performance by 40%",
      "Real-time analytics enable instant decision-making",
      "Custom workflows adapt to each brand's unique needs",
      "Complete platform with custom AI agents, not just integrations",
    ],
    quote: "AIAS Consultancy didn't just integrate TikTok—they built us a complete platform that thinks and optimizes on its own. The custom AI agents they developed have transformed how we manage TikTok campaigns. This is exactly the kind of custom build that showcases their expertise.",
    author: "Marketing Director",
    role: "Leading E-Commerce Brand",
    isConsultancyBuild: true,
  },
  {
    title: "Hardonia Suite Ecosystems — E-Commerce Automation",
    company: "Built by AIAS Consultancy",
    industry: "Custom E-Commerce Platform Build",
    location: "Canada",
    flag: "🇨🇦",
    challenge: "E-commerce operations require coordination across multiple channels, inventory systems, and customer touchpoints. Manual processes don't scale, and generic solutions don't fit unique business needs.",
    solution: "AIAS Consultancy architected and built the Hardonia Suite as a comprehensive e-commerce automation ecosystem. Custom AI agents handle order processing, inventory sync, customer support, and multi-channel coordination. This is a complete platform build showcasing our consultancy capabilities.",
    results: [
      "Automated order processing saves 15+ hours per week",
      "Multi-channel inventory sync eliminates overselling",
      "AI customer support agents handle 70% of inquiries",
      "Custom workflows adapt to business-specific needs",
      "Scalable architecture supports growth from startup to enterprise",
      "Complete ecosystem built by AIAS Consultancy, not integrated",
    ],
    quote: "AIAS Consultancy built us an entire automation ecosystem, not just integrations. Their custom AI agents understand our business logic and make decisions autonomously. It's like having a team of experts working 24/7. This showcases what AIAS Consultancy can build.",
    author: "Operations Manager",
    role: "Multi-Channel E-Commerce Business",
    isConsultancyBuild: true,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Rocket className="h-4 w-4" />
          AIAS Consultancy — Custom Builds & Client Success
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Case Studies: Our Builds & Client Success
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AIAS Consultancy builds custom AI platforms, workflow automation systems, and intelligent agents. 
          See platforms we've built (like TokPulse and Hardonia Suite) and how our clients use AIAS Platform to save 10+ hours/week.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          🇨🇦 Built in Canada • 🌍 Serving the World
        </div>
      </div>

      {/* Consultancy Builds Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Platforms Built by AIAS Consultancy</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These aren't backend integrations—they're complete platforms we've built from the ground up. 
            Showcasing our expertise in custom AI agent development, workflow automation, and intelligent platform architecture.
          </p>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto mb-16">
          {consultancyBuilds.map((build) => (
            <Card key={build.title} className="overflow-hidden border-2 border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{build.title}</CardTitle>
                    <CardDescription className="text-base flex items-center gap-2">
                      {build.company} • {build.industry} • {build.location} {build.flag}
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary">Consultancy Build</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Visual placeholder for platform screenshot/demo */}
                <div className="mb-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8 border border-primary/20">
                  <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <div className="text-sm text-muted-foreground font-medium">
                        Platform Dashboard Preview
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Interactive demo available on request
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">The Challenge</h3>
                      <span className="text-2xl">{build.flag}</span>
                    </div>
                    <p className="text-muted-foreground">{build.challenge}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Our Solution</h3>
                    <p className="text-muted-foreground">{build.solution}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Results Delivered</h3>
                    <ul className="space-y-2">
                      {build.results.map((result, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-muted-foreground">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t pt-6">
                    <blockquote className="text-lg italic text-muted-foreground mb-4">
                      &ldquo;{build.quote}&rdquo;
                    </blockquote>
                    <div>
                      <p className="font-semibold">{build.author}</p>
                      <p className="text-sm text-muted-foreground">{build.role}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Client Success Stories Section */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Client Success Stories</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how businesses worldwide save 10+ hours/week using AIAS Platform. 
            Real results from e-commerce, education, consulting, and global enterprises.
          </p>
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
        <h2 className="text-2xl font-bold">Ready to Work with AIAS Consultancy?</h2>
        <p className="text-muted-foreground">
          Need a custom AI platform built? Or want to automate your business with AIAS Platform? 
          Let's discuss your project and see how we can help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">Book Consultation</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/tasks">View Upcoming Builds</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">Start Free Trial</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          AIAS Consultancy: Custom builds • AIAS Platform: Business automation • Serving clients worldwide
        </p>
      </div>
    </div>
  );
}
