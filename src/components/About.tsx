import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Award, Code, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const About = () => {
  const founders = [
    {
      name: "AIAS Founder",
      role: "Co-Founder & CTO",
      bio: "Leading AI innovation with 10+ years in enterprise automation and machine learning. Expert in building scalable AI systems that transform business operations.",
      credentials: [
        "AI/ML Engineering Expert",
        "Enterprise Architecture",
        "Automation Specialist",
        "Open Source Contributor"
      ],
      social: {
        github: "https://github.com/aias-founder",
        linkedin: "https://linkedin.com/in/aias-founder",
        email: "founder@aias.com"
      },
      avatar: "👨‍💻"
    },
    {
      name: "Nick Morfopos",
      role: "Co-Founder & CEO",
      bio: "Strategic visionary with deep expertise in business development and market expansion. Driving AIAS towards becoming the leading AI automation consultancy.",
      credentials: [
        "Business Strategy",
        "Market Development", 
        "Operations Leadership",
        "Growth Hacking"
      ],
      social: {
        linkedin: "https://linkedin.com/in/nickmorfopos",
        email: "nick@aias.com"
      },
      avatar: "👨‍💼"
    }
  ];

  const companyStats = [
    { icon: Building2, value: "50+", label: "Enterprise Clients", description: "Fortune 500 companies trust our solutions" },
    { icon: Code, value: "1000+", label: "Automations Built", description: "Custom workflows deployed successfully" },
    { icon: Users, value: "25+", label: "Team Members", description: "AI experts and automation specialists" },
    { icon: Award, value: "99.9%", label: "Client Satisfaction", description: "Based on post-implementation surveys" }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
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
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Meet the
            <span className="block mt-2 bg-gradient-accent bg-clip-text text-transparent">
              Visionary Team
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI pioneers and business strategists working together to revolutionize enterprise automation
          </p>
        </motion.div>

        {/* Founders Section */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {founders.map((founder, index) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="group h-full bg-gradient-card backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Avatar */}
                    <div className="text-6xl mb-4">{founder.avatar}</div>
                    
                    {/* Name and Role */}
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{founder.name}</h3>
                      <Badge variant="secondary" className="text-sm px-4 py-1">
                        {founder.role}
                      </Badge>
                    </div>

                    {/* Bio */}
                    <p className="text-muted-foreground leading-relaxed">
                      {founder.bio}
                    </p>

                    {/* Credentials */}
                    <div className="w-full">
                      <h4 className="font-semibold mb-3 text-center">Key Expertise</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {founder.credentials.map((credential, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-3 pt-4">
                      {founder.social.github && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <a href={founder.social.github} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {founder.social.linkedin && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <a href={founder.social.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {founder.social.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <a href={`mailto:${founder.social.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mb-16"
        >
          <h3 className="text-3xl font-bold mb-12">
            Our Impact in Numbers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group"
              >
                <Card className="h-full bg-gradient-card backdrop-blur-sm border border-border group-hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-card backdrop-blur-sm border border-border">
            <CardContent className="p-8 lg:p-12">
              <h3 className="text-3xl font-bold mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                To democratize AI automation for enterprises of all sizes, making intelligent workflows 
                accessible, reliable, and transformative. We believe every business deserves the power 
                of AI to scale efficiently and focus on what matters most.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Badge variant="secondary" className="px-4 py-2">Innovation First</Badge>
                <Badge variant="secondary" className="px-4 py-2">Client Success</Badge>
                <Badge variant="secondary" className="px-4 py-2">Open Source</Badge>
                <Badge variant="secondary" className="px-4 py-2">Transparency</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};