import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About — AIAS Platform | Made in Canada",
  description: "AIAS Platform is built for Canadian businesses. Learn about our mission to make AI automation accessible to Canadian SMBs and solo operators.",
};

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About AIAS Platform
          </h1>
          <p className="text-lg text-muted-foreground">
            AI automation that speaks Canadian business. Made in Canada 🇨🇦
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            AIAS Platform was founded in Canada with a global vision. Built on years of experience supporting 
            stakeholders across education, healthcare, technology, and business sectors worldwide, we understand 
            the unique challenges of operating across different markets, cultures, and regulatory environments.
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is to make AI automation accessible to businesses everywhere—from solo entrepreneurs to 
            global enterprises. We believe that automation shouldn't be limited by geography, currency, or technical 
            expertise. That's why we've built a platform that works seamlessly across North America, Europe, 
            Asia-Pacific, and beyond.
          </p>
          <p className="text-muted-foreground mb-4">
            With deep roots in education and stakeholder management, we've seen first-hand how automation can 
            transform workflows across industries. Whether you're managing educational programs, healthcare operations, 
            or business processes, AIAS Platform adapts to your needs—no matter where you are in the world.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Built in Canada, Designed for the World</h2>
          <p className="text-muted-foreground mb-4">
            Our Canadian roots give us a unique perspective on global business needs. We understand the importance of 
            strong privacy laws (PIPEDA), transparent pricing, and reliable service. But we also know that businesses 
            operate across borders, currencies, and cultures.
          </p>
          <p className="text-muted-foreground mb-4">
            That's why AIAS Platform combines:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Canadian Excellence:</strong> PIPEDA compliance, Canadian data residency options, transparent pricing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Global Reach:</strong> Multi-currency support (CAD, USD, EUR, GBP, AUD, and more), 100+ international integrations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Universal Compliance:</strong> GDPR, PIPEDA, SOC 2, and regional data residency options</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Market Understanding:</strong> Built by someone with experience in education and stakeholder management across global markets</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>24/7 Global Support:</strong> Support teams across time zones to serve you wherever you are</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  PIPEDA compliance, Canadian data residency, transparent privacy policies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multi-Currency Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Starting at $49/month (CAD/USD/EUR) — accessible globally with transparent pricing in your local currency.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>No-Code First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build AI agents without coding. 30-minute setup. Deploy in minutes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Global Perspective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built in Canada with global perspective. Serving businesses across 40+ countries with multi-currency and international integrations.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@aias-platform.com" className="text-primary hover:underline">
                  support@aias-platform.com
                </a>
              </p>
              <p>
                <strong>Sales:</strong>{" "}
                <a href="mailto:sales@aias-platform.com" className="text-primary hover:underline">
                  sales@aias-platform.com
                </a>
              </p>
              <p>
                <strong>Support Hours:</strong> 24/7 global support (primary: Monday-Friday, 9 AM - 5 PM EST)
              </p>
              <p>
                <strong>Global Reach:</strong> Serving clients across North America, Europe, Asia-Pacific, and beyond
              </p>
              <p>
                <strong>Phone:</strong> 1-800-AIAS-HELP (toll-free Canada)
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
