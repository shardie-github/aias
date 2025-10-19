import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: 'per month',
    description: 'Perfect for small teams getting started',
    features: [
      '1,000 AI requests/month',
      'Basic analytics',
      'Email support',
      'API access',
      '5 team members',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    description: 'For growing businesses with advanced needs',
    features: [
      '10,000 AI requests/month',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'Tailored solutions for large organizations',
    features: [
      'Unlimited AI requests',
      'Custom analytics',
      '24/7 phone support',
      'API access',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment',
    ],
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-4">
            Simple, Transparent
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-6 sm:p-8 rounded-xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-card backdrop-blur-sm border-primary shadow-glow sm:scale-105'
                  : 'bg-gradient-card backdrop-blur-sm border-border hover:border-primary/50'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-gradient-primary text-sm font-medium text-primary-foreground shadow-glow">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-primary shadow-glow'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  size="lg"
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
