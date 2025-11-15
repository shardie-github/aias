import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code, Workflow, Zap, Shield, BarChart, Users } from "lucide-react";
import { ServiceSchema } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Consultancy Services — Custom AI Platform Development | AIAS",
  description: "Custom AI platform development, workflow automation architecture, and AI agent design. From strategy to deployment. See our work: TokPulse, Hardonia Suite.",
};

const services = [
  {
    icon: Code,
    title: "Custom AI Platform Development",
    description: "We architect and build complete AI platforms from the ground up — not integrations. TokPulse and Hardonia Suite showcase our full-stack development capabilities.",
    deliverables: [
      "Platform architecture & design",
      "Custom AI agent development",
      "Real-time analytics engines",
      "Scalable infrastructure",
    ],
    timeline: "8-16 weeks",
  },
  {
    icon: Workflow,
    title: "Workflow Automation Architecture",
    description: "Design and implement intelligent automation systems that understand your business logic and make decisions autonomously.",
    deliverables: [
      "Process analysis & mapping",
      "Automation strategy",
      "Custom workflow builders",
      "Integration architecture",
    ],
    timeline: "4-12 weeks",
  },
  {
    icon: Zap,
    title: "AI Agent Design & Development",
    description: "Build custom AI agents that handle complex tasks, learn from data, and adapt to your unique business needs.",
    deliverables: [
      "Agent architecture design",
      "Training data preparation",
      "Model fine-tuning",
      "Deployment & monitoring",
    ],
    timeline: "4-8 weeks",
  },
  {
    icon: BarChart,
    title: "Analytics & Intelligence Platforms",
    description: "Create real-time analytics platforms with predictive capabilities. See TokPulse for TikTok analytics example.",
    deliverables: [
      "Data pipeline architecture",
      "Real-time dashboards",
      "Predictive analytics",
      "Custom reporting",
    ],
    timeline: "6-12 weeks",
  },
  {
    icon: Shield,
    title: "Enterprise Security & Compliance",
    description: "Build with security-first architecture. PIPEDA compliant, SOC 2 ready, enterprise-grade encryption.",
    deliverables: [
      "Security architecture review",
      "Compliance implementation",
      "Access control systems",
      "Audit logging",
    ],
    timeline: "2-4 weeks",
  },
  {
    icon: Users,
    title: "Ongoing Support & Optimization",
    description: "Continuous improvement, monitoring, and optimization. We stay with you after launch.",
    deliverables: [
      "Performance monitoring",
      "Feature enhancements",
      "Bug fixes & updates",
      "Strategic consulting",
    ],
    timeline: "Ongoing",
  },
];

export default function ServicesPage() {
  return (
    <>
      <ServiceSchema />
      <div className="container py-16">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Consultancy Services
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          We don't sell software. We build custom AI platforms, automation systems, 
          and intelligent agents tailored to your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">Schedule Strategy Call</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/tasks">See Our Builds</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Deliverables:</h4>
                    <ul className="space-y-1">
                      {service.deliverables.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <strong>Typical Timeline:</strong> {service.timeline}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Build Your Custom AI Platform?</h2>
        <p className="text-muted-foreground mb-6">
          Schedule a strategy call to discuss your project. We'll review your needs, 
          share relevant case studies, and outline a custom solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">Schedule Strategy Call</Link>
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
