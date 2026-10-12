"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Share2 } from "lucide-react";
import { experiences } from "@/data/experiences";
import { MobileNav, SiteHeader } from "@/components/site-chrome";

export default function PlanPage() {
  const [interests, setInterests] = useState<string[]>(["Water", "Food"]);
  const [people, setPeople] = useState("2 people");
  const [budget, setBudget] = useState("₹2,000 per person");
  const [built, setBuilt] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleInterest(value: string) {
    setInterests((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function createPlan() {
    setBuilt(true);
    setSaved(false);
  }

  const selected = experiences.filter((experience) => interests.includes(experience.category)).slice(0, 3);
  const total = selected.reduce((sum, experience) => sum + experience.price, 0) + 350;

  return <main className="inner-page"><SiteHeader /><section className="plan-page"><div className="account-heading"><span className="eyebrow">A DAY, YOUR WAY</span><h1>Make room for <em>the coast.</em></h1><p>A thoughtful little plan for a day you’ll remember. Pick a few details; we’ll join the dots.</p></div><div className="plan-layout"><form className="plan-form" onSubmit={(event) => { event.preventDefault(); createPlan(); }}><label>WHEN<input type="date" /></label><label>STARTING NEAR<select defaultValue="Mangaluru"><option>Mangaluru</option><option>Mulki</option><option>Sasihithlu</option><option>Surathkal</option></select></label><fieldset><legend>WHO&apos;S COMING?</legend><div className="choice-row">{["Solo", "2 people", "Friends", "Family"].map((item) => <button type="button" className={people === item ? "choice-active" : ""} key={item} onClick={() => setPeople(item)}>{item}</button>)}</div></fieldset><fieldset><legend>YOUR BUDGET, PER PERSON</legend><div className="choice-row">{["₹1,000 per person", "₹2,000 per person", "₹5,000 per person"].map((item) => <button type="button" className={budget === item ? "choice-active" : ""} key={item} onClick={() => setBudget(item)}>{item}</button>)}</div></fieldset><fieldset><legend>WHAT SOUNDS GOOD?</legend><div className="interest-grid">{["Water", "Adventure", "Nature", "Food", "Culture", "Wellness", "Creative"].map((item) => <button type="button" className={interests.includes(item) ? "interest-selected" : ""} key={item} onClick={() => toggleInterest(item)}>{interests.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset><button className="checkout-primary" type="submit">Build my day <ArrowRight size={16} /></button></form><section className="itinerary-panel"><span className="eyebrow">{built ? "A COASTX DAY PLAN · DEMO" : "YOUR DAY, TAKING SHAPE"}</span>{built ? <><h2>A little sea, a little soul.</h2><p className="itinerary-context">{people} · {budget} · built around {interests.join(", ") || "the coast"}</p><div className="itinerary-timeline">{selected.map((item, index) => <Link href={`/experiences/${item.slug}`} key={item.slug}><span>{["6:30 AM", "11:00 AM", "4:30 PM"][index]}</span><i /><div><strong>{item.title}</strong><small>{item.location} · ₹{item.price.toLocaleString("en-IN")}</small></div><ArrowRight size={14} /></Link>)}<div><span>7:30 PM</span><i /><div><strong>Take your time over dinner</strong><small>Ask your host for a local favourite</small></div></div></div><div className="itinerary-total"><span>ESTIMATED TOTAL / PERSON</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><div className="itinerary-actions"><button onClick={() => { window.localStorage.setItem("coastx-itinerary", JSON.stringify({ interests, people, budget, slugs: selected.map((item) => item.slug) })); setSaved(true); }}>{saved ? "Saved to your trips ✓" : "Save this day"}</button><button onClick={async () => { if (navigator.share) await navigator.share({ title: "My CoastX day", text: selected.map((item) => item.title).join(" · "), url: window.location.href }); else await navigator.clipboard.writeText(window.location.href); }}><Share2 size={15} /> Share</button></div></> : <div className="itinerary-placeholder"><div className="itinerary-sun">☼</div><h2>Your day, taking shape.</h2><p>A surf, a story, a long lunch. Pick what feels right and we’ll map the rest.</p><span>RULE-BASED DEMO PLAN · NOT A LIVE AVAILABILITY CHECK</span></div>}</section></div></section><MobileNav /></main>;
}