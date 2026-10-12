"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import type { Experience } from "@/data/experiences";
import { Brand } from "@/components/site-chrome";

type Booking = { id: string; slug: string; title: string; location: string; date: string; time: string; adults: number; children: number; name: string; email: string; phone: string; total: number; status: string; createdAt: string };

export function BookingFlow({ experience }: { experience: Experience }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [promo, setPromo] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const childPrice = Math.round(experience.price * .62);
  const subtotal = adults * experience.price + children * childPrice;
  const serviceFee = adults + children > 0 ? 49 : 0;
  const discount = promo.toUpperCase() === "WELCOME20" && subtotal >= 1000 ? Math.min(Math.round(subtotal * .2), 500) : promo.toUpperCase() === "WEEKEND10" && subtotal >= 1200 ? Math.min(Math.round(subtotal * .1), 300) : promo.toUpperCase() === "SURF15" && subtotal >= 1000 ? Math.min(Math.round(subtotal * .15), 400) : 0;
  const taxes = Math.round((subtotal + serviceFee - discount) * .05);
  const total = subtotal + serviceFee + taxes - discount;

  async function confirmBooking() {
    setMessage("");
    setBusy(true);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: experience.slug, date, time, adults, children, name, email, phone, promo }) });
      const result = await response.json() as { error?: string; bookingId?: string; total?: number };
      if (!response.ok || !result.bookingId || result.total === undefined) throw new Error(result.error || "We couldn't confirm that booking.");
      const booking: Booking = { id: result.bookingId, slug: experience.slug, title: experience.title, location: experience.location, date, time, adults, children, name, email, phone, total: result.total, status: "CONFIRMED · DEMO PAYMENT", createdAt: new Date().toISOString() };
      const previous = JSON.parse(window.localStorage.getItem("coastx-bookings") || "[]") as Booking[];
      window.localStorage.setItem("coastx-bookings", JSON.stringify([booking, ...previous]));
      router.push(`/pass/${booking.id}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Please try again.");
      setBusy(false);
    }
  }

  return <main className="checkout-page"><header className="checkout-header"><Link className="back-link" href={`/experiences/${experience.slug}`}><ArrowLeft size={17} /> Back to experience</Link><Brand /><span className="secure-label"><ShieldCheck size={15} /> SECURE CHECKOUT</span></header><div className="checkout-progress"><span className={step >= 1 ? "progress-current" : ""}><i>1</i> Your time</span><b /><span className={step >= 2 ? "progress-current" : ""}><i>2</i> Your details</span><b /><span className={step >= 3 ? "progress-current" : ""}><i>3</i> Confirm</span></div>
    <div className="checkout-layout"><section className="checkout-form"><span className="eyebrow">A FEW DETAILS, THEN YOU&apos;RE OFF</span><h1>{step === 1 ? "Choose your moment." : step === 2 ? "Who’s joining?" : "Ready when you are."}</h1>
      {step === 1 && <div className="checkout-fields"><label>DATE<input type="date" value={date} onChange={(event) => setDate(event.target.value)} required /></label><fieldset><legend>CHOOSE A START TIME</legend><div className="time-options">{["6:30 AM", "9:00 AM", "3:30 PM"].map((slot) => <button type="button" key={slot} className={time === slot ? "time-selected" : ""} onClick={() => setTime(slot)}>{slot}</button>)}</div></fieldset><div className="participant-row"><div><strong>Adults</strong><span>Ages 13+</span></div><div className="stepper"><button aria-label="Remove an adult" onClick={() => setAdults(Math.max(1, adults - 1))}>−</button><strong>{adults}</strong><button aria-label="Add an adult" onClick={() => setAdults(Math.min(8 - children, adults + 1))}>+</button></div></div><div className="participant-row"><div><strong>Children</strong><span>Ages 5–12 · ₹{childPrice.toLocaleString("en-IN")} each</span></div><div className="stepper"><button aria-label="Remove a child" onClick={() => setChildren(Math.max(0, children - 1))}>−</button><strong>{children}</strong><button aria-label="Add a child" onClick={() => setChildren(Math.min(7 - adults, children + 1))}>+</button></div></div><button className="checkout-primary" disabled={!date || !time} onClick={() => setStep(2)}>Continue to your details <span>↗</span></button></div>}
      {step === 2 && <div className="checkout-fields"><label>FULL NAME<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name on your booking" /></label><label>EMAIL ADDRESS<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>PHONE NUMBER<input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" /></label><div className="inline-actions"><button className="back-step" onClick={() => setStep(1)}>← Back</button><button className="checkout-primary" disabled={!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || phone.replace(/\D/g, "").length < 10} onClick={() => setStep(3)}>Review booking <span>↗</span></button></div></div>}
      {step === 3 && <div className="checkout-fields"><div className="payment-demo"><span className="demo-tag">DEMO CHECKOUT</span><h2>Mock payment, real flow.</h2><p>No charge is made. This demo confirms your booking locally so you can see the full CoastX Pass experience.</p><div><ShieldCheck size={16} /> Payment provider: Razorpay (connect account for live payments)</div></div>{message && <p className="form-error" role="alert">{message}</p>}<div className="inline-actions"><button className="back-step" onClick={() => setStep(2)}>← Back</button><button className="checkout-primary" disabled={busy} onClick={confirmBooking}>{busy ? "Confirming…" : `Confirm demo payment · ₹${total.toLocaleString("en-IN")}`} <span>↗</span></button></div><p className="terms-note">By confirming, you agree to the cancellation and safety terms for this demo listing.</p></div>}
    </section><aside className="checkout-summary"><span className="eyebrow">YOUR EXPERIENCE</span><div className="summary-photo" style={{ backgroundImage: `url(https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=800&q=80)` }} /><strong>{experience.title}</strong><span>{experience.location} · {experience.duration}</span><div className="summary-rule" /><p><span>{adults} adult{adults !== 1 ? "s" : ""} × ₹{experience.price.toLocaleString("en-IN")}</span><b>₹{(adults * experience.price).toLocaleString("en-IN")}</b></p>{children > 0 && <p><span>{children} child × ₹{childPrice.toLocaleString("en-IN")}</span><b>₹{(children * childPrice).toLocaleString("en-IN")}</b></p>}{date && <p><span>{date}</span><b>{time}</b></p>}<label className="promo-input">PROMO CODE<div><input value={promo} onChange={(event) => setPromo(event.target.value)} placeholder="Try WELCOME20" />{discount > 0 && <Check size={16} />}</div></label><div className="summary-rule" /><p><span>Subtotal</span><b>₹{subtotal.toLocaleString("en-IN")}</b></p><p><span>Service fee</span><b>₹{serviceFee}</b></p>{discount > 0 && <p className="discount-line"><span>Promo discount</span><b>−₹{discount}</b></p>}<p><span>Taxes (5%)</span><b>₹{taxes.toLocaleString("en-IN")}</b></p><div className="summary-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div><small>Inclusive of all taxes</small></aside></div></main>;
}