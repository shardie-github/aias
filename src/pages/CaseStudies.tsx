import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

const caseStudies = [
  {
    company: 'TechCorp Solutions',
    industry: 'SaaS',
    challenge: 'Manual customer onboarding taking 5-7 days, high support ticket volume',
    solution: 'Deployed custom AI onboarding agent and automated support bot',
    results: [
      { metric: 'Onboarding Time', value: '92%', icon: Clock, color: 'text-primary' },
      { metric: 'Cost Savings', value: '$180K', icon: DollarSign, color: 'text-green-500' },
      { metric: 'Customer Satisfaction', value: '+45%', icon: TrendingUp, color: 'text-blue-500' },
      { metric: 'Support Staff Freed', value: '8 FTE', icon: Users, color: 'text-purple-500' },
    ],
    testimonial: "AIAS transformed our customer onboarding from a bottleneck into a competitive advantage. The AI agents they built understand our product better than some of our team members.",
    author: 'Sarah Chen',
    position: 'VP of Customer Success',
  },
  {
    company: 'RetailMax Inc.',
    industry: 'E-commerce',
    challenge: 'Inventory management inefficiencies and high cart abandonment rates',
    solution: 'Implemented AI inventory optimizer and conversational shopping assistant',
    results: [
      { metric: 'Inventory Costs', value: '-38%', icon: DollarSign, color: 'text-green-500' },
      { metric: 'Cart Abandonment', value: '-62%', icon: TrendingUp, color: 'text-primary' },
      { metric: 'Processing Time', value: '85%', icon: Clock, color: 'text-blue-500' },
      { metric: 'Revenue Increase', value: '+$2.4M', icon: DollarSign, color: 'text-green-500' },
    ],
    testimonial: "The ROI was immediate. Within 3 months, we saw dramatic improvements in both operational efficiency and sales conversion. The AI shopping assistant feels like having 100 expert sales reps available 24/7.",
    author: 'Michael Rodriguez',
    position: 'COO',
  },
  {
    company: 'HealthFirst Medical',
    industry: 'Healthcare',
    challenge: 'Administrative burden on staff, appointment scheduling bottlenecks',
    solution: 'Custom HIPAA-compliant AI scheduling agent and administrative assistant',
    results: [
      { metric: 'Admin Time Saved', value: '70%', icon: Clock, color: 'text-blue-500' },
      { metric: 'Appointment Errors', value: '-95%', icon: TrendingUp, color: 'text-primary' },
      { metric: 'Patient Satisfaction', value: '+58%', icon: Users, color: 'text-purple-500' },
      { metric: 'Cost Reduction', value: '$320K', icon: DollarSign, color: 'text-green-500' },
    ],
    testimonial: "AIAS delivered a solution that met all our strict compliance requirements while dramatically improving patient experience. Our staff can now focus on patient care instead of paperwork.",
    author: 'Dr. Emily Watson',
    position: 'Chief Medical Officer',
  },
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-hero pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Client Success
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Real results from businesses that transformed with AI automation
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-24">
            {caseStudies.map((study, index) => (
              <div
                key={study.company}
                className="space-y-8"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Company Header */}
                <div className="border-l-4 border-primary pl-6">
                  <div className="text-sm text-primary font-semibold mb-2">{study.industry}</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{study.company}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-destructive">Challenge</h3>
                      <p className="text-muted-foreground">{study.challenge}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-primary">Solution</h3>
                      <p className="text-muted-foreground">{study.solution}</p>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  {study.results.map((result) => (
                    <div
                      key={result.metric}
                      className="p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all"
                    >
                      <result.icon className={`w-8 h-8 ${result.color} mb-4`} />
                      <div className="text-3xl font-bold mb-2">{result.value}</div>
                      <div className="text-sm text-muted-foreground">{result.metric}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="p-8 rounded-xl bg-gradient-card backdrop-blur-sm border border-primary/20">
                  <blockquote className="text-lg italic mb-4">
                    &ldquo;{study.testimonial}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold">{study.author.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{study.author}</div>
                      <div className="text-sm text-muted-foreground">{study.position}, {study.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-24 p-12 rounded-xl bg-gradient-card backdrop-blur-sm border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of businesses achieving exceptional results with AI automation
            </p>
            <Button size="lg" className="bg-gradient-primary shadow-glow text-lg px-8">
              Schedule Your Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
