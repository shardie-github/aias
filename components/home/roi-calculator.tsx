"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import FadeIn from "@/components/motion/fade-in";

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState([10]);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [employees, setEmployees] = useState(1);

  const hoursSaved = hoursPerWeek[0];
  const weeklySavings = hoursSaved * hourlyRate * employees;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = monthlySavings * 12;
  const monthlyCost = 49; // CAD $49/month Starter plan
  const yearlyCost = monthlyCost * 12;
  const monthlyROI = ((monthlySavings - monthlyCost) / monthlyCost) * 100;
  const yearlyROI = ((yearlySavings - yearlyCost) / yearlyCost) * 100;
  const paybackPeriod = monthlyCost / monthlySavings; // in months

  return (
    <section className="py-20 bg-muted/30">
      <FadeIn>
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Calculate Your ROI
            </h2>
            <p className="text-lg text-muted-foreground">
              See how much time and money you'll save with AI automation
            </p>
          </div>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>ROI Calculator</CardTitle>
              <CardDescription>
                Adjust the sliders to see your potential savings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hours">
                    Hours saved per week: <strong>{hoursSaved}</strong>
                  </Label>
                  <Slider
                    id="hours"
                    min={1}
                    max={40}
                    step={1}
                    value={hoursPerWeek}
                    onValueChange={setHoursPerWeek}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="rate">
                    Average hourly rate (CAD $): <strong>${hourlyRate}</strong>
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="rate"
                      type="number"
                      min={20}
                      max={200}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="employees">
                    Number of employees: <strong>{employees}</strong>
                  </Label>
                  <Slider
                    id="employees"
                    min={1}
                    max={10}
                    step={1}
                    value={[employees]}
                    onValueChange={(val) => setEmployees(val[0])}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                  <div className="text-3xl font-bold text-primary">
                    CAD ${monthlySavings.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Yearly Savings</div>
                  <div className="text-3xl font-bold text-primary">
                    CAD ${yearlySavings.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Cost</div>
                  <div className="text-2xl font-semibold">
                    CAD ${monthlyCost}/month
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly ROI</div>
                  <div className="text-2xl font-semibold text-green-600">
                    {monthlyROI > 0 ? '+' : ''}{monthlyROI.toFixed(0)}%
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <div className="text-sm text-muted-foreground">Payback Period</div>
                  <div className="text-xl font-semibold">
                    {paybackPeriod < 1 
                      ? '< 1 month' 
                      : `${paybackPeriod.toFixed(1)} months`}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <div className="bg-primary/5 p-4 rounded-lg mb-4">
                  <p className="text-sm">
                    <strong>Example:</strong> If you save {hoursSaved} hours/week at ${hourlyRate}/hour for {employees} employee{employees > 1 ? 's' : ''}, 
                    you'll save <strong>CAD ${monthlySavings.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/month</strong> 
                    {' '}with a monthly cost of only CAD ${monthlyCost}/month.
                  </p>
                </div>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/signup">Start Free Trial — Save {hoursSaved} Hours/Week</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </section>
  );
}
