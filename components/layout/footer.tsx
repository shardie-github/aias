export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted-foreground mt-auto">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Hardonia</h3>
            <p className="text-xs">Modern, fast, and accessible commerce experience.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><a href="/shop" className="hover:underline">All Products</a></li>
              <li><a href="/shop/new" className="hover:underline">New Arrivals</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="hover:underline">Help Center</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:underline">Privacy</a></li>
              <li><a href="/terms" className="hover:underline">Terms</a></li>
            </ul>
          </div>
        </div>
        {/* [STAKE+TRUST:BEGIN:trust_links] */}
        {/* Trust & Transparency links - visible when feature flags enabled */}
        {/* TODO: Load flags from API or context to conditionally show */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <a href="/trust" className="hover:underline">Trust Center</a>
            <span>·</span>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="/status" className="hover:underline">Status</a>
            <span>·</span>
            <a href="/help" className="hover:underline">Help</a>
          </div>
        </div>
        {/* [STAKE+TRUST:END:trust_links] */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hardonia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
