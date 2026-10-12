"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { experiences } from "@/data/experiences";
import { MobileNav, SiteHeader } from "@/components/site-chrome";

export default function MapPage() {
  const [selected, setSelected] = useState(experiences[0]);
  const [radius, setRadius] = useState("25 km");
  return <main className="inner-page"><SiteHeader /><section className="map-page"><div className="map-page-heading"><div><span className="eyebrow">THE COAST, IN CONTEXT</span><h1>Follow the <em>shoreline.</em></h1><p>Browse experiences by place and find your own stretch of coast.</p></div><label>WITHIN <select value={radius} onChange={(event) => setRadius(event.target.value)}><option>5 km</option><option>10 km</option><option>25 km</option><option>50 km</option><option>100 km</option></select></label></div><div className="full-map"><div className="map-water-label">ARABIAN SEA</div><div className="map-coastline" /><span className="map-city">MANGALURU</span><span className="map-road road-one" /><span className="map-road road-two" />{experiences.slice(0, 10).map((item, index) => <button key={item.slug} className={`map-pin pin-${index % 7} ${selected.slug === item.slug ? "pin-active" : ""}`} onClick={() => setSelected(item)}><i />{item.location}</button>)}<Link className="map-experience-card" href={`/experiences/${selected.slug}`}><div style={{ backgroundImage: `url(https://images.unsplash.com/${selected.image}?auto=format&fit=crop&w=500&q=78)` }} /><span><small>{selected.location} · ★ {selected.rating}</small><strong>{selected.title}</strong><b>From ₹{selected.price.toLocaleString("en-IN")} / person <ArrowUpRight size={14} /></b></span></Link><span className="map-label"><MapPin size={12} /> MANGALURU & DAKSHINA KANNADA · ILLUSTRATIVE MAP</span></div><p className="map-note">Map view is a local demo illustration. Connect a production map provider to enable geographic coordinates, turn-by-turn directions and distance-based filtering.</p></section><MobileNav /></main>;
}