"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Compass } from "lucide-react";
import { experiences } from "@/data/experiences";
import { MobileNav, SiteHeader } from "@/components/site-chrome";
import { readDemo, type DemoBooking } from "@/lib/demo-store";

export default function TripsPage() {
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBookings(readDemo<DemoBooking[]>("coastx-bookings", []));
      setWishlist(readDemo<string[]>("coastx-wishlist", []));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <main className="inner-page"><SiteHeader /><section className="trips-page"><div className="account-heading"><span className="eyebrow">YOUR COASTX</span><h1>Your trips <em>& notes.</em></h1><p>Every little plan that brings you closer to the coast.</p></div><div className="trip-section"><div className="trip-section-heading"><h2>Upcoming</h2><span>{bookings.length} bookings</span></div>{bookings.length ? <div className="trip-list">{bookings.map((booking) => <Link className="trip-row" href={`/pass/${booking.id}`} key={booking.id}><div className="trip-thumbnail" style={{ backgroundImage: `url(https://images.unsplash.com/${experiences.find((item) => item.slug === booking.slug)?.image || "photo-1500375592092-40eb2168fd21"}?auto=format&fit=crop&w=400&q=75)` }} /><div><span className="eyebrow">{booking.date} · {booking.time}</span><strong>{booking.title}</strong><small>{booking.location} · {booking.adults + booking.children} guests</small></div><span className="trip-status">{booking.status.includes("CONFIRMED") ? "CONFIRMED" : booking.status}</span><ArrowUpRight size={16} /></Link>)}</div> : <div className="trip-empty"><Compass size={25} /><h3>Your next story is out there.</h3><p>Book an experience and your CoastX Pass will live right here.</p><Link className="book-cta" href="/explore">Explore experiences <span>↗</span></Link></div>}</div>
    <div className="trip-section" id="wishlist"><div className="trip-section-heading"><h2>Saved for later</h2><span>{wishlist.length} saved</span></div>{wishlist.length ? <div className="saved-chips">{wishlist.map((slug) => { const item = experiences.find((experience) => experience.slug === slug); return item ? <Link key={slug} href={`/experiences/${slug}`}><span>♡</span>{item.title}<ArrowUpRight size={14} /></Link> : null; })}</div> : <div className="simple-empty">Save an experience with the heart button and it will show up here. <Link href="/explore">Browse the coast ↗</Link></div>}</div>
    <div className="trip-section passport-preview" id="passport"><div><span className="eyebrow">COASTX PASSPORT</span><h2>Small steps. A bigger coast.</h2><p>Your collection of coastal experiences, saved as memories.</p></div><div className="passport-stamp"><span>COAST</span><strong>01</strong><small>EXPLORER</small></div><Link className="text-arrow" href="/explore">Earn your first stamp <span>↗</span></Link></div></section><MobileNav /></main>;
}