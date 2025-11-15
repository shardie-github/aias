"use client";
import { Card, CardContent } from "@/components/ui/card";
import FadeIn from "@/components/motion/fade-in";
import { CheckCircle2, Shield, Award, Users, TrendingUp, Clock } from "lucide-react";

const metrics = [
  {
    icon: CheckCircle2,
    value: "100%",
    label: "Projects Delivered On Time",
    description: "Every custom platform delivered as promised",
  },
  {
    icon: TrendingUp,
    value: "40%",
    label: "Average ROI Increase",
    description: "Clients see measurable business impact",
  },
  {
    icon: Users,
    value: "50+",
    label: "Enterprise Clients",
    description: "Trusted by brands worldwide",
  },
  {
    icon: Clock,
    value: "8-16",
    label: "Weeks Average Timeline",
    description: "From strategy to deployment",
  },
];

const certifications = [
  {
    name: "PIPEDA Compliant",
    icon: Shield,
    description: "Canadian privacy law compliance",
  },
  {
    name: "SOC 2 Ready",
    icon: Shield,
    description: "Enterprise security standards",
  },
  {
    name: "ISO 27001 Aligned",
    icon: Award,
    description: "Information security management",
  },
];

const clientTypes = [
  "E-Commerce Brands",
  "Marketing Agencies",
  "Enterprise Companies",
  "SaaS Platforms",
  "Healthcare Organizations",
  "Financial Services",
];

export function TrustSignals() {
  return (
    <section className="py-20 bg-background">
      <FadeIn>
        <div className="container max-w-6xl mx-auto">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label} className="text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                    <div className="font-semibold mb-1">{metric.label}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Security & Compliance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {certifications.map((cert) => {
                const Icon = cert.icon;
                return (
                  <Card key={cert.name}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold mb-1">{cert.name}</div>
                          <div className="text-sm text-muted-foreground">{cert.description}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Client Types */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Trusted By</h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {clientTypes.map((type) => (
                <div
                  key={type}
                  className="px-4 py-2 rounded-full bg-muted border border-border text-sm font-medium"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
