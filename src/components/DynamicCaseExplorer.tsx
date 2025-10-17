import { motion } from 'framer-motion';
import { useState } from 'react';
import { Zap, TrendingUp, Users, Database, MessageSquare, FileText } from 'lucide-react';

const cases = [
  {
    icon: MessageSquare,
    title: 'Customer Support Automation',
    industry: 'E-commerce',
    metric: '85% ticket reduction',
    description: 'AI agent handles tier-1 support inquiries, reducing response time from hours to seconds.',
    tags: ['Chatbot', 'NLP', 'Workflow'],
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    icon: FileText,
    title: 'Invoice Processing System',
    industry: 'Finance',
    metric: '40 hrs saved/week',
    description: 'Automated invoice extraction, validation, and routing across multiple departments.',
    tags: ['OCR', 'Automation', 'Integration'],
    gradient: 'from-purple-500 to-pink-400',
  },
  {
    icon: Users,
    title: 'Lead Qualification Agent',
    industry: 'B2B SaaS',
    metric: '94% accuracy',
    description: 'AI scores and routes leads automatically, prioritizing high-value prospects.',
    tags: ['ML', 'CRM', 'Sales'],
    gradient: 'from-green-500 to-emerald-400',
  },
  {
    icon: Database,
    title: 'Data Pipeline Optimization',
    industry: 'Healthcare',
    metric: '3x faster processing',
    description: 'Intelligent data aggregation from 12+ sources with real-time validation.',
    tags: ['ETL', 'Integration', 'Analytics'],
    gradient: 'from-orange-500 to-red-400',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics Dashboard',
    industry: 'Retail',
    metric: '22% revenue increase',
    description: 'AI-powered forecasting system predicting inventory needs and sales trends.',
    tags: ['ML', 'Forecasting', 'BI'],
    gradient: 'from-yellow-500 to-amber-400',
  },
  {
    icon: Zap,
    title: 'Workflow Orchestration Platform',
    industry: 'Manufacturing',
    metric: '60% process efficiency',
    description: 'Multi-system automation coordinating supply chain and production scheduling.',
    tags: ['Automation', 'Integration', 'IoT'],
    gradient: 'from-indigo-500 to-purple-400',
  },
];

export const DynamicCaseExplorer = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cases.map((caseStudy, index) => {
        const isActive = activeIndex === index;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setActiveIndex(index)}
            onHoverEnd={() => setActiveIndex(null)}
            className="relative"
          >
            <motion.div
              animate={{
                scale: isActive ? 1.05 : 1,
                y: isActive ? -8 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="h-full bg-card border border-border rounded-2xl p-6 shadow-card hover:shadow-glow transition-shadow cursor-pointer overflow-hidden"
            >
              {/* Gradient overlay */}
              <motion.div
                animate={{ opacity: isActive ? 0.1 : 0 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 bg-gradient-to-br ${caseStudy.gradient}`}
              />

              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div className={`p-3 bg-gradient-to-br ${caseStudy.gradient} rounded-xl w-fit`}>
                  <caseStudy.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold line-clamp-2">{caseStudy.title}</h3>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    {caseStudy.industry}
                  </div>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-foreground/80 mb-4">
                      {caseStudy.description}
                    </p>
                  </motion.div>
                </div>

                {/* Metric */}
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                    {caseStudy.metric}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Key Result</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {caseStudy.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                animate={{
                  opacity: isActive ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${caseStudy.gradient} opacity-50`}
                style={{ padding: '2px' }}
              >
                <div className="w-full h-full bg-card rounded-2xl" />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
