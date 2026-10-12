"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, ArrowUpRight, Printer, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/site-chrome";
import { readDemo, type DemoBooking } from "@/lib/demo-store";

function PassContent() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<DemoBooking | null>(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setBooking(readDemo<DemoBooking[]>("coastx-bookings", []).find((item) => item.id === params.id) || null));
    return () => window.cancelAnimationFrame(frame);
  }, [params.id]);

  return <main className="pass-page"><header className="checkout-header"><Link href="/trips" className="back-link"><ArrowLeft size={17} /> Your trips</Link><Brand /><button className="print-button" onClick={() => window.print()}><Printer size={16} /> Print pass</button></header>{booking ? <section className="pass-wrap"><div className="pass-title"><span className="eyebrow">YOUR COASTX PASS</span><h1>Good things are <em>ahead.</em></h1><p>Keep this pass close. Your host will scan it when you arrive.</p></div><article className="coast-pass"><div className="pass-top"><Brand /><span className="pass-status"><i /> CONFIRMED · DEMO</span></div><div className="pass-visual" style={{ backgroundImage: `url(https://images.unsplash.com/${"photo-1500375592092-40eb2168fd21"}?auto=format&fit=crop&w=1400&q=82)` }}><span>COASTAL KARNATAKA · INDIA</span></div><div className="pass-content"><div className="pass-main-info"><span className="eyebrow">EXPERIENCE</span><h2>{booking.title}</h2><p>{booking.location} · hosted by CoastX demo partner</p><div className="pass-details"><div><span>GUEST</span><strong>{booking.name}</strong></div><div><span>DATE</span><strong>{booking.date}</strong></div><div><span>START TIME</span><strong>{booking.time}</strong></div><div><span>GUESTS</span><strong>{booking.adults + booking.children} people</strong></div><div><span>BOOKING ID</span><strong>{booking.id}</strong></div><div><span>STATUS</span><strong className="status-confirmed">CONFIRMED</strong></div></div></div><div className="pass-qr"><QRCodeSVG value={`COASTX|${booking.id}|${booking.slug}|${booking.date}|${booking.time}`} size={145} level="M" includeMargin /><small>SHOW THIS CODE TO YOUR HOST</small></div></div><div className="pass-notice"><ShieldCheck size={16} /><span>Arrive 15 minutes early · Contact your host through your trip details · Emergency: 112</span></div><div className="pass-bottom"><span>COASTX · EXPERIENCE THE COAST</span><span>{booking.total.toLocaleString("en-IN", { style: "currency", currency: "INR" })} PAID · DEMO</span></div></article><div className="pass-actions"><Link href="/trips">View your trips <ArrowUpRight size={15} /></Link><Link href="/explore">Find another experience <ArrowUpRight size={15} /></Link></div><div className="pass-demo-note">Demo pass: QR contains booking reference only. Connect verified payment and operator check-in before production.</div></section> : <section className="pass-missing"><h1>Pass not found</h1><p>This pass is not in this browser’s demo bookings.</p><Link className="book-cta" href="/explore">Explore experiences ↗</Link></section>}</main>;
}

export default function PassPage() {
  return <Suspense fallback={<main className="pass-page"><div className="pass-missing">Loading CoastX Pass…</div></main>}><PassContent /></Suspense>;
}