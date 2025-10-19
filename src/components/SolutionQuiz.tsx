import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';

const questions = [
  {
    question: "What's your biggest operational challenge?",
    options: [
      { text: 'Repetitive manual tasks', value: 'automation' },
      { text: 'Data scattered across systems', value: 'integration' },
      { text: 'Slow customer response times', value: 'customer-service' },
      { text: 'Inefficient decision-making', value: 'analytics' },
    ],
  },
  {
    question: 'How large is your team?',
    options: [
      { text: '1-10 people', value: 'small' },
      { text: '11-50 people', value: 'medium' },
      { text: '51-200 people', value: 'large' },
      { text: '200+ people', value: 'enterprise' },
    ],
  },
  {
    question: 'What level of customization do you need?',
    options: [
      { text: 'Quick plug-and-play solution', value: 'out-of-box' },
      { text: 'Some customization needed', value: 'semi-custom' },
      { text: 'Fully tailored to our workflow', value: 'custom' },
      { text: 'Not sure yet', value: 'unsure' },
    ],
  },
];

const recommendations = {
  automation: {
    title: 'Workflow Automation Suite',
    description: 'Eliminate repetitive tasks with intelligent automation agents that handle data entry, reporting, and routine operations.',
    features: ['Task automation', 'Smart scheduling', 'Process optimization', 'Integration ready'],
    roi: '40-60 hours saved per month',
  },
  integration: {
    title: 'Data Integration Platform',
    description: 'Unify your data sources with AI-powered integration that syncs information across all your systems in real-time.',
    features: ['Multi-source sync', 'Real-time updates', 'Data validation', 'Custom workflows'],
    roi: '70% reduction in data errors',
  },
  'customer-service': {
    title: 'AI Customer Service Agent',
    description: 'Deploy intelligent chatbots and automation to handle customer inquiries 24/7 with human-like understanding.',
    features: ['24/7 availability', 'Multi-language support', 'Smart routing', 'Human handoff'],
    roi: '10x faster response times',
  },
  analytics: {
    title: 'Decision Intelligence System',
    description: 'Turn your data into actionable insights with AI-powered analytics that predict trends and recommend actions.',
    features: ['Predictive analytics', 'Automated reports', 'Trend detection', 'Action recommendations'],
    roi: '3x faster decision making',
  },
};

export const SolutionQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const primaryChallenge = answers[0] as keyof typeof recommendations;
  const recommendation = recommendations[primaryChallenge] || recommendations.automation;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-primary"
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 px-2">
                {questions[currentQuestion].question}
              </h3>

              <div className="grid gap-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.value)}
                    className="p-3 sm:p-4 text-left bg-card border border-border rounded-xl hover:border-primary/50 transition-colors group min-h-[48px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg group-hover:text-primary transition-colors">
                        {option.text}
                      </span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity text-primary flex-shrink-0" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {currentQuestion > 0 && (
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Success indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="p-4 bg-primary/10 rounded-full">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
            </motion.div>

            {/* Recommendation */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent">Recommended Solution</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold px-4">
                {recommendation.title}
              </h3>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                {recommendation.description}
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
              {recommendation.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-card/50 rounded-lg border border-border"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* ROI highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 bg-gradient-card rounded-xl border border-primary/20 text-center"
            >
              <div className="text-sm text-muted-foreground mb-2">Expected Impact</div>
              <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                {recommendation.roi}
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gradient-primary shadow-glow">
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={reset}>
                Retake Quiz
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
