import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Testimonials } from "@/components/home/testimonials";
import { CTASection } from "@/components/home/cta-section";
import { ROICalculator } from "@/components/home/roi-calculator";
import { CaseStudyPreview } from "@/components/home/case-study-preview";
import { SoftwareApplicationSchema } from "@/components/seo/structured-data";

export default function HomePage() {
  return (
    <>
      <SoftwareApplicationSchema />
      <Hero />
      <ROICalculator />
      <Features />
      <CaseStudyPreview />
      <CTASection />
      <Testimonials />
    </>
  );
}
