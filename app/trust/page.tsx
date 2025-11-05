// [STAKE+TRUST:BEGIN:trust_page]
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrustCenter() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load feature flags
    fetch("/api/flags/trust")
      .then((r) => r.json())
      .then((data) => setFlags(data || {}))
      .catch(() => setFlags({}));
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Trust & Transparency</h1>
      <p className="text-muted-foreground">
        Your privacy and security are our top priorities. Explore our commitment to transparency and your rights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Privacy & Data</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </li>
            {flags.export_portability && (
              <li>
                <Link href="/account/export" className="text-primary hover:underline">
                  Export My Data
                </Link>
              </li>
            )}
            {flags.audit_log && (
              <li>
                <Link href="/account/audit-log" className="text-primary hover:underline">
                  My Audit Log
                </Link>
              </li>
            )}
            {flags.data_retention_disclosure && (
              <li className="text-muted-foreground">
                Data Retention Policy
              </li>
            )}
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Security & Compliance</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/docs/trust/SECURITY.md" className="text-primary hover:underline">
                Security Documentation
              </Link>
            </li>
            <li>
              <Link href="/docs/trust/TRUST.md" className="text-primary hover:underline">
                Trust Documentation
              </Link>
            </li>
            {flags.slo_sla_docs && (
              <li>
                <Link href="/docs/trust/SLO_SLA.md" className="text-primary hover:underline">
                  SLO/SLA Details
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Service Status</h2>
          <ul className="space-y-2 text-sm">
            {flags.status_page && (
              <li>
                <Link href="/status" className="text-primary hover:underline">
                  Status & Uptime
                </Link>
              </li>
            )}
            {flags.incident_comms && (
              <li>
                <Link href="/docs/trust/STATUS.md" className="text-primary hover:underline">
                  Incident Communication
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Support & Resources</h2>
          <ul className="space-y-2 text-sm">
            {flags.help_center && (
              <li>
                <Link href="/help" className="text-primary hover:underline">
                  Help Center
                </Link>
              </li>
            )}
            <li className="text-muted-foreground">
              Contact: support@example.com
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Under GDPR, PIPEDA, and similar regulations, you have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data in a machine-readable format</li>
          <li>Object to certain types of processing</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          For data subject rights requests, contact:{" "}
          <a href="mailto:privacy@example.com" className="text-primary hover:underline">
            privacy@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:trust_page]
