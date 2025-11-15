"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Clock, Rocket, TrendingUp } from "lucide-react";
import FadeIn from "@/components/motion/fade-in";

const featuredCaseStudies = [
  {
    title: "TokPulse — TikTok Analytics Platform",
    company: "Built by AIAS Consultancy",
    location: "Canada",
    flag: "🇨🇦",
    type: "consultancy",
    hoursSaved: null,
    revenueIncrease: 40,
    testimonial: "AIAS Consultancy built us a complete platform that thinks and optimizes on its own. The custom AI agents have transformed how we manage TikTok campaigns.",
    author: "Marketing Director",
    role: "E-Commerce Brand",
  },
  {
    title: "Hardonia Suite — E-Commerce Automation",
    company: "Built by AIAS Consultancy",
    location: "Canada",
    flag: "🇨🇦",
    type: "consultancy",
    hoursSaved: 15,
    revenueIncrease: null,
    testimonial: "AIAS Consultancy built us an entire automation ecosystem. Their custom AI agents understand our business logic and make decisions autonomously.",
    author: "Operations Manager",
    role: "E-Commerce Business",
  },
  {
    title: "Chen's Boutique: Multi-Market E-Commerce",
    company: "Chen's Boutique",
    location: "Toronto, Canada",
    flag: "🇨🇦",
    type: "client",
    hoursSaved: 12,
    revenueIncrease: 25,
    testimonial: "AIAS saves me 12 hours per week on order processing and customer support.",
    author: "Emma Chen",
    role: "Store Owner",
  },
];

export function CaseStudyPreview() {
  return (
    <section className="py-20 bg-muted/30">
      <FadeIn>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Rocket className="h-4 w-4" />
              Platforms Built by AIAS Consultancy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Custom AI Platforms We've Built
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These aren't integrations — they're complete platforms we architected and built. 
              See TokPulse (TikTok analytics) and Hardonia Suite (e-commerce automation), plus client success stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredCaseStudies.map((study) => (
              <Card key={study.title} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{study.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        {study.company} • {study.location} {study.flag}
                      </CardDescription>
                    </div>
                    {study.type === "consultancy" && (
                      <Badge variant="default" className="ml-2">Consultancy Build</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {study.hoursSaved && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-2xl font-bold">{study.hoursSaved}</div>
                          <div className="text-xs text-muted-foreground">Hours/Week Saved</div>
                        </div>
                      </div>
                    )}
                    {study.revenueIncrease && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="text-2xl font-bold text-green-600">+{study.revenueIncrease}%</div>
                          <div className="text-xs text-muted-foreground">
                            {study.type === "consultancy" ? "Performance Gain" : "Revenue Increase"}
                          </div>
                        </div>
                      </div>
                    )}
                    {!study.hoursSaved && !study.revenueIncrease && (
                      <div className="col-span-2 flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-lg font-bold">Custom Platform</div>
                          <div className="text-xs text-muted-foreground">Built by AIAS Consultancy</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm italic mb-2">"{study.testimonial}"</p>
                    <p className="text-xs text-muted-foreground">— {study.author}, {study.role}</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={study.type === "consultancy" ? "/tasks" : "/case-studies"}>
                      {study.type === "consultancy" ? "View Build Details" : "Read Full Case Study"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/case-studies">
                  View All Case Studies <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tasks">
                  See Upcoming Builds <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              AIAS Consultancy: Custom builds • AIAS Platform: Business automation
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
