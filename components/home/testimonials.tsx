"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";
import { Play, Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    quote: "AIAS Consultancy didn't just integrate TikTok—they built us a complete platform that thinks and optimizes on its own. The custom AI agents they developed have transformed how we manage TikTok campaigns. This is exactly the kind of custom build that showcases their expertise.",
    author: "Marketing Director",
    role: "Leading E-Commerce Brand",
    company: "TokPulse Client",
    flag: "🇨🇦",
    rating: 5,
    hasVideo: true,
    type: "consultancy",
  },
  {
    quote: "AIAS Consultancy built us an entire automation ecosystem, not just integrations. Their custom AI agents understand our business logic and make decisions autonomously. It's like having a team of experts working 24/7. This showcases what AIAS Consultancy can build.",
    author: "Operations Manager",
    role: "Multi-Channel E-Commerce Business",
    company: "Hardonia Suite Client",
    flag: "🇨🇦",
    rating: 5,
    hasVideo: true,
    type: "consultancy",
  },
  {
    quote: "Systems thinking is what sets AIAS apart. They didn't just automate my processes — they analyzed my entire system from multiple perspectives, found root causes, and designed a holistic solution. This is THE skill needed in the AI age, and it made all the difference.",
    author: "Emma Chen",
    role: "E-commerce Store Owner",
    company: "Chen's Boutique, Toronto, Canada",
    flag: "🇨🇦",
    rating: 5,
    hasVideo: false,
    type: "platform",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Systems Thinking Makes the Difference</h2>
          <p className="text-muted-foreground text-lg">
            Systems thinking is THE critical skill for the AI age. It's what makes you stand out in the job market, 
            succeed in business, and achieve optimal outcomes. See how it's transforming businesses worldwide.
          </p>
        </div>
      </FadeIn>
      <StaggerList staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <Card className="h-full relative overflow-hidden">
                {testimonial.type === "consultancy" && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      Consultancy Build
                    </span>
                  </div>
                )}
                <CardContent className="pt-6">
                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-2xl">{testimonial.flag}</span>
                  </div>

                  {/* Video placeholder if available */}
                  {testimonial.hasVideo && (
                    <div className="mb-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 aspect-video flex items-center justify-center border border-primary/20 relative group cursor-pointer">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Play className="h-6 w-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                        Video Testimonial
                      </div>
                    </div>
                  )}

                  <p className="mb-4 text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </StaggerList>
      <div className="text-center mt-12">
        <p className="text-sm text-muted-foreground mb-2">
          <strong className="text-foreground">Systems thinking is THE skill needed more than ever in the AI age.</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          NPS: 62 • 70% 7-day retention • 20% free-to-paid conversion • Serving 40+ countries
        </p>
      </div>
    </section>
  );
}
