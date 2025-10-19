import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, TrendingUp, Users, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ClientShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const clients = [
    { name: "TechCorp Inc.", industry: "Technology", logo: "🏢", size: "Fortune 500" },
    { name: "FinanceFlow", industry: "Financial Services", logo: "💼", size: "Enterprise" },
    { name: "ServicePro", industry: "Professional Services", logo: "⚡", size: "Mid-Market" },
    { name: "RetailMax", industry: "Retail", logo: "🛍️", size: "Enterprise" },
    { name: "HealthTech", industry: "Healthcare", logo: "🏥", size: "Fortune 500" },
    { name: "EduSoft", industry: "Education", logo: "🎓", size: "Mid-Market" }
  ];

  const caseStudies = [
    {
      client: "TechCorp Inc.",
      industry: "Technology",
      challenge: "Manual data processing taking 40+ hours weekly",
      solution: "AI-powered data pipeline automation",
      results: [
        "95% reduction in processing time",
        "$500K annual cost savings",
        "99.9% accuracy improvement"
      ],
      logo: "🏢",
      color: "text-blue-500"
    },
    {
      client: "FinanceFlow",
      industry: "Financial Services",
      challenge: "Compliance reporting consuming 60% of team time",
      solution: "Automated compliance monitoring system",
      results: [
        "80% time savings on reporting",
        "100% compliance rate maintained",
        "Real-time risk monitoring"
      ],
      logo: "💼",
      color: "text-green-500"
    },
    {
      client: "ServicePro",
      industry: "Professional Services",
      challenge: "Client onboarding taking 2+ weeks per client",
      solution: "Intelligent workflow automation platform",
      results: [
        "70% faster onboarding",
        "40% increase in client satisfaction",
        "50% reduction in manual errors"
      ],
      logo: "⚡",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Trusted by Industry
            <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
              Leaders
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From Fortune 500 companies to growing startups, see who's transforming their operations with AIAS.
          </p>
        </motion.div>

        {/* Client Logos */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {client.logo}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{client.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{client.industry}</p>
                    <Badge variant="outline" className="text-xs">
                      {client.size}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">
              Success Stories
            </h3>
            <p className="text-lg text-muted-foreground">
              Real transformations from real clients
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.client}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-2xl">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">{study.logo}</div>
                      <div>
                        <h4 className="font-bold text-lg">{study.client}</h4>
                        <p className="text-sm text-muted-foreground">{study.industry}</p>
                      </div>
                    </div>

                    {/* Challenge */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-sm mb-2 text-muted-foreground">Challenge</h5>
                      <p className="text-sm">{study.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-sm mb-2 text-muted-foreground">Solution</h5>
                      <p className="text-sm">{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <h5 className="font-semibold text-sm mb-3 text-muted-foreground">Results</h5>
                      <div className="space-y-2">
                        {study.results.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${study.color} flex-shrink-0`} />
                            <span className="text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, value: "50+", label: "Enterprise Clients" },
              { icon: TrendingUp, value: "300%", label: "Average ROI" },
              { icon: Users, value: "10k+", label: "Hours Saved" },
              { icon: Award, value: "99.9%", label: "Client Satisfaction" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center"
              >
                <Card className="bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};