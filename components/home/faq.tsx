"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FadeIn from "@/components/motion/fade-in";
import { FAQSchema } from "@/components/seo/structured-data";

const faqs = [
  {
    category: "Consultancy Services",
    questions: [
      {
        question: "What's the difference between AIAS Consultancy and AIAS Platform?",
        answer: "AIAS Consultancy builds custom AI platforms from scratch (like TokPulse and Hardonia Suite). We architect, develop, and deploy complete solutions tailored to your business. AIAS Platform is our SaaS product for businesses that want ready-made automation tools. Think of it as: Consultancy = custom builds, Platform = ready-to-use software.",
      },
      {
        question: "How long does it take to build a custom AI platform?",
        answer: "Typical timelines range from 8-16 weeks depending on complexity. Discovery & Strategy (1-2 weeks), Architecture & Design (2-3 weeks), Development & Testing (4-12 weeks), Deployment & Launch (1-2 weeks). We provide weekly demos throughout development so you see progress every step of the way.",
      },
      {
        question: "What technologies do you use?",
        answer: "We use modern, scalable tech stacks: Next.js/React for frontends, Node.js/Python for backends, AI/ML frameworks (OpenAI, Anthropic, custom models), cloud infrastructure (AWS, GCP, Azure), and enterprise databases. We choose technologies based on your requirements, not a one-size-fits-all approach.",
      },
      {
        question: "Do you provide ongoing support after launch?",
        answer: "Yes. We offer ongoing support packages including 24/7 monitoring, performance optimization, feature enhancements, bug fixes, and strategic consulting. Many clients work with us long-term for continuous improvement and scaling.",
      },
      {
        question: "What's included in a custom AI platform build?",
        answer: "Complete platform development including: architecture design, custom AI agent development, real-time analytics engines, scalable infrastructure, security & compliance implementation, team training, documentation, and post-launch support. We handle everything from strategy to deployment.",
      },
    ],
  },
  {
    category: "Platform & Pricing",
    questions: [
      {
        question: "How much does a custom AI platform cost?",
        answer: "Custom platform projects typically range from $50K-$500K+ depending on scope, complexity, and timeline. We provide detailed proposals after the discovery phase with transparent pricing, timelines, and deliverables. Schedule a strategy call for a custom quote.",
      },
      {
        question: "Can I try AIAS Platform before hiring consultancy services?",
        answer: "Absolutely. AIAS Platform offers a free plan and 14-day free trial. Many clients start with the platform to understand our capabilities, then engage consultancy services for custom builds. The platform is CAD $49/month for the Starter plan.",
      },
      {
        question: "Do you offer payment plans for consultancy projects?",
        answer: "Yes. We structure payments across project phases: Discovery (20%), Development milestones (60%), Launch (15%), Support retainer (5%). This aligns payments with deliverables and reduces risk for both parties.",
      },
    ],
  },
  {
    category: "Process & Timeline",
    questions: [
      {
        question: "How do you ensure projects stay on time and budget?",
        answer: "We use agile methodology with weekly demos, clear milestones, and transparent communication. Scope is locked after discovery phase. Any changes go through formal change requests. We've delivered 100% of projects on time and within budget.",
      },
      {
        question: "What if I need changes during development?",
        answer: "We accommodate changes through formal change requests. Minor adjustments are usually included. Significant scope changes are estimated separately and approved before implementation. This keeps projects on track while remaining flexible.",
      },
      {
        question: "Will my team be trained on the platform?",
        answer: "Yes. Training is included in every project. We provide comprehensive documentation, hands-on training sessions, and ongoing support. Your team will be fully capable of using and maintaining the platform after launch.",
      },
    ],
  },
];

export function FAQ() {
  // Flatten FAQs for schema
  const allFAQs = faqs.flatMap((category) =>
    category.questions.map((q) => ({
      question: q.question,
      answer: q.answer,
    }))
  );

  return (
    <section className="py-20 bg-muted/30">
      <FAQSchema faqs={allFAQs} />
      <FadeIn>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about our consultancy services and custom AI platform development.
            </p>
          </div>

          <div className="space-y-8">
            {faqs.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Schedule Strategy Call
              </a>
              <a
                href="mailto:support@aias-platform.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
