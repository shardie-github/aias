import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { AIChat } from './AIChat';

const agentSkills = [
  'Answer product questions',
  'Schedule consultations',
  'Calculate ROI estimates',
  'Recommend solutions',
  'Provide case studies',
  'Guide automation setup',
];

export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSkills, setShowSkills] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            {/* Skills Popup */}
            {showSkills && (
              <div className="absolute bottom-full right-0 mb-4 w-72 p-4 rounded-xl bg-card border border-primary/20 shadow-glow animate-slide-in">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold">I can help you with:</h4>
                </div>
                <ul className="space-y-2">
                  {agentSkills.map((skill, index) => (
                    <li key={`skill-${index}`} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <Button
              onClick={() => setIsOpen(true)}
              onMouseEnter={() => setShowSkills(true)}
              onMouseLeave={() => setShowSkills(false)}
              size="lg"
              className="h-16 w-16 rounded-full bg-gradient-primary shadow-glow hover:shadow-xl transition-all animate-float"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] rounded-xl bg-card border border-primary/20 shadow-glow overflow-hidden flex flex-col animate-slide-in">
          {/* Header */}
          <div className="p-4 bg-gradient-primary border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground">AIAS Assistant</h3>
                <p className="text-xs text-primary-foreground/80">AI Automation Expert</p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <AIChat />
          </div>
        </div>
      )}
    </>
  );
};
