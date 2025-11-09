"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import FadeIn from "@/components/motion/fade-in";

const featuredCaseStudies = [
  {
    title: "Chen's Boutique: Multi-Market E-Commerce",
    company: "Chen's Boutique",
    location: "Toronto, Canada",
    flag: "🇨🇦",
    hoursSaved: 12,
    revenueIncrease: 25,
    testimonial: "AIAS saves me 12 hours per week on order processing and customer support.",
    author: "Emma Chen",
    role: "Store Owner",
  },
  {
    title: "Global Education Partners: International Programs",
    company: "Global Education Partners",
    location: "London, UK",
    flag: "🇬🇧",
    hoursSaved: 18,
    revenueIncrease: 30,
    testimonial: "The platform's understanding of education workflows is unmatched.",
    author: "Dr. Michael Rodriguez",
    role: "International Education Consultant",
  },
];

export function CaseStudyPreview() {
  return (
    <section className="py-20 bg-muted/30">
      <FadeIn>
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Results from Businesses Worldwide
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how businesses save 10+ hours/week with AIAS Platform. 
              Real case studies from e-commerce, education, and global enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {featuredCaseStudies.map((study) => (
              <Card key={study.title} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1">{study.title}</CardTitle>
                      <CardDescription>
                        {study.company} • {study.location} {study.flag}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-2xl font-bold">{study.hoursSaved}</div>
                        <div className="text-xs text-muted-foreground">Hours/Week Saved</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold text-green-600">+{study.revenueIncrease}%</div>
                        <div className="text-xs text-muted-foreground">Revenue Increase</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm italic mb-2">"{study.testimonial}"</p>
                    <p className="text-xs text-muted-foreground">— {study.author}, {study.role}</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/case-studies">
                      Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/case-studies">
                View All Case Studies <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
