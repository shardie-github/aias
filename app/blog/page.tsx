import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AIAS Platform | Canadian Business Automation",
  description: "Learn about AI automation, workflow optimization, and Canadian business tools. Tips, tutorials, and case studies for Canadian businesses.",
};

const blogPosts = [
  {
    title: "How Canadian E-Commerce Stores Save 10+ Hours with AI Automation",
    excerpt: "Learn how Canadian e-commerce businesses use AIAS Platform to automate order processing, customer support, and inventory management.",
    date: "2024-01-15",
    category: "E-Commerce",
    slug: "canadian-ecommerce-automation",
  },
  {
    title: "5 Canadian Tools Every Small Business Should Automate",
    excerpt: "Shopify, Wave Accounting, Stripe CAD, and more. Discover which Canadian business tools deliver the biggest ROI when automated.",
    date: "2024-01-10",
    category: "Automation",
    slug: "canadian-tools-automation",
  },
  {
    title: "PIPEDA Compliance: What Canadian Businesses Need to Know",
    excerpt: "Understanding PIPEDA compliance for SaaS tools. How AIAS Platform keeps your data in Canada and complies with Canadian privacy laws.",
    date: "2024-01-05",
    category: "Compliance",
    slug: "pipeda-compliance-guide",
  },
  {
    title: "No-Code AI Agents: The Future of Business Automation",
    excerpt: "Why no-code AI agents are replacing traditional automation tools. How context-aware AI understands your business better than rule-based workflows.",
    date: "2024-01-01",
    category: "AI",
    slug: "no-code-ai-agents",
  },
];

export default function BlogPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Canadian Business Automation Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tips, tutorials, and case studies for Canadian businesses automating with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-sm text-muted-foreground mb-2">
                {post.category} • {new Date(post.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })}
              </div>
              <CardTitle className="text-xl">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary hover:underline text-sm font-medium"
              >
                Read more →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          More articles coming soon. Subscribe to get notified.
        </p>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Stay Updated</CardTitle>
            <CardDescription>
              Get the latest tips and case studies delivered to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-md"
              />
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Subscribe
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
