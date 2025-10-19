import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How long does it take to implement an AI agent?',
    answer: 'Implementation timelines vary based on complexity. Simple agents can be deployed in 1-2 weeks, while comprehensive automation systems typically take 4-8 weeks including custom training and integration.',
  },
  {
    question: 'Do I need technical expertise to use your AI agents?',
    answer: 'No technical expertise required. We design intuitive interfaces and provide comprehensive training. Our agents work seamlessly with your existing tools and can be managed by non-technical team members.',
  },
  {
    question: 'What kinds of business processes can be automated?',
    answer: 'Almost any repetitive task can be automated: customer service, data entry, scheduling, invoice processing, lead qualification, report generation, HR onboarding, inventory management, and much more.',
  },
  {
    question: 'How do you ensure data security and compliance?',
    answer: 'We implement bank-level encryption, comply with SOC 2, GDPR, and HIPAA standards. All data is processed securely, and we can deploy on-premise solutions for maximum security. Regular audits and monitoring ensure ongoing compliance.',
  },
  {
    question: 'Can your AI agents integrate with our existing software?',
    answer: 'Yes! Our agents integrate with 1000+ popular business tools including Salesforce, HubSpot, Slack, Microsoft 365, Google Workspace, SAP, and more. We also build custom integrations for proprietary systems.',
  },
  {
    question: 'What kind of ROI can we expect?',
    answer: 'Typical clients see 300-500% ROI within the first year through time savings, error reduction, and increased efficiency. Use our ROI Calculator to get a personalized estimate for your business.',
  },
  {
    question: 'Do you offer ongoing support and maintenance?',
    answer: 'Absolutely. All packages include ongoing support, regular updates, performance monitoring, and optimization. We also provide training sessions and documentation to ensure your team gets maximum value.',
  },
  {
    question: 'Can AI agents be customized for our specific industry?',
    answer: 'Yes! We specialize in industry-specific customization. Our agents are trained on your unique terminology, processes, and compliance requirements, whether you\'re in healthcare, finance, retail, manufacturing, or any other sector.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Frequently Asked
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about AI automation
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={`faq-${index}`}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-gradient-card backdrop-blur-sm hover:border-primary/50 transition-all"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12 p-8 rounded-xl bg-gradient-card backdrop-blur-sm border border-border">
            <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our AI assistant is available 24/7 to answer your questions
            </p>
            <p className="text-xs text-muted-foreground">
              Note: Chat interface connects to Momen-built backend for live responses
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
