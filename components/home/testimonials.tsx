"use client";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import FadeIn from "@/components/motion/fade-in";

const testimonials = [
  {
    quote: "AIAS saves me 12 hours per week on order processing and customer support. The global integrations and multi-currency support make it perfect for our international e-commerce business. Setup took 25 minutes.",
    author: "Emma Chen",
    role: "E-commerce Store Owner",
    company: "Chen's Boutique, Toronto, Canada",
    flag: "🇨🇦",
  },
  {
    quote: "As an education consultant working with stakeholders across 15 countries, I needed a platform that understands global markets. AIAS's multi-currency support and international integrations made it easy to automate workflows across different regions.",
    author: "Dr. Michael Rodriguez",
    role: "International Education Consultant",
    company: "Global Education Partners, London, UK",
    flag: "🇬🇧",
  },
  {
    quote: "The enterprise security and global compliance (GDPR, PIPEDA) are crucial for our organization. We serve clients in North America, Europe, and APAC, and AIAS handles all our automation needs seamlessly.",
    author: "Sarah Watanabe",
    role: "Operations Director",
    company: "Tech Solutions Inc., Singapore",
    flag: "🇸🇬",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
          <p className="text-muted-foreground text-lg">
            Join 2,000+ businesses across North America, Europe, Asia-Pacific, and beyond
          </p>
        </div>
      </FadeIn>
      <StaggerList staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.author}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-4xl">⭐</span>
                    <span className="text-2xl">{testimonial.flag}</span>
                  </div>
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
          NPS: 62 • 70% 7-day retention • 20% free-to-paid conversion • Serving 40+ countries
        </p>
      </div>
    </section>
  );
}
