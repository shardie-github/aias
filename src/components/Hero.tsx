import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Calculator, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated mesh background */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-mesh"
      />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        style={{ y }}
        className="container mx-auto px-4 py-32 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-accent bg-clip-text text-transparent">
                We Build Intelligent Systems That Think For You
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="block mb-2 sm:mb-4">AI Agent &</span>
              <span className="block bg-gradient-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
                Automation Consultancy
              </span>
            </h1>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4"
          >
            Stop scaling chaos. Start scaling intelligence.
            <span className="block mt-2 text-foreground/90">
              Out-of-the-box solutions or fully customized agentic workflows.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-6 sm:pt-8 px-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-primary shadow-glow text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 hover:shadow-accent transition-all group min-h-[48px]"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <Link to="/roi-calculator" className="w-full sm:w-auto">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 border-primary/30 hover:border-accent hover:text-accent bg-card/30 backdrop-blur-sm min-h-[48px]"
                >
                  <Calculator className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Calculate ROI
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Enhanced Stats with Proof Points */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-12 sm:pt-16 md:pt-24 max-w-5xl mx-auto px-4"
          >
            {[
              { value: '42+', label: 'Active Workflows', subtext: 'Across 15+ Industries', delay: 0, icon: '⚡' },
              { value: '10k+', label: 'Hours Saved', subtext: 'Monthly for Clients', delay: 0.1, icon: '⏱️' },
              { value: '24/7', label: 'AI Operations', subtext: 'Zero Downtime', delay: 0.2, icon: '🤖' },
              { value: '99.9%', label: 'Uptime', subtext: 'Enterprise SLA', delay: 0.3, icon: '🛡️' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + stat.delay }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative group"
              >
                <div className="p-4 sm:p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                  <motion.div 
                    className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"
                  />
                  <div className="relative text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-foreground mt-1">{stat.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.subtext}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="pt-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm">Explore Solutions</span>
              <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-primary rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
