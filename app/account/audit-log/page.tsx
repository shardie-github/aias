// [STAKE+TRUST:BEGIN:audit_page]
"use client";

import { useEffect, useState } from "react";

interface AuditLogEntry {
  id: number;
  user_id: string;
  action: string;
  meta: Record<string, any>;
  ts: string;
}

export default function AuditLog() {
  const [rows, setRows] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/audit/me")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch audit log");
        return r.json();
      })
      .then((data) => {
        setRows(data.rows || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">My Audit Log</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">My Audit Log</h1>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          Unable to load audit log. Please try again later or contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Audit Log</h1>
        <p className="text-muted-foreground mt-2">
          View your personal activity log. This shows actions you've taken in the system.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No audit log entries found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your activity will appear here as you use the system.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold">Action</th>
                  <th className="px-4 py-3 text-left font-semibold">Details</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(r.ts).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{r.action}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {r.meta && Object.keys(r.meta).length > 0 ? (
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(r.meta, null, 2)}
                        </pre>
                      ) : (
                        <span className="text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This audit log shows your personal activity. It is only visible to you and is protected by Row-Level Security (RLS).
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          For questions about your audit log, contact:{" "}
          <a href="mailto:privacy@example.com" className="text-primary hover:underline">
            privacy@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:audit_page]
