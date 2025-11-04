/**
 * Guardian Onboarding Walkthrough
 * Interactive tutorial for new users
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, Eye, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
}

export default function GuardianOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const steps: OnboardingStep[] = [
    {
      title: 'Welcome to Guardian',
      description: 'Your privacy protector',
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Guardian is your self-governing privacy system that monitors app behavior,
            explains what's happening, and builds trust through transparency.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Monitors all data access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Assesses risk automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Explains everything in plain language</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Learns your preferences over time</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'How Guardian Works',
      description: 'Three simple steps',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">1. Watch</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Guardian watches every data access event - API calls, telemetry, content processing.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">2. Assess</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Each event is assessed for risk (low, medium, high, critical) and appropriate action is taken.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">3. Explain</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Guardian explains what happened, why, and what data was used - all in user-friendly language.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Privacy Features',
      description: 'Tools to protect your privacy',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Private Mode Pulse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  One-click toggle to freeze telemetry instantly. Perfect for sensitive moments.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Emergency Lockdown</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  1-click killswitch that wipes local telemetry and pauses background sync.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sensitive Context Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically detects camera/microphone use and mutes monitoring accordingly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Trust Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View all events, risk levels, and explainable insights in one place.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: 'Trust Fabric',
      description: 'Your personalized privacy model',
      content: (
        <div className="space-y-4">
          <p>
            Guardian learns your preferences and builds a Trust Fabric model that:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Adapts to your comfort zones</li>
            <li>Learns from your behavior</li>
            <li>Provides personalized recommendations</li>
            <li>Can be exported/imported for portability</li>
          </ul>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">Example:</p>
            <p className="text-sm text-muted-foreground">
              If you consistently disable location tracking, Guardian will learn this preference
              and suggest blocking location access by default.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'You\'re All Set!',
      description: 'Start using Guardian',
      content: (
        <div className="space-y-4 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
          <p className="text-lg">
            Guardian is now active and monitoring your app's behavior.
          </p>
          <p className="text-muted-foreground">
            Visit the Trust Dashboard anytime to see what's happening with your data.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => setCompleted(true)}>
              Go to Trust Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (completed) {
    // Redirect to trust dashboard
    window.location.href = '/dashboard/trust';
    return null;
  }

  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {steps.length}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step.content}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
