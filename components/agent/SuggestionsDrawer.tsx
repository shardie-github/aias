"use client";
import { useEffect, useState } from "react";

type Reco = { title: string; body?: string; kind: string; score: number; rationale?: any; cta?: any };

export default function SuggestionsDrawer({ userId }: { userId: string }) {
  const [recs, setRecs] = useState<Reco[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem("privacy_choices_v2");
    if (!ok) return;
    fetch("/api/agent/suggest", { method: "POST", body: JSON.stringify({ userId }), headers: { "content-type": "application/json" } })
      .then(r => r.json()).then(d => setRecs(d.recommendations || [])).catch(() => {});
  }, [userId]);

  return (
    <>
      <button className="fixed bottom-4 right-4 rounded-full bg-accent text-accent-fg h-12 w-12 shadow-card" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="agent-drawer">★</button>
      {open && (
        <aside id="agent-drawer" className="fixed bottom-20 right-4 w-[92vw] sm:w-[420px] max-h-[70vh] overflow-auto rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="text-sm font-semibold mb-2">Suggested for you</div>
          <div className="space-y-3">
            {recs.map((r,i)=>(
              <div key={i} className="rounded-xl border border-border p-3">
                <div className="text-sm font-semibold">{r.title}</div>
                {r.body && <div className="text-xs text-muted-foreground">{r.body}</div>}
                <div className="text-[11px] mt-1 text-muted-foreground">Why: {r.rationale ? JSON.stringify(r.rationale) : "behavior signals"}</div>
                {r.cta?.href && <a className="inline-block mt-2 text-xs underline" href={r.cta.href}>{r.cta.label}</a>}
                {r.cta?.action && <button className="inline-block mt-2 text-xs underline" onClick={()=>dispatchAction(r.cta.action)}>{r.cta.label}</button>}
              </div>
            ))}
            {!recs.length && <div className="text-xs text-muted-foreground">No suggestions yet—keep exploring.</div>}
          </div>
        </aside>
      )}
    </>
  );
}

function dispatchAction(action: string){
  // Example: "enable:stability" → set local flag or call API
  if (action === "enable:stability") {
    localStorage.setItem("stability_mode","1");
    alert("Stability Mode is now ON");
  }
}
