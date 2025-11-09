export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted-foreground mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">AIAS Platform</h3>
            <p className="text-xs mb-2">
              Systems thinking + AI automation. THE critical skill for the AI age. What makes you stand out in the job market, 
              succeed in business, and achieve optimal outcomes.
            </p>
            <p className="text-xs">🧠 Systems Thinking • 🤖 AI-Powered • 🇨🇦 Built in Canada • 🌍 Trusted Worldwide</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="/features" className="hover:underline">Features</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="/systems-thinking" className="hover:underline">Systems Thinking</a></li>
              <li><a href="/genai-content-engine" className="hover:underline">GenAI Content Engine</a></li>
              <li><a href="/integrations" className="hover:underline">Integrations</a></li>
              <li><a href="/case-studies" className="hover:underline">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="hover:underline">Blog (Daily Articles)</a></li>
              <li><a href="/rss-news" className="hover:underline">AI & Tech News Feed</a></li>
              <li><a href="/help" className="hover:underline">Help Center</a></li>
              <li><a href="/demo" className="hover:underline">Book Demo</a></li>
              <li><a href="/status" className="hover:underline">Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">About</a></li>
              <li><a href="/why-canadian" className="hover:underline">Why Canadian</a></li>
              <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
              <li><a href="/trust" className="hover:underline">Trust Center</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground mb-4">
            <a href="/trust" className="hover:underline">Trust Center</a>
            <span>·</span>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="/status" className="hover:underline">Status</a>
            <span>·</span>
            <a href="/help" className="hover:underline">Help</a>
            <span>·</span>
            <a href="mailto:support@aias-platform.com" className="hover:underline">Support</a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs">
              <span>🔒</span> PIPEDA Compliant
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs">
              <span>🛡️</span> SOC 2 (In Progress)
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs">
              <span>🇨🇦</span> Canadian Data Residency
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs">
              <span>✅</span> 99.9% Uptime SLA
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} AIAS Platform. All rights reserved. Built in Canada 🇨🇦 • Serving the World 🌍
          </div>
        </div>
      </div>
    </footer>
  );
}
