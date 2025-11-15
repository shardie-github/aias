import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Testimonials } from "@/components/home/testimonials";
import { CTASection } from "@/components/home/cta-section";
import { ROICalculator } from "@/components/home/roi-calculator";
import { CaseStudyPreview } from "@/components/home/case-study-preview";
import { TrustSignals } from "@/components/home/trust-signals";
import { FAQ } from "@/components/home/faq";
import { SoftwareApplicationSchema } from "@/components/seo/structured-data";
import { FAQSchema } from "@/components/seo/structured-data";

const homepageFAQs = [
  {
    question: "What's the difference between AIAS Consultancy and AIAS Platform?",
    answer: "AIAS Consultancy builds custom AI platforms from scratch (like TokPulse and Hardonia Suite). We architect, develop, and deploy complete solutions tailored to your business. AIAS Platform is our SaaS product for businesses that want ready-made automation tools.",
  },
  {
    question: "How long does it take to build a custom AI platform?",
    answer: "Typical timelines range from 8-16 weeks depending on complexity. We provide weekly demos throughout development so you see progress every step of the way.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer: "Yes. We offer ongoing support packages including 24/7 monitoring, performance optimization, feature enhancements, bug fixes, and strategic consulting.",
  },
];

export default function HomePage() {
  return (
    <>
      <SoftwareApplicationSchema />
      <FAQSchema faqs={homepageFAQs} />
      <Hero />
      <TrustSignals />
      <CaseStudyPreview />
      <ROICalculator />
      <Features />
      <Testimonials />
      <FAQ />
      <CTASection />
    </>
  );
}
