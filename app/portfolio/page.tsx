import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, Code, Zap, BarChart, ShoppingCart, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio — Custom AI Platforms We've Built | AIAS Consultancy",
  description: "See complete custom AI platforms built by AIAS Consultancy. TokPulse TikTok analytics, Hardonia Suite e-commerce automation, and more. Real projects, real results.",
};

const portfolioProjects = [
  {
    id: "tokpulse",
    name: "TokPulse",
    tagline: "TikTok Analytics & Optimization Platform",
    category: "Social Media Analytics",
    client: "E-Commerce & Agency Partners",
    year: "2024",
    status: "Live",
    description: "A complete TikTok analytics and optimization platform with custom AI agents that automate campaign optimization, creative testing, and performance analysis.",
    challenge: "TikTok advertising requires constant monitoring, optimization, and creative testing. Manual management is time-consuming and inefficient.",
    solution: "Built a comprehensive platform with real-time analytics, AI-powered trend detection, automated campaign optimization, and custom workflow builders.",
    results: [
      "80% reduction in manual campaign management",
      "40% improvement in ad performance",
      "3x faster trend identification",
      "Real-time decision-making capabilities",
    ],
    technologies: [
      "Next.js / React",
      "Custom AI Agents",
      "TikTok Business API",
      "Real-time Analytics Engine",
      "PostgreSQL",
      "Redis",
      "AWS Infrastructure",
    ],
    features: [
      "Multi-account dashboard",
      "Real-time performance metrics",
      "AI-powered creative optimization",
      "Automated A/B testing",
      "Predictive analytics",
      "Custom workflow automation",
    ],
    metrics: {
      developmentTime: "12 weeks",
      teamSize: "4 developers",
      linesOfCode: "50K+",
      apiIntegrations: "15+",
    },
    icon: BarChart,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "hardonia-suite",
    name: "Hardonia Suite",
    tagline: "E-Commerce Automation Ecosystem",
    category: "E-Commerce Automation",
    client: "E-Commerce Businesses",
    year: "2024",
    status: "Live",
    description: "A comprehensive e-commerce automation ecosystem with custom AI agents for order processing, inventory management, customer support, and multi-channel coordination.",
    challenge: "E-commerce operations require coordination across multiple channels, inventory systems, and customer touchpoints. Manual processes don't scale.",
    solution: "Architected and built a complete automation ecosystem with intelligent order processing, multi-channel inventory sync, AI customer support agents, and custom workflow builders.",
    results: [
      "15+ hours saved per week on order processing",
      "70% of customer inquiries handled automatically",
      "Zero overselling incidents",
      "Scalable from startup to enterprise",
    ],
    technologies: [
      "Next.js / React",
      "Shopify API Integration",
      "Custom Workflow Engine",
      "AI Agents for E-Commerce",
      "Multi-Channel Sync",
      "PostgreSQL",
      "Stripe Integration",
    ],
    features: [
      "Intelligent order processing",
      "Multi-channel inventory sync",
      "AI customer support agents",
      "Automated fulfillment workflows",
      "Real-time inventory management",
      "Custom reporting dashboards",
    ],
    metrics: {
      developmentTime: "14 weeks",
      teamSize: "5 developers",
      linesOfCode: "75K+",
      apiIntegrations: "20+",
    },
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
  },
];

export default function PortfolioPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Portfolio: Custom AI Platforms
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          These aren't integrations — they're complete platforms we architected and built from the ground up. 
          See real projects, real technologies, and real results.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">Start Your Project</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/process">See Our Process</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-16">
        {portfolioProjects.map((project) => {
          const Icon = project.icon;
          return (
            <Card key={project.id} className="overflow-hidden border-2">
              <div className={`bg-gradient-to-r ${project.color} p-8 text-white`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{project.name}</h2>
                        <p className="text-white/90">{project.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/80 mt-4">
                      <span>{project.category}</span>
                      <span>•</span>
                      <span>{project.year}</span>
                      <span>•</span>
                      <Badge className="bg-green-500 text-white border-0">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Overview</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">The Challenge</h3>
                      <p className="text-muted-foreground">{project.challenge}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">Our Solution</h3>
                      <p className="text-muted-foreground">{project.solution}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-4">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {project.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">✓</span>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual placeholder */}
                    <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-8 border border-primary/20">
                      <div className="aspect-video rounded-lg bg-muted/50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🖥️</div>
                          <div className="text-sm text-muted-foreground font-medium">
                            Platform Dashboard
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Interactive demo available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Results */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Results</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {project.results.map((result, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              <span className="text-sm">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Technologies */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tech Stack</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Development:</span>
                          <span className="font-medium">{project.metrics.developmentTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Team Size:</span>
                          <span className="font-medium">{project.metrics.teamSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Code Base:</span>
                          <span className="font-medium">{project.metrics.linesOfCode}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Integrations:</span>
                          <span className="font-medium">{project.metrics.apiIntegrations}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Build Your Custom AI Platform?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Schedule a strategy call to discuss your project. We'll review your needs, 
          share relevant case studies, and outline a custom solution.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/demo">
              Schedule Strategy Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/case-studies">View All Case Studies</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
