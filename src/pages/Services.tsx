import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Workflow, Sparkles, Settings, Zap, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Bot,
    title: 'AI Agent Development',
    description: 'Custom AI agents tailored to your specific business processes and workflows.',
    features: [
      'Custom conversational AI agents',
      'Task automation specialists',
      'Multi-modal AI capabilities',
      'Integration with existing systems',
    ],
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'End-to-end automation solutions that optimize your business operations.',
    features: [
      'Process mapping & analysis',
      'Automated workflow design',
      'Integration architecture',
      'Performance monitoring',
    ],
  },
  {
    icon: Sparkles,
    title: 'Out-of-the-Box Solutions',
    description: 'Pre-built AI agents and automation templates ready to deploy.',
    features: [
      'Customer service agents',
      'Sales automation bots',
      'HR & recruitment assistants',
      'Data processing agents',
    ],
  },
  {
    icon: Settings,
    title: 'Custom Customization',
    description: 'Tailor every aspect of your AI agents to match your brand and processes.',
    features: [
      'Brand voice & personality',
      'Custom knowledge bases',
      'Specialized training',
      'Unique business logic',
    ],
  },
  {
    icon: Zap,
    title: 'Workflow Optimization',
    description: 'Continuous improvement and optimization of your automated processes.',
    features: [
      'Performance analytics',
      'A/B testing & refinement',
      'Cost optimization',
      'Scalability planning',
    ],
  },
  {
    icon: BarChart,
    title: 'Consulting & Strategy',
    description: 'Expert guidance on AI adoption and automation strategy for your business.',
    features: [
      'AI readiness assessment',
      'ROI analysis & planning',
      'Implementation roadmap',
      'Team training & support',
    ],
  },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-hero pt-32 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              AI Agent & Automation
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                Consultancy Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your business with intelligent automation and custom AI agents designed for your unique challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/roi-calculator">
                <Button size="lg" className="bg-gradient-primary shadow-glow text-lg px-8">
                  Calculate Your ROI
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/20 hover:border-primary/40">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Our Core
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Service Offerings
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive solutions from strategy to implementation and ongoing optimization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group p-8 rounded-xl bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 rounded-lg bg-primary/10 w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-6">
              Not sure which service is right for you?
            </p>
            <Button size="lg" className="bg-gradient-primary shadow-glow">
              Get a Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
