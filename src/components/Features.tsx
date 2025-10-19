import { memo } from 'react';
import { Bot, Zap, Shield, Clock, BarChart, Code } from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'Advanced AI Engine',
    description: 'Powered by state-of-the-art language models for intelligent automation and insights.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time responses with optimized performance for enterprise-scale operations.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your AI assistant never sleeps, providing round-the-clock support and automation.',
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights and metrics to track performance and ROI.',
  },
  {
    icon: Code,
    title: 'API Integration',
    description: 'Seamlessly integrate with your existing tools and workflows via REST API.',
  },
];

export const Features = memo(() => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
            Powerful Features for
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Modern Enterprises
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Everything you need to supercharge your business with AI-powered automation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
