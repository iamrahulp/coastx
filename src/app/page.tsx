"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { categories, experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/experience-card";
import { MobileNav, SiteFooter, SiteHeader } from "@/components/site-chrome";

const categoryTiles = [
  { name: "Water", image: "photo-1472745942893-4b9f730c7668" },
  { name: "Adventure", image: "photo-1432405972618-c60b0225b8f9" },
  { name: "Nature", image: "photo-1472396961693-142e6e269027" },
  { name: "Food", image: "photo-1555939594-58d7cb561ad1" },
  { name: "Culture", image: "photo-1513364776144-60967b0f800f" },
  { name: "Wellness", image: "photo-1506126613408-eca07ce68773" },
];

const destinations = [
  { name: "Mangaluru", count: 14, image: "photo-1500375592092-40eb2168fd21" },
  { name: "Mulki", count: 8, image: "photo-1472745942893-4b9f730c7668" },
  { name: "Udupi", count: 6, image: "photo-1518837695005-2083093ee35b" },
  { name: "Gokarna", count: 9, image: "photo-1502680390469-be75c86b636f" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Mangaluru & nearby");
  const [category, setCategory] = useState("All experiences");
  const [saved, setSaved] = useState<string[]>([]);
  const [guests, setGuests] = useState(2);
  const [activity, setActivity] = useState("Any experience");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem("coastx-wishlist");
      if (stored) setSaved(JSON.parse(stored) as string[]);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const filtered = useMemo(() => experiences.filter((experience) => {
    const selectedCategory = activity === "Any experience" ? category : activity;
    const matchesCategory = selectedCategory === "All experiences" || experience.category === selectedCategory;
    const searchText = `${experience.title} ${experience.location} ${experience.category}`.toLowerCase();
    const matchesLocation = location === "Mangaluru & nearby" || experience.location.toLowerCase().includes(location.toLowerCase());
    return matchesCategory && matchesLocation && searchText.includes(query.toLowerCase());
  }), [activity, category, location, query]);

  function toggleSaved(slug: string) {
    const next = saved.includes(slug) ? saved.filter((item) => item !== slug) : [...saved, slug];
    setSaved(next);
    window.localStorage.setItem("coastx-wishlist", JSON.stringify(next));
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <SiteHeader overlay />

      <section className="hero" id="discover">
        <div className="hero-photo" role="img" aria-label="A surfer watches the morning swell along the coast" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow light-eyebrow hero-location"><i /> MANGALURU <span>•</span> COASTAL KARNATAKA</span>
          <h1><span>DON&apos;T JUST</span><span>VISIT THE COAST.</span><em>Experience it.</em></h1>
          <p>Discover extraordinary adventures, culture, food and hidden experiences across coastal Karnataka.</p>
          <div className="hero-actions"><button className="hero-cta" onClick={() => scrollTo("experiences")}>Explore experiences <span>↗</span></button><Link href="/plan" className="hero-secondary">Plan my weekend <ArrowRight size={14} /></Link></div>
        </div>
        <button className="scroll-cue" onClick={() => scrollTo("experiences")}><span>EXPLORE THE COAST</span><i /></button>
        <div className="hero-caption"><span>13° 00′ N&nbsp; 74° 49′ E</span><span>THE COAST, A LITTLE CLOSER</span></div>
      </section>

      <section className="search-band" aria-label="Find an experience">
        <div className="search-prompt"><span className="search-symbol">⌕</span><label htmlFor="experience-search">EXPERIENCE</label><input id="experience-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Surf, kayak, slow down..." /></div>
        <label className="search-field"><span>WHERE</span><select aria-label="Choose location" value={location} onChange={(event) => setLocation(event.target.value)}><option>Mangaluru & nearby</option><option>Mulki</option><option>Sasihithlu</option><option>Surathkal</option><option>Moodbidri</option><option>Bantwal</option><option>Ullal</option></select></label>
        <label className="search-field"><span>WHEN</span><input type="date" aria-label="Choose date" /></label>
        <label className="search-field search-guests"><span>WHO</span><select aria-label="Number of guests" value={guests} onChange={(event) => setGuests(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
        <label className="search-field search-activity"><span>MOOD</span><select aria-label="Experience category" value={activity} onChange={(event) => setActivity(event.target.value)}><option>Any experience</option>{categories.filter((item) => item !== "All experiences").map((item) => <option key={item}>{item}</option>)}</select></label>
        <button className="search-submit" onClick={() => scrollTo("experiences")}><span>Explore</span><b>↗</b></button>
      </section>

      <section className="collection-section" id="experiences">
        <div className="section-heading">
          <div><span className="eyebrow">MADE FOR THE WEEKEND</span><h2>Happening<br /><em>this weekend.</em></h2></div>
          <p>Experiences worth leaving home for. Hosted by people who know this coastline by heart.</p>
        </div>
        <div className="category-row" aria-label="Filter by category">
          {categories.map((item) => <button key={item} className={category === item ? "category-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        {filtered.length ? <div className="experience-grid">{filtered.slice(0, 8).map((experience) => <ExperienceCard key={experience.slug} experience={experience} saved={saved.includes(experience.slug)} onSave={() => toggleSaved(experience.slug)} />)}</div> : <div className="empty-results"><span>Nothing along this stretch just yet.</span><button onClick={() => { setQuery(""); setCategory("All experiences"); }}>Clear filters ↗</button></div>}
        <div className="collection-footer"><span>Showing {filtered.length} handpicked experiences</span><Link href="/explore">See all experiences <span>↗</span></Link></div>
      </section>

      <section className="category-section story-reveal" aria-labelledby="category-heading"><div className="section-heading"><div><span className="eyebrow">FIND YOUR KIND OF COAST</span><h2 id="category-heading">How do you<br /><em>want to feel?</em></h2></div><p>Pick a mood. We’ll find a way in.</p></div><div className="category-tiles">{categoryTiles.map((tile) => <Link href={`/explore?category=${encodeURIComponent(tile.name)}`} className="category-tile" key={tile.name} style={{ backgroundImage: `url(https://images.unsplash.com/${tile.image}?auto=format&fit=crop&w=700&q=82)` }}><span>{tile.name}</span><i>↗</i></Link>)}</div></section>

      <section className="originals-section story-reveal" id="originals">
        <div className="originals-photo" role="img" aria-label="Local fisher setting out from the coast at first light" />
        <div className="originals-copy"><span className="eyebrow light-eyebrow"><i /> COASTX ORIGINALS</span><h2>You won&apos;t find these<br />on an ordinary<br /><em>itinerary.</em></h2><p>Fisherman for a Morning. Meet the coast before it wakes, and hear the stories the tide brings in.</p><div className="originals-feature-meta"><span>Ullal · 3 hours</span><strong>From ₹1,599 / person</strong></div><Link href="/experiences/traditional-fishing-morning" className="outline-link">Discover Originals <span>↗</span></Link><span className="originals-count">01 / 06 &nbsp; CURATED WITH CARE</span></div>
      </section>

      <section className="destination-section story-reveal"><div className="section-heading"><div><span className="eyebrow">SOUTHERN INDIA, BY THE SEA</span><h2>Follow<br /><em>the coast.</em></h2></div><Link href="/map" className="text-arrow">Explore the map <span>↗</span></Link></div><div className="destination-grid">{destinations.map((destination) => <Link href="/map" className="destination-tile" key={destination.name} style={{ backgroundImage: `url(https://images.unsplash.com/${destination.image}?auto=format&fit=crop&w=900&q=82)` }}><span><strong>{destination.name}</strong><small>{destination.count} experiences</small></span><i>↗</i></Link>)}</div></section>

      <section className="weekend-strip"><div><span className="eyebrow">YOUR NEXT GOOD STORY</span><h2>Not sure<br /><em>what to do?</em></h2><p>Tell us your mood. We’ll put together a day that feels like yours.</p><Link href="/plan" className="text-arrow">Plan my weekend <span>↗</span></Link></div><div className="strip-image strip-one" /><div className="strip-image strip-two" /><span className="strip-note">A LITTLE SEA, A LITTLE SOUL, A DAY THAT’S YOURS.</span></section>

      <section className="passport-band story-reveal" id="passport"><div><span className="eyebrow light-eyebrow">COASTX PASSPORT</span><h2>Collect experiences.<br /><em>Not things.</em></h2><p>Each trip leaves a mark. Start your own map of the coast, one story at a time.</p><Link href="/trips#passport" className="passport-link">Your coast passport <span>↗</span></Link></div><div className="passport-stamp"><span>COAST</span><strong>01</strong><small>EXPLORER</small><i>DAKSHINA KANNADA · INDIA</i></div></section>

      <section className="final-coast-cta"><span className="eyebrow">YOUR COAST IS OUT THERE</span><h2>The coast<br /><em>is waiting.</em></h2><Link href="/explore" className="hero-cta">Explore CoastX <span>↗</span></Link></section>

      <SiteFooter />

      <MobileNav />
    </main>
  );
}