import { useState } from "react";
import { ArrowRight, TrendingUp, Users, Clock, DollarSign, Zap, CheckCircle2, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ROICalculator = () => {
  const [employees, setEmployees] = useState(50);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [showResults, setShowResults] = useState(false);

  // ROI Calculations
  const hourlyRate = avgSalary / 2080; // 52 weeks * 40 hours
  const weeklySavings = employees * hoursPerWeek * hourlyRate;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = monthlySavings * 12;
  const aiasInvestment = 12000; // Annual subscription estimate
  const netROI = yearlySavings - aiasInvestment;
  const roiPercentage = ((netROI / aiasInvestment) * 100).toFixed(0);
  const paybackMonths = (aiasInvestment / monthlySavings).toFixed(1);

  const testimonials = [
    {
      quote: "AIAS reduced our operational costs by 43% in the first quarter. The ROI was immediate and measurable.",
      author: "Sarah Chen",
      role: "CTO, TechCorp Industries",
      rating: 5,
    },
    {
      quote: "We recovered our investment in 2.3 months. Now we're saving $180K annually while improving quality.",
      author: "Michael Rodriguez",
      role: "VP Operations, Global Solutions Inc",
      rating: 5,
    },
    {
      quote: "The AI automation freed up 300+ hours per month for our team to focus on strategic initiatives.",
      author: "Jennifer Park",
      role: "CEO, Innovation Labs",
      rating: 5,
    },
  ];

  const proofPoints = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: TrendingUp, value: "847%", label: "Avg ROI" },
    { icon: Clock, value: "2.4 months", label: "Avg Payback" },
    { icon: DollarSign, value: "$2.8M", label: "Total Saved" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navigation />
      
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground py-3 animate-pulse">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm md:text-base font-semibold flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            Limited Time: First 100 companies get 30% off annual plans + Free onboarding (Worth $5,000)
            <Zap className="h-4 w-4" />
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            Calculate Your Savings
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            AI ROI Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how much time and money your organization can save with AIAS
          </p>
        </div>

        {/* Proof Points */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-scale-in">
          {proofPoints.map((point, idx) => (
            <Card key={idx} className="text-center hover-scale border-primary/20 bg-gradient-to-br from-card to-card/50">
              <CardContent className="pt-6">
                <point.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl md:text-3xl font-bold text-foreground">{point.value}</p>
                <p className="text-sm text-muted-foreground">{point.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Calculator */}
          <Card className="shadow-card border-primary/20 animate-slide-in-right">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-primary" />
                Your Organization
              </CardTitle>
              <CardDescription>Adjust the values to match your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employees" className="text-base font-semibold">
                  Number of Employees
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="employees"
                    min={1}
                    max={500}
                    step={1}
                    value={[employees]}
                    onValueChange={(value) => setEmployees(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary" className="text-base font-semibold">
                  Average Annual Salary
                </Label>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-mono">$</span>
                  <Input
                    id="salary"
                    type="number"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours" className="text-base font-semibold">
                  Hours Saved per Employee per Week
                </Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="hours"
                    min={1}
                    max={20}
                    step={0.5}
                    value={[hoursPerWeek]}
                    onValueChange={(value) => setHoursPerWeek(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>

              <Button
                onClick={() => setShowResults(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
              >
                Calculate My ROI
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className={`shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-background ${showResults ? 'animate-scale-in' : 'opacity-50'}`}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Your Estimated ROI
              </CardTitle>
              <CardDescription>Based on industry benchmarks and your inputs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-primary to-primary-glow rounded-lg text-primary-foreground">
                <p className="text-sm opacity-90 mb-1">Annual Net Savings</p>
                <p className="text-4xl md:text-5xl font-bold">
                  ${netROI.toLocaleString()}
                </p>
                <p className="text-sm opacity-90 mt-2">ROI: {roiPercentage}%</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
                  <p className="text-2xl font-bold text-foreground">
                    {paybackMonths} mo
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-primary/20">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Save {(hoursPerWeek * employees * 52).toLocaleString()} hours annually</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Reduce operational costs by 35-50%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Improve team productivity by 3x</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>24/7 AI assistance with zero downtime</span>
                </div>
              </div>

              <Button size="lg" className="w-full" variant="outline">
                Get Your Custom Proposal
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="hover-scale border-primary/20 bg-gradient-to-br from-card to-card/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground border-0 shadow-glow">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join 10,000+ companies saving millions with AIAS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-75">No credit card required • 14-day free trial • Cancel anytime</p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default ROICalculator;
