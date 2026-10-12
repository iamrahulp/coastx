import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { experiences } from "@/data/experiences";
import { ExperienceCard } from "@/components/experience-card";
import { ShareButton } from "@/components/share-button";
import { demoReviews } from "@/data/demo-content";
import { MobileNav, SiteHeader } from "@/components/site-chrome";

export const instant = false;

export function generateStaticParams() {
  return experiences.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);
  return experience ? { title: experience.title, description: experience.description, openGraph: { images: [`https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=1400&q=85`] } } : {};
}

async function ExperienceContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);
  if (!experience) notFound();
  const similar = experiences.filter((item) => item.slug !== slug && item.category === experience.category).slice(0, 4);

  return <main className="inner-page"><SiteHeader /><div className="detail-wrap"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/explore">Experiences</Link><span>/</span><span>{experience.location}</span></div>
    <div className="detail-heading"><div><span className="eyebrow">{experience.category.toUpperCase()} · {experience.location.toUpperCase()}</span><h1>{experience.title}</h1><div className="detail-rating"><span>★ {experience.rating}</span> · {experience.reviews} reviews · <span>✓ CoastX verified</span></div></div><ShareButton title={experience.title} /></div>
    <div className="detail-gallery"><div className="gallery-main" style={{ backgroundImage: `url(https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=1500&q=88)` }} /><div className="gallery-side gallery-side-one" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=82)` }} /><div className="gallery-side gallery-side-two" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1472745942893-4b9f730c7668?auto=format&fit=crop&w=700&q=82)` }} /><span className="gallery-credit">DEMO PHOTOGRAPHY · REPLACE BEFORE LAUNCH</span></div>
    <div className="detail-layout"><div className="detail-main-column"><div className="host-line"><span className="host-avatar">CX</span><div><strong>Hosted by a local guide</strong><span>{experience.host} · Demo listing</span></div><span className="verified-mark">✓ VERIFIED</span></div><section className="detail-section"><span className="eyebrow">THE EXPERIENCE</span><h2>A little closer to the coast.</h2><p>{experience.description} In a small group, take time to learn the place, ask questions and enjoy the coast at a local pace.</p><p>Your host will meet you at the confirmed meeting point and share a short safety briefing before you begin. Everything is designed to be welcoming for first-timers unless noted.</p></section>
      <div className="detail-facts"><div><span>◷</span><strong>{experience.duration}</strong><small>Duration</small></div><div><span>◎</span><strong>Small group</strong><small>Up to 8 guests</small></div><div><span>⌖</span><strong>{experience.location}</strong><small>Meeting area</small></div><div><span>↗</span><strong>Easy to moderate</strong><small>Activity level</small></div></div>
      <section className="detail-section"><span className="eyebrow">WHAT TO EXPECT</span><h2>Made for a memorable day.</h2><ul className="detail-checklist"><li>Local host and all activity equipment</li><li>Small group with time for questions</li><li>Safety briefing and beginner-friendly guidance</li><li>Photos and a story to take home</li></ul></section>
      <section className="weather-panel"><div><span className="eyebrow">COASTX CONDITIONS · DEMO</span><h3>Looking good out there.</h3><p>Illustrative conditions only. Your host will confirm the latest local conditions before the activity.</p></div><div className="weather-metrics"><span><b>28°</b>Temperature</span><span><b>20%</b>Rain chance</span><span><b>8.7/10</b>CoastX score</span></div></section>
      <section className="detail-section meeting-section"><span className="eyebrow">MEETING POINT</span><h2>{experience.location}</h2><p>Exact meeting details are shared after booking. Plan to arrive 15 minutes before your start time.</p><div className="meeting-map"><span>ARABIAN SEA</span><i /><b>MEETING AREA · {experience.location.toUpperCase()}</b><small>Map preview · live directions after booking</small></div></section>
      <section className="detail-section review-section"><span className="eyebrow">GUEST NOTES · DEMO CONTENT</span><h2><span>★ {experience.rating}</span> · {experience.reviews} reviews</h2>{demoReviews.filter((review) => review.experienceSlug === experience.slug).slice(0, 2).map((review) => <div className="review-quote" key={review.id}><span>{"★".repeat(review.rating)}</span><p>“{review.body}”</p><small>{review.guestName.toUpperCase()} · {review.label}</small></div>)}</section></div>
      <aside className="booking-card"><div className="booking-card-price"><strong>₹{experience.price.toLocaleString("en-IN")}</strong><span> / person</span><span className="rating"><span>★</span> {experience.rating} ({experience.reviews})</span></div><p className="availability-note"><i /> Available this week</p><Link className="book-cta" href={`/booking/${experience.slug}`}>Check availability <span>↗</span></Link><small>Free cancellation up to 24 hours before start</small><div className="booking-card-rule" /><span className="booking-card-proof">✓ CoastX verified experience</span><span className="booking-card-proof">✓ Pay securely · demo checkout available</span></aside></div>
    <section className="similar-section"><div className="section-heading"><div><span className="eyebrow">KEEP EXPLORING</span><h2>Along the same <em>lines.</em></h2></div><Link href="/explore" className="text-arrow">See all <span>↗</span></Link></div><div className="experience-grid">{similar.map((item) => <ExperienceCard key={item.slug} experience={item} />)}</div></section>
  </div><MobileNav /><Link className="mobile-book-sticky" href={`/booking/${experience.slug}`}>From ₹{experience.price.toLocaleString("en-IN")} · Check availability <span>↗</span></Link></main>;
}

export default function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<main className="inner-page"><div className="pass-missing">Opening experience…</div></main>}><ExperienceContent params={params} /></Suspense>;
}