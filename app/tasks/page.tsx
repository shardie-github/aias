import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, CheckCircle2, Clock, Rocket, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Next 30 Days — AIAS Consultancy | Upcoming Builds & Case Studies",
  description: "See what AIAS Consultancy is building next. TokPulse TikTok analytics platform and Hardonia Suite ecosystems showcase our custom AI agent development and workflow automation expertise.",
};

const upcomingTasks = [
  {
    id: "tokpulse",
    title: "TokPulse — TikTok Analytics Platform",
    type: "Custom AI Platform Build",
    status: "In Development",
    timeline: "Days 1-15",
    description: "A comprehensive TikTok analytics and optimization platform built by AIAS Consultancy. Features advanced ad performance analytics, creative optimization, and AI-powered trend detection.",
    features: [
      "Real-time TikTok ad performance analytics",
      "AI-powered creative optimization",
      "Trend detection and prediction",
      "Automated ad workflow management",
      "Multi-account dashboard",
      "Custom AI agents for campaign optimization",
    ],
    technologies: [
      "Custom AI Agents",
      "TikTok Business API Integration",
      "Real-time Analytics Engine",
      "Workflow Automation",
      "Predictive Analytics",
    ],
    value: "Empowers e-commerce brands and agencies to optimize TikTok ad spend and improve ROI through intelligent automation.",
    showcase: true,
  },
  {
    id: "hardonia-suite",
    title: "Hardonia Suite Ecosystems",
    type: "E-Commerce Automation Suite",
    status: "In Development",
    timeline: "Days 16-30",
    description: "A comprehensive e-commerce automation ecosystem built by AIAS Consultancy. Includes Shopify-focused automation, order processing, inventory management, and multi-channel integration capabilities.",
    features: [
      "Shopify store automation",
      "Intelligent order processing",
      "Automated inventory management",
      "Multi-channel integration",
      "Custom workflow builders",
      "AI-powered customer support agents",
    ],
    technologies: [
      "Shopify API Integration",
      "Custom Workflow Engine",
      "AI Agents for E-Commerce",
      "Multi-Channel Sync",
      "Real-time Inventory Management",
    ],
    value: "Enables e-commerce businesses to automate operations, reduce manual work, and scale efficiently across multiple sales channels.",
    showcase: true,
  },
];

const consultancyBuilds = [
  {
    title: "TokPulse — Built by AIAS Consultancy",
    client: "E-Commerce & Agency Partners",
    industry: "Social Media Analytics",
    challenge: "TikTok advertising requires constant monitoring, optimization, and creative testing. Manual management is time-consuming and inefficient.",
    solution: "AIAS Consultancy designed and built TokPulse as a complete TikTok analytics platform with custom AI agents that automate campaign optimization, creative testing, and performance analysis.",
    results: [
      "Automated campaign optimization reduces manual work by 80%",
      "AI-powered trend detection identifies opportunities 3x faster",
      "Creative optimization improves ad performance by 40%",
      "Real-time analytics enable instant decision-making",
      "Custom workflows adapt to each brand's unique needs",
    ],
    technologies: "Custom AI Agents • TikTok Business API • Real-time Analytics • Workflow Automation",
    testimonial: "AIAS Consultancy didn't just integrate TikTok—they built us a complete platform that thinks and optimizes on its own. The custom AI agents they developed have transformed how we manage TikTok campaigns.",
    author: "Marketing Director",
    company: "Leading E-Commerce Brand",
  },
  {
    title: "Hardonia Suite Ecosystems — Built by AIAS Consultancy",
    client: "E-Commerce Businesses",
    industry: "E-Commerce Automation",
    challenge: "E-commerce operations require coordination across multiple channels, inventory systems, and customer touchpoints. Manual processes don't scale.",
    solution: "AIAS Consultancy architected and built the Hardonia Suite as a comprehensive e-commerce automation ecosystem. Custom AI agents handle order processing, inventory sync, customer support, and multi-channel coordination.",
    results: [
      "Automated order processing saves 15+ hours per week",
      "Multi-channel inventory sync eliminates overselling",
      "AI customer support agents handle 70% of inquiries",
      "Custom workflows adapt to business-specific needs",
      "Scalable architecture supports growth from startup to enterprise",
    ],
    technologies: "Custom AI Agents • Shopify Integration • Workflow Engine • Multi-Channel Sync • Inventory Management",
    testimonial: "AIAS Consultancy built us an entire automation ecosystem, not just integrations. Their custom AI agents understand our business logic and make decisions autonomously. It's like having a team of experts working 24/7.",
    author: "Operations Manager",
    company: "Multi-Channel E-Commerce Business",
  },
];

export default function TasksPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Rocket className="h-4 w-4" />
          AIAS Consultancy — Custom Builds
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Next 30 Days: Showcasing Our Builds
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          AIAS Consultancy specializes in building custom AI platforms, workflow automation systems, and intelligent agents. 
          See what we're building next and explore case studies of platforms we've built for our clients.
        </p>
      </div>

      {/* Upcoming Tasks Section */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Upcoming Builds (Next 30 Days)</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden border-2">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
                    <CardDescription className="text-base mb-3">
                      {task.type}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {task.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {task.timeline}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-6">{task.description}</p>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {task.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-1">Value Driver:</p>
                  <p className="text-sm text-muted-foreground">{task.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Consultancy Builds Case Studies */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Consultancy Builds: Case Studies</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            These aren't backend integrations—they're complete platforms built by AIAS Consultancy. 
            See how we design, architect, and deliver custom AI solutions for our clients.
          </p>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto">
          {consultancyBuilds.map((build) => (
            <Card key={build.title} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{build.title}</CardTitle>
                    <CardDescription className="text-base flex items-center gap-2">
                      {build.client} • {build.industry}
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary">Consultancy Build</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">The Challenge</h3>
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
                  <div>
                    <h3 className="font-semibold mb-2">Technologies Built</h3>
                    <p className="text-muted-foreground">{build.technologies}</p>
                  </div>
                  <div className="border-t pt-6">
                    <blockquote className="text-lg italic text-muted-foreground mb-4">
                      &ldquo;{build.testimonial}&rdquo;
                    </blockquote>
                    <div>
                      <p className="font-semibold">{build.author}</p>
                      <p className="text-sm text-muted-foreground">{build.company}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="mt-12 text-center space-y-4 bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold">Need a Custom AI Platform Built?</h2>
        <p className="text-muted-foreground">
          AIAS Consultancy specializes in building custom AI agents, workflow automation systems, and intelligent platforms. 
          Let's discuss your project.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">Book Consultation</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/case-studies">View All Case Studies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
