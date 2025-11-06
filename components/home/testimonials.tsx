"use client";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";

const testimonials = [
  {
    quote: "AIAS saves me 12 hours per week on order processing and customer support. The Shopify integration alone is worth the CAD $49/month. Setup took 25 minutes.",
    author: "Emma Chen",
    role: "E-commerce Store Owner, Toronto",
    company: "Chen's Boutique",
  },
  {
    quote: "As a solo consultant, I needed automation without the complexity. AIAS's no-code builder and Canadian integrations (Wave, Stripe) made it easy. I've automated invoice processing and client follow-ups.",
    author: "Michael Robertson",
    role: "Business Consultant, Vancouver",
    company: "Robertson Consulting",
  },
  {
    quote: "The Canadian-first approach sold me. PIPEDA compliance, CAD pricing, and Shopify integration. I tried Zapier but it was too expensive and didn't have the Canadian tools I needed.",
    author: "Sarah Dubois",
    role: "Real Estate Agent, Montreal",
    company: "Dubois Realty",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Canadian Businesses</h2>
          <p className="text-muted-foreground text-lg">
            Join 500+ Canadian businesses automating with AIAS Platform
          </p>
        </div>
      </FadeIn>
      <StaggerList staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 text-4xl">⭐</div>
                  <p className="mb-4 text-muted-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
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
        <p className="text-sm text-muted-foreground">
          NPS: 62 • 70% 7-day retention • 20% free-to-paid conversion
        </p>
      </div>
    </section>
  );
}
