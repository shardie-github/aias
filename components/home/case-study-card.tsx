"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock, DollarSign, TrendingUp } from "lucide-react";

interface CaseStudyCardProps {
  title: string;
  company: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: {
    hoursSaved: number;
    revenueIncrease?: number;
    errorReduction?: number;
  };
  testimonial?: string;
  author?: string;
  slug?: string;
}

export function CaseStudyCard({
  title,
  company,
  industry,
  location,
  challenge,
  solution,
  results,
  testimonial,
  author,
  slug,
}: CaseStudyCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div>
            <CardTitle className="text-xl mb-1">{title}</CardTitle>
            <CardDescription>
              {company} • {industry} • {location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <h4 className="font-semibold mb-1">Challenge</h4>
            <p className="text-sm text-muted-foreground">{challenge}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Solution</h4>
            <p className="text-sm text-muted-foreground">{solution}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{results.hoursSaved}</div>
                <div className="text-xs text-muted-foreground">Hours/Week Saved</div>
              </div>
            </div>
            {results.revenueIncrease && (
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">+{results.revenueIncrease}%</div>
                  <div className="text-xs text-muted-foreground">Revenue Increase</div>
                </div>
              </div>
            )}
            {results.errorReduction && (
              <div className="flex items-center gap-2 col-span-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-lg font-bold">{results.errorReduction}%</div>
                  <div className="text-xs text-muted-foreground">Error Reduction</div>
                </div>
              </div>
            )}
          </div>
          {testimonial && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm italic mb-2">"{testimonial}"</p>
              {author && <p className="text-xs text-muted-foreground">— {author}</p>}
            </div>
          )}
        </div>
        {slug && (
          <Button variant="outline" className="mt-4 w-full" asChild>
            <Link href={`/case-studies/${slug}`}>
              Read Full Case Study <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
