import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Gift, Download, Mail } from 'lucide-react';

export const LeadGenForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Success! 🎉",
        description: "Check your email for the Master System Prompts Guide PDF",
      });
      setEmail('');
      setName('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-2xl bg-gradient-card backdrop-blur-sm border border-primary/20 shadow-glow">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 mb-6">
                <Gift className="w-6 h-6 text-primary" />
                <span className="text-lg font-semibold">Free Resource</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4">
                Get Your Free
                <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  AI Agent System Prompts Guide
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
                10-page master guide on crafting perfect system prompts and fine-tuning your AI agents for maximum performance
              </p>

              <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 px-4">
                <div className="p-3 sm:p-4 rounded-lg bg-card/50">
                  <Download className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-semibold mb-1">10-Page PDF</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Comprehensive guide</div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-card/50">
                  <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-semibold mb-1">Instant Delivery</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Sent to your inbox</div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-card/50">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-semibold mb-1">Completely Free</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">No credit card</div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background/50 border-primary/20"
              />
              <Input
                type="email"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50 border-primary/20"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary shadow-glow text-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Download Free Guide'}
                <Download className="ml-2 w-5 h-5" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By subscribing, you&apos;ll also receive our weekly AI automation insights newsletter. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
