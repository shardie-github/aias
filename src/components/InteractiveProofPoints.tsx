import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { TrendingUp, Users, DollarSign, Clock, Zap, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const InteractiveProofPoints = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const proofPoints = [
    {
      icon: TrendingUp,
      value: "300%",
      label: "Average ROI",
      description: "Clients see 3x return on investment within 6 months",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      delay: 0
    },
    {
      icon: Clock,
      value: "80%",
      label: "Time Saved",
      description: "Automated workflows reduce manual work by 80%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      delay: 0.1
    },
    {
      icon: DollarSign,
      value: "$2M+",
      label: "Cost Savings",
      description: "Combined operational cost savings for our clients",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      delay: 0.2
    },
    {
      icon: Users,
      value: "50+",
      label: "Enterprise Clients",
      description: "Fortune 500 companies trust our solutions",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      delay: 0.3
    },
    {
      icon: Zap,
      value: "24h",
      label: "Deployment",
      description: "Rapid deployment in 24 hours, not months",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      delay: 0.4
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime",
      description: "Enterprise-grade reliability and security",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      delay: 0.5
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Numbers That
            <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
              Don't Lie
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real results from real clients. See why enterprises choose AIAS for their automation needs.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {proofPoints.map((point, index) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                scale: 1 
              } : {}}
              transition={{ 
                duration: 0.6, 
                delay: point.delay,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -10,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className="group cursor-pointer"
            >
              <Card className={`h-full bg-gradient-card backdrop-blur-sm border ${point.borderColor} hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 ${hoveredCard === index ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 ${point.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    initial={{ scale: 0 }}
                    animate={hoveredCard === index ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Icon */}
                  <motion.div
                    className={`relative z-10 p-4 rounded-full ${point.bgColor} w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <point.icon className={`w-8 h-8 ${point.color}`} />
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    className={`relative z-10 text-4xl font-bold ${point.color} mb-2`}
                    animate={hoveredCard === index ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {point.value}
                  </motion.div>

                  {/* Label */}
                  <h3 className="relative z-10 text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {point.label}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">
                    {point.description}
                  </p>

                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 group-hover:opacity-100"
                    initial={{ scale: 0.8 }}
                    animate={hoveredCard === index ? { scale: 1 } : { scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Pulse Effect */}
                  {hoveredCard === index && (
                    <motion.div
                      className="absolute inset-0 rounded-lg border-2 border-primary/40"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-primary/10 border border-primary/20 hover:bg-gradient-primary/20 transition-all duration-300 group cursor-pointer">
            <CheckCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-primary">
              Ready to achieve these results for your business?
            </span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary"
            >
              →
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};