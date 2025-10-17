import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { AutomationFlowcharts } from '@/components/AutomationFlowcharts';
import { ChatShowcase } from '@/components/ChatShowcase';
import { LeadGenForm } from '@/components/LeadGenForm';
import { FAQSection } from '@/components/FAQSection';
import { ResourceLinks } from '@/components/ResourceLinks';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <AutomationFlowcharts />
      <Features />
      <ChatShowcase />
      <LeadGenForm />
      <FAQSection />
      <ResourceLinks />
      <Footer />
      <ChatbotWidget />
    </div>
  );
};

export default Index;
