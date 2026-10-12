"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [shared, setShared] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title, text: `Discover ${title} on CoastX`, url });
    else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    }
  }

  return <button className="detail-share" onClick={share} aria-label="Share this experience">↗ <span>{shared ? "Link copied" : "Share"}</span></button>;
}