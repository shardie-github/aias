import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, PauseCircle, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  type: 'demo' | 'interactive' | 'quiz' | 'code';
  content: {
    text?: string;
    code?: string;
    demo?: {
      component: string;
      props: Record<string, any>;
    };
    quiz?: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    };
  };
  hints?: string[];
  validation?: (userInput: any) => boolean;
  onComplete?: () => void;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'getting-started' | 'automation' | 'ai-agents' | 'marketplace' | 'security';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  steps: TutorialStep[];
  prerequisites?: string[];
  tags: string[];
}

interface InteractiveTutorialProps {
  tutorial: Tutorial;
  onComplete?: (tutorialId: string, score: number) => void;
  onProgress?: (stepIndex: number, completed: boolean) => void;
}

export const InteractiveTutorial: React.FC<InteractiveTutorialProps> = ({
  tutorial,
  onComplete,
  onProgress
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [showHints, setShowHints] = useState(false);
  const [score, setScore] = useState(0);

  const currentStepData = tutorial.steps[currentStep];
  const progress = ((currentStep + 1) / tutorial.steps.length) * 100;

  useEffect(() => {
    if (isPlaying && currentStep < tutorial.steps.length) {
      const timer = setTimeout(() => {
        if (currentStepData.type === 'demo') {
          // Auto-advance demo steps
          handleNext();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, currentStepData.type]);

  const handleNext = () => {
    if (currentStep < tutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHints(false);
    } else {
      // Tutorial completed
      const finalScore = (completedSteps.size / tutorial.steps.length) * 100;
      setScore(finalScore);
      onComplete?.(tutorial.id, finalScore);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHints(false);
    }
  };

  const handleStepComplete = (stepIndex: number, userInput?: any) => {
    const step = tutorial.steps[stepIndex];
    let isValid = true;

    if (step.validation && userInput !== undefined) {
      isValid = step.validation(userInput);
    }

    if (isValid) {
      setCompletedSteps(prev => new Set([...prev, stepIndex]));
      setUserAnswers(prev => ({ ...prev, [stepIndex]: userInput }));
      onProgress?.(stepIndex, true);
      step.onComplete?.();
    }

    return isValid;
  };

  const handleQuizAnswer = (answerIndex: number) => {
    const step = currentStepData;
    if (step.content.quiz) {
      const isCorrect = answerIndex === step.content.quiz.correct;
      setUserAnswers(prev => ({ ...prev, [currentStep]: answerIndex }));
      
      if (isCorrect) {
        handleStepComplete(currentStep, answerIndex);
      }
      
      return isCorrect;
    }
    return false;
  };

  const renderStepContent = () => {
    const step = currentStepData;
    
    switch (step.type) {
      case 'demo':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-600">
                <PlayCircle className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium">Interactive Demo</p>
                <p className="text-sm">Watch the automation in action</p>
              </div>
            </div>
            {step.content.text && (
              <div className="prose max-w-none">
                <p>{step.content.text}</p>
              </div>
            )}
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Try it yourself!</h4>
              <p className="text-blue-800">{step.content.text}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleStepComplete(currentStep)}>
                Mark as Complete
              </Button>
              <Button variant="outline" onClick={() => setShowHints(!showHints)}>
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </div>
            {showHints && step.hints && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-2">Hints:</h5>
                <ul className="list-disc list-inside text-yellow-800 space-y-1">
                  {step.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-6 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-4">
                {step.content.quiz?.question}
              </h4>
              <div className="space-y-2">
                {step.content.quiz?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      const isCorrect = handleQuizAnswer(index);
                      if (isCorrect) {
                        // Show explanation
                        setTimeout(() => {
                          if (step.content.quiz?.explanation) {
                            alert(`Correct! ${step.content.quiz.explanation}`);
                          }
                        }, 500);
                      }
                    }}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{step.content.code}</code>
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleStepComplete(currentStep)}>
                I Understand This Code
              </Button>
              <Button variant="outline" onClick={() => setShowHints(!showHints)}>
                {showHints ? 'Hide' : 'Show'} Explanation
              </Button>
            </div>
            {showHints && step.hints && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium mb-2">Code Explanation:</h5>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {step.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return <div>Unknown step type</div>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{tutorial.title}</CardTitle>
            <p className="text-gray-600 mt-1">{tutorial.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{tutorial.difficulty}</Badge>
            <Badge variant="outline">{tutorial.estimatedTime} min</Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{currentStep + 1} of {tutorial.steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            size="sm"
          >
            {isPlaying ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button
            onClick={() => {
              setCurrentStep(0);
              setCompletedSteps(new Set());
              setUserAnswers({});
              setScore(0);
            }}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4" />
            Restart
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Step {currentStep + 1}: {currentStepData.title}
          </h3>
          {completedSteps.has(currentStep) && (
            <CheckCircle className="w-6 h-6 text-green-500" />
          )}
        </div>

        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep < tutorial.steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => onComplete?.(tutorial.id, score)}>
                Complete Tutorial
              </Button>
            )}
          </div>
        </div>

        {score > 0 && (
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <h4 className="font-semibold text-green-900 mb-2">Tutorial Completed!</h4>
            <p className="text-green-800">Your score: {Math.round(score)}%</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};