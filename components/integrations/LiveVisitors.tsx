"use client";
import { useEffect, useState } from "react";
export default function LiveVisitors() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Simulate live visitor count (replace with real-time subscription)
    const interval = setInterval(() => {
      setCount(c => Math.max(0, c + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return <div className="text-sm text-muted-foreground">👥 {count || "—"} online</div>;
}
