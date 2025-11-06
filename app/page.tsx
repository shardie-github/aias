import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Testimonials } from "@/components/home/testimonials";
import { SoftwareApplicationSchema } from "@/components/seo/structured-data";

export default function HomePage() {
  return (
    <>
      <SoftwareApplicationSchema />
      <Hero />
      <Features />
      <Testimonials />
    </>
  );
}
