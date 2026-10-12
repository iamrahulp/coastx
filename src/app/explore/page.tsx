"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, List, Map as MapIcon, Search, SlidersHorizontal } from "lucide-react";
import { categories, experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/experience-card";
import { MobileNav, SiteHeader } from "@/components/site-chrome";

const mapSpots = ["Sasihithlu", "Mulki", "Surathkal", "Mangaluru", "Ullal", "Moodbidri", "Bantwal"];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All coastal Karnataka");
  const [category, setCategory] = useState("All experiences");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [minRating, setMinRating] = useState("Any rating");
  const [sort, setSort] = useState("Recommended");
  const [view, setView] = useState<"list" | "map">("list");
  const [radius, setRadius] = useState("25 km");
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("coastx-wishlist");
      if (stored) setSaved(JSON.parse(stored) as string[]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => {
    const results = experiences.filter((item) => {
      const matchesSearch = `${item.title} ${item.location} ${item.category}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All experiences" || item.category === category;
      const matchesLocation = location === "All coastal Karnataka" || item.location.toLowerCase().includes(location.toLowerCase());
      const matchesRating = minRating === "Any rating" || item.rating >= Number(minRating);
      return matchesSearch && matchesCategory && matchesLocation && matchesRating && item.price <= maxPrice;
    });
    if (sort === "Price low to high") results.sort((a, b) => a.price - b.price);
    if (sort === "Price high to low") results.sort((a, b) => b.price - a.price);
    if (sort === "Highest rated") results.sort((a, b) => b.rating - a.rating);
    if (sort === "Most reviewed") results.sort((a, b) => b.reviews - a.reviews);
    return results;
  }, [category, location, maxPrice, minRating, query, sort]);

  function toggleSaved(slug: string) {
    const next = saved.includes(slug) ? saved.filter((item) => item !== slug) : [...saved, slug];
    setSaved(next);
    window.localStorage.setItem("coastx-wishlist", JSON.stringify(next));
  }

  return <main className="inner-page"><SiteHeader /><section className="explore-intro"><div><span className="eyebrow">COASTAL KARNATAKA · {filtered.length} EXPERIENCES</span><h1>Find your way <em>out there.</em></h1><p>Good people, local knowledge, and a coastline full of ways to spend the day.</p></div><Link className="text-arrow" href="/plan">Plan my day <span>↗</span></Link></section>
    <div className="explore-tools"><label className="explore-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search experiences, places, things to do" /></label><div className="tool-control"><MapIcon size={14} /><select aria-label="Filter by location" value={location} onChange={(event) => setLocation(event.target.value)}><option>All coastal Karnataka</option><option>Mangaluru</option><option>Mulki</option><option>Sasihithlu</option><option>Surathkal</option><option>Moodbidri</option><option>Bantwal</option><option>Ullal</option></select></div><div className="tool-control"><SlidersHorizontal size={14} /><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><label className="tool-control price-filter">UP TO ₹{maxPrice.toLocaleString("en-IN")}<input aria-label="Maximum price per person" type="range" min="399" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></label><div className="tool-control"><select aria-label="Minimum rating" value={minRating} onChange={(event) => setMinRating(event.target.value)}><option>Any rating</option><option value="4.7">4.7+ rating</option><option value="4.8">4.8+ rating</option><option value="4.9">4.9+ rating</option></select></div></div>
    <div className="explore-result-bar"><span>{filtered.length} experiences to explore</span><div className="result-controls"><label><ArrowDownUp size={14} /><select aria-label="Sort experiences" value={sort} onChange={(event) => setSort(event.target.value)}><option>Recommended</option><option>Most reviewed</option><option>Highest rated</option><option>Price low to high</option><option>Price high to low</option></select></label><div className="view-toggle"><button className={view === "list" ? "selected" : ""} onClick={() => setView("list")} aria-label="Grid view"><List size={16} /></button><button className={view === "map" ? "selected" : ""} onClick={() => setView("map")} aria-label="Map view"><MapIcon size={16} /></button></div></div></div>
    <div className={`explore-content ${view === "map" ? "map-mode" : ""}`}>
      {view === "map" && <aside className="map-panel"><div className="map-water-label">ARABIAN SEA</div><div className="map-coastline" /><span className="map-city">MANGALURU</span><span className="map-road road-one" /><span className="map-road road-two" />{mapSpots.map((spot, index) => <button key={spot} className={`map-pin pin-${index}`} onClick={() => setQuery(spot)} title={`Show ${spot} experiences`}><i />{spot}</button>)}<div className="map-radius"><span>WITHIN</span><select aria-label="Distance radius" value={radius} onChange={(event) => setRadius(event.target.value)}><option>5 km</option><option>10 km</option><option>25 km</option><option>50 km</option><option>100 km</option></select></div><span className="map-attribution">Illustrative demo map · Mangaluru coast</span></aside>}
      <div className="explore-grid">{filtered.length ? filtered.map((experience) => <ExperienceCard key={experience.slug} experience={experience} saved={saved.includes(experience.slug)} onSave={() => toggleSaved(experience.slug)} />) : <div className="empty-results"><span>No experiences match those filters.</span><button onClick={() => { setQuery(""); setCategory("All experiences"); setLocation("All coastal Karnataka"); setMaxPrice(5000); setMinRating("Any rating"); }}>Reset filters ↗</button></div>}</div>
    </div><MobileNav /></main>;
}