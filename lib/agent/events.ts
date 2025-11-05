export function track(userId: string, payload: { type: string; path?: string; meta?: any; session_id?: string; app?: string }) {
  try {
    const body = JSON.stringify({ user_id: userId, session_id: payload.session_id, app: payload.app || "web", type: payload.type, path: payload.path || location?.pathname, meta: payload.meta });
    navigator.sendBeacon?.("/api/ingest", body) || fetch("/api/ingest", { method:"POST", headers:{"content-type":"application/json"}, body });
  } catch {}
}
