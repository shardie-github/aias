import { AIChat } from './AIChat';

export const ChatShowcase = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              Experience AI-Powered
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Conversations
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Try our intelligent assistant right now. Ask anything and see the power of advanced AI in action.
            </p>
          </div>

          {/* Chat Component */}
          <div className="max-w-3xl mx-auto">
            <AIChat />
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">&lt;100ms</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Average Response Time</div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
