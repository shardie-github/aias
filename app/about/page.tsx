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
            AIAS Platform was founded to make AI automation accessible to Canadian businesses. 
            We believe that solo operators and small businesses shouldn't have to pay enterprise prices 
            or learn complex coding to automate their workflows.
          </p>
          <p className="text-muted-foreground mb-4">
            Our mission is to help Canadian businesses save 10+ hours per week with no-code AI agents, 
            while keeping their data in Canada and complying with Canadian privacy laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Why Canadian-First?</h2>
          <p className="text-muted-foreground mb-4">
            Most automation tools are built for US or EU markets. Canadian businesses need:
          </p>
          <ul className="space-y-2 text-muted-foreground mb-4">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Canadian integrations (Shopify, Wave, RBC, TD, Interac)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>CAD pricing with transparent GST/HST</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>PIPEDA compliance and Canadian data residency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>Canadian-friendly support hours and pricing</span>
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
                <CardTitle>Affordable Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  CAD $49/month — accessible to solo operators and small businesses.
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
                <CardTitle>Canadian Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built for Canadian businesses, with Canadian integrations and support.
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
                <strong>Support Hours:</strong> Monday-Friday, 9 AM - 5 PM EST
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
