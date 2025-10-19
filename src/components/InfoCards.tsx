import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Users, Star, CheckCircle, Zap, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const InfoCards = () => {
  const proofPoints = [
    {
      icon: TrendingUp,
      title: "300% Average ROI",
      description: "Clients see 3x return on investment within 6 months",
      metric: "6 months",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "80% Time Savings",
      description: "Automated workflows reduce manual work by 80%",
      metric: "80%",
      color: "text-blue-500"
    },
    {
      icon: DollarSign,
      title: "$2M+ Saved",
      description: "Combined operational cost savings for our clients",
      metric: "$2M+",
      color: "text-emerald-500"
    },
    {
      icon: Users,
      title: "50+ Enterprises",
      description: "Fortune 500 companies trust our solutions",
      metric: "50+",
      color: "text-purple-500"
    }
  ];

  const testimonials = [
    {
      quote: "AIAS transformed our entire workflow. What used to take our team 40 hours now takes 2 hours with their AI automation.",
      author: "Sarah Chen",
      role: "VP of Operations",
      company: "TechCorp Inc.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      quote: "The ROI was immediate. We saved $500K in the first quarter alone. Best investment we've made in years.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "FinanceFlow",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      quote: "Their AI agents work 24/7 without breaks. Our customer satisfaction increased by 40% since implementation.",
      author: "Emily Johnson",
      role: "Head of Customer Success",
      company: "ServicePro",
      rating: 5,
      avatar: "👩‍🎓"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Deploy in 24 hours, not months",
      highlight: "24h"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2, GDPR, HIPAA compliant",
      highlight: "SOC 2"
    },
    {
      icon: CheckCircle,
      title: "99.9% Uptime",
      description: "Reliable operations guaranteed",
      highlight: "99.9%"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Proof Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Proven Results
              <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
                That Speak for Themselves
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real metrics from real clients. See why enterprises choose AIAS for their automation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proofPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <CardContent className="p-6 text-center">
                    <div className={`p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors`}>
                      <point.icon className={`w-8 h-8 ${point.color}`} />
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${point.color}`}>
                      {point.metric}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              What Our Clients
              <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
                Are Saying
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Hear from the leaders who've transformed their businesses with AIAS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground mb-6 italic">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Why Choose
              <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
                AIAS?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine cutting-edge AI technology with enterprise-grade reliability and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                      {feature.highlight}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
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