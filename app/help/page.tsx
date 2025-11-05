// [STAKE+TRUST:BEGIN:help_page]
"use client";

export default function Help() {
  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-2">
          How can we help you today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Getting Started</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Account setup and onboarding</li>
            <li>• First steps guide</li>
            <li>• Feature overview</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account & Settings</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Managing your account</li>
            <li>• Privacy preferences</li>
            <li>• Security settings</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Features & Usage</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Feature guides</li>
            <li>• Best practices</li>
            <li>• Tips & tricks</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Troubleshooting</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Common issues</li>
            <li>• Error messages</li>
            <li>• Performance issues</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Still Need Help?</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Contact our support team:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@example.com" className="text-primary hover:underline">
              support@example.com
            </a>
          </li>
          <li>
            <strong>Response Time:</strong> Within 24 hours during business days
          </li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm">
          <strong>Note:</strong> Help center content is being developed. For immediate assistance, please contact support@example.com.
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:help_page]
