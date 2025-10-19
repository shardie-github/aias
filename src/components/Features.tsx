import { Bot, Zap, Shield, Clock, BarChart, Code, Brain, Workflow, Database, Globe, Lock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Bot,
    title: 'Advanced AI Engine',
    description: 'Powered by state-of-the-art language models for intelligent automation and insights.',
    highlight: 'GPT-4 Powered',
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Real-time responses with optimized performance for enterprise-scale operations.',
    highlight: '< 100ms',
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.',
    highlight: 'SOC 2',
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Your AI assistant never sleeps, providing round-the-clock support and automation.',
    highlight: '99.9% Uptime',
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-pink-500/20'
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights and metrics to track performance and ROI.',
    highlight: 'Real-time',
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/20'
  },
  {
    icon: Code,
    title: 'API Integration',
    description: 'Seamlessly integrate with your existing tools and workflows via REST API.',
    highlight: '100+ APIs',
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-rose-500/20'
  },
  {
    icon: Brain,
    title: 'Machine Learning',
    description: 'Self-improving algorithms that learn from your data and optimize over time.',
    highlight: 'Self-Learning',
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20'
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Create complex multi-step workflows with drag-and-drop visual builder.',
    highlight: 'Visual Builder',
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-yellow-500/20'
  },
  {
    icon: Database,
    title: 'Data Processing',
    description: 'Handle massive datasets with advanced processing and real-time analytics.',
    highlight: 'Big Data',
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold px-4">
            Powerful Features for
            <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
              Modern Enterprises
            </span>
          </h2>
          <p className="text-xl text-muted-foreground px-4">
            Everything you need to supercharge your business with AI-powered automation
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon and Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                      {feature.highlight}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Indicator */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-primary/10 border border-primary/20">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Ready to see these features in action?
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
