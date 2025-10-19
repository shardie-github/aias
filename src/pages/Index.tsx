import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { About } from '@/components/About';
import { InfoCards } from '@/components/InfoCards';
import { InteractiveProofPoints } from '@/components/InteractiveProofPoints';
import { ClientShowcase } from '@/components/ClientShowcase';
import { AutomationFlowcharts } from '@/components/AutomationFlowcharts';
import { DynamicCaseExplorer } from '@/components/DynamicCaseExplorer';
import { ThinkingPulse } from '@/components/ThinkingPulse';
import { SolutionQuiz } from '@/components/SolutionQuiz';
import { LiveActivityFeed } from '@/components/LiveActivityFeed';
import { ChatShowcase } from '@/components/ChatShowcase';
import { LeadGenForm } from '@/components/LeadGenForm';
import { FAQSection } from '@/components/FAQSection';
import { ResourceLinks } from '@/components/ResourceLinks';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { FloatingDock } from '@/components/FloatingDock';
import { BookingInterface } from '@/components/BookingInterface';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      
      {/* Thinking Pulse Innovation */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Intelligence In Motion
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Watch AI agents orchestrate workflows in real-time
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <ThinkingPulse />
            <LiveActivityFeed />
          </div>
        </div>
      </section>

      <AutomationFlowcharts />
      
      {/* Case Studies Explorer */}
      <section className="py-12 sm:py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              Proven Results
              <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
                Across Industries
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Real automation wins from clients transforming their operations
            </p>
          </motion.div>
          
          <DynamicCaseExplorer />
        </div>
      </section>

      <Features />
      
      {/* Interactive Proof Points */}
      <InteractiveProofPoints />
      
      {/* Client Showcase */}
      <ClientShowcase />
      
      {/* Info Cards with Proof Points */}
      <InfoCards />
      
      {/* About Us Section */}
      <About />
      
      {/* Solution Quiz */}
      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
              Find Your Perfect
              <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
                Automation Solution
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Answer 3 quick questions and get a personalized recommendation
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto bg-gradient-card backdrop-blur-sm border border-border rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-card">
            <SolutionQuiz />
          </div>
        </div>
      </section>

      <ChatShowcase />
      <LeadGenForm />
      
      <div id="booking">
        <BookingInterface />
      </div>
      
      <FAQSection />
      
      <div id="resources">
        <ResourceLinks />
      </div>
      
      <Footer />
      <ChatbotWidget />
      <FloatingDock onChatOpen={() => setIsChatOpen(true)} />
    </div>
  );
};

export default Index;
