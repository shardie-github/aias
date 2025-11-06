export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted-foreground mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">AIAS Platform</h3>
            <p className="text-xs mb-2">AI automation that speaks Canadian business. Save 10+ hours/week with no-code AI agents.</p>
            <p className="text-xs">🇨🇦 Made in Canada • PIPEDA Compliant</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="/features" className="hover:underline">Features</a></li>
              <li><a href="/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="/integrations" className="hover:underline">Integrations</a></li>
              <li><a href="/case-studies" className="hover:underline">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/blog" className="hover:underline">Blog</a></li>
              <li><a href="/help" className="hover:underline">Help Center</a></li>
              <li><a href="/demo" className="hover:underline">Book Demo</a></li>
              <li><a href="/status" className="hover:underline">Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:underline">About</a></li>
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
          <div className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} AIAS Platform. All rights reserved. Made in Canada 🇨🇦
          </div>
        </div>
      </div>
    </footer>
  );
}
