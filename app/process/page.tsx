import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Search, Code, Rocket, Shield, Users, ArrowRight } from "lucide-react";
import { ServiceSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Our Process — How We Build Custom AI Platforms | AIAS Consultancy",
  description: "From discovery to deployment. See how AIAS Consultancy works with clients to build custom AI platforms. Transparent process, clear timelines, proven results.",
};

const processSteps = [
  {
    phase: "Phase 1",
    title: "Discovery & Strategy",
    duration: "1-2 weeks",
    icon: Search,
    description: "We start by understanding your business, challenges, and goals. This isn't a sales call — it's a strategic consultation.",
    deliverables: [
      "Business needs analysis",
      "Technical requirements gathering",
      "Stakeholder interviews",
      "Competitive landscape review",
      "ROI projections & success metrics",
      "Project roadmap & timeline",
    ],
    outcome: "Clear project scope, architecture plan, and success criteria.",
  },
  {
    phase: "Phase 2",
    title: "Architecture & Design",
    duration: "2-3 weeks",
    icon: Code,
    description: "We design the technical architecture, user flows, and system integrations. Every decision is documented and reviewed.",
    deliverables: [
      "Technical architecture design",
      "System integration mapping",
      "User experience flows",
      "Data model design",
      "Security & compliance plan",
      "Development sprint planning",
    ],
    outcome: "Complete technical blueprint ready for development.",
  },
  {
    phase: "Phase 3",
    title: "Development & Testing",
    duration: "4-12 weeks",
    icon: Rocket,
    description: "Agile development with weekly demos. You see progress every step of the way. No surprises, no scope creep.",
    deliverables: [
      "Weekly progress demos",
      "Custom AI agent development",
      "Platform feature implementation",
      "Integration development",
      "Automated testing suite",
      "Performance optimization",
    ],
    outcome: "Fully functional platform ready for deployment.",
  },
  {
    phase: "Phase 4",
    title: "Deployment & Launch",
    duration: "1-2 weeks",
    icon: Shield,
    description: "We handle deployment, security hardening, and launch support. Your platform goes live smoothly.",
    deliverables: [
      "Production deployment",
      "Security audit & hardening",
      "Performance monitoring setup",
      "Team training & documentation",
      "Launch support & troubleshooting",
      "Post-launch optimization plan",
    ],
    outcome: "Platform live, team trained, ready to scale.",
  },
  {
    phase: "Phase 5",
    title: "Support & Optimization",
    duration: "Ongoing",
    icon: Users,
    description: "We stay with you after launch. Continuous monitoring, improvements, and strategic consulting.",
    deliverables: [
      "24/7 monitoring & alerts",
      "Performance optimization",
      "Feature enhancements",
      "Bug fixes & updates",
      "Strategic consulting",
      "Quarterly reviews",
    ],
    outcome: "Platform continuously improving, ROI increasing.",
  },
];

const principles = [
  {
    title: "Transparency",
    description: "Weekly demos, clear timelines, no hidden costs. You always know where we stand.",
  },
  {
    title: "Collaboration",
    description: "We work with your team, not just for them. Knowledge transfer is built into every phase.",
  },
  {
    title: "Quality",
    description: "Enterprise-grade code, security-first architecture, scalable design. Built to last.",
  },
  {
    title: "Results",
    description: "We measure success by your outcomes. ROI tracking, performance metrics, business impact.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <ServiceSchema />
      <div className="container py-16">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            How We Build Custom AI Platforms
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            From discovery to deployment, we follow a proven process that ensures your platform 
            delivers real business value. Transparent, collaborative, results-driven.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">Schedule Strategy Call</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/case-studies">See Results</Link>
            </Button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="space-y-12 mb-16">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.phase} className="relative">
                {/* Connection line */}
                {index < processSteps.length - 1 && (
                  <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-primary/20 hidden md:block" />
                )}
                
                <Card className="relative overflow-hidden border-2">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardHeader className="bg-muted/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-primary">{step.phase}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{step.duration}</span>
                        </div>
                        <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                        <CardDescription className="text-base">{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Deliverables
                        </h4>
                        <ul className="space-y-2">
                          {step.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Outcome</h4>
                        <p className="text-sm text-muted-foreground">{step.outcome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Principles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((principle) => (
              <Card key={principle.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline Example */}
        <Card className="mb-16 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Typical Project Timeline</CardTitle>
            <CardDescription>
              Example: Custom AI Platform (similar to TokPulse or Hardonia Suite)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 text-sm font-medium">Weeks 1-2</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Discovery & Strategy</div>
                  <div className="text-sm text-muted-foreground">Requirements, architecture planning, roadmap</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 text-sm font-medium">Weeks 3-5</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Architecture & Design</div>
                  <div className="text-sm text-muted-foreground">Technical design, integrations, security plan</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 text-sm font-medium">Weeks 6-14</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Development & Testing</div>
                  <div className="text-sm text-muted-foreground">Agile sprints, weekly demos, testing</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="w-24 text-sm font-medium">Weeks 15-16</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Deployment & Launch</div>
                  <div className="text-sm text-muted-foreground">Production deployment, training, go-live</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="w-24 text-sm font-medium">Ongoing</div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">Support & Optimization</div>
                  <div className="text-sm text-muted-foreground">Monitoring, improvements, strategic consulting</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Schedule a strategy call to discuss your custom AI platform. We'll review your needs, 
            share relevant case studies, and outline a clear process tailored to your project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/demo">
                Schedule Strategy Call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
