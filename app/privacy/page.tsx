// [STAKE+TRUST:BEGIN:privacy_page]
"use client";

import { readFile } from "fs/promises";
import { useEffect, useState } from "react";

export default function Privacy() {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    // Load privacy policy content
    // In production, this would fetch from a CMS or markdown file
    fetch("/docs/trust/PRIVACY_POLICY_DRAFT.md")
      .then((r) => r.text())
      .then((text) => {
        // Simple markdown to HTML conversion (basic)
        // In production, use a proper markdown library like react-markdown
        const html = text
          .replace(/^# (.*$)/gim, "<h1>$1</h1>")
          .replace(/^## (.*$)/gim, "<h2>$1</h2>")
          .replace(/^### (.*$)/gim, "<h3>$1</h3>")
          .replace(/^\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
          .replace(/^\*(.*?)\*/gim, "<em>$1</em>")
          .replace(/^- (.*$)/gim, "<li>$1</li>")
          .replace(/\n/gim, "<br/>");
        setContent(html);
      })
      .catch(() => {
        setContent(
          "<p>Privacy policy content is being loaded. Please check back soon or contact privacy@example.com for immediate inquiries.</p>"
        );
      });
  }, []);

  return (
    <div className="container py-8">
      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> This is a draft privacy policy and requires legal review before being considered legally binding.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          For privacy inquiries, contact:{" "}
          <a href="mailto:privacy@example.com" className="text-primary hover:underline">
            privacy@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:privacy_page]
