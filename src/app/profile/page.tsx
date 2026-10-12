"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, Compass, LogOut, ShieldCheck } from "lucide-react";
import { MobileNav, SiteHeader } from "@/components/site-chrome";
import { readDemo, writeDemo, type DemoBooking, type DemoUser } from "@/lib/demo-store";
import { demoCustomers } from "@/data/demo-content";

const demoUsers: DemoUser[] = demoCustomers.map((customer) => ({ name: customer.name, email: customer.email, role: customer.email.startsWith("partner") ? "partner" : customer.email.startsWith("admin") ? "admin" : "customer" }));

export default function ProfilePage() {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [wishCount, setWishCount] = useState(0);
  const [customEmail, setCustomEmail] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setUser(readDemo<DemoUser | null>("coastx-user", null));
      setBookings(readDemo<DemoBooking[]>("coastx-bookings", []));
      setWishCount(readDemo<string[]>("coastx-wishlist", []).length);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function login(demoUser: DemoUser) {
    writeDemo("coastx-user", demoUser);
    setUser(demoUser);
  }

  function logout() {
    window.localStorage.removeItem("coastx-user");
    setUser(null);
  }

  return <main className="inner-page"><SiteHeader /><section className="account-page"><div className="account-heading"><span className="eyebrow">YOUR COASTX</span><h1>{user ? `Hello, ${user.name.split(" ")[0]}.` : "A little more coast, together."}</h1><p>{user ? "Your bookings, saved experiences and coast passport." : "Sign in to keep your plans and favourite coast moments in one place."}</p></div>
    {user ? <div className="account-grid"><aside className="account-menu"><div className="account-avatar">{user.name.slice(0, 1)}</div><strong>{user.name}</strong><span>{user.email}</span><span className="demo-tag">DEMO ACCOUNT</span><Link href="/trips"><Compass size={16} /> Your trips <ArrowRight size={15} /></Link><Link href="/trips#wishlist"><Bookmark size={16} /> Wishlist <b>{wishCount}</b></Link><Link href="/trips#passport"><ShieldCheck size={16} /> Coast passport <ArrowRight size={15} /></Link><button onClick={logout}><LogOut size={16} /> Sign out</button></aside><div className="account-main"><div className="account-summary"><Link href="/trips"><span>UPCOMING TRIPS</span><strong>{bookings.length}</strong><small>Open your CoastX Passes ↗</small></Link><Link href="/trips#wishlist"><span>SAVED EXPERIENCES</span><strong>{wishCount}</strong><small>Your wishlist ↗</small></Link><div><span>COAST PASSPORT</span><strong>01</strong><small>Coast Explorer · demo stamp</small></div></div><div className="account-panel"><div><span className="eyebrow">NEXT UP</span><Link href="/explore">Find your next coast day ↗</Link></div>{bookings.length ? bookings.slice(0, 2).map((booking) => <Link className="account-booking" key={booking.id} href={`/pass/${booking.id}`}><span className="booking-date-small">{booking.date}</span><div><strong>{booking.title}</strong><span>{booking.time} · {booking.location}</span></div><ArrowRight size={16} /></Link>) : <div className="account-empty"><span>Nothing on the calendar yet.</span><Link href="/explore">Explore experiences ↗</Link></div>}</div><p className="demo-security"><ShieldCheck size={15} /> This is a local demo profile. Connect Supabase Auth before launch.</p></div></div> : <div className="sign-in-layout"><div className="sign-in-card"><span className="eyebrow">DEMO ACCESS</span><h2>Welcome to your coast.</h2><p>Choose a sample identity to explore the customer, operator or admin experience. No account or password is required in this local demo.</p><div className="demo-login-list">{demoUsers.map((demoUser) => <button key={demoUser.email} onClick={() => login(demoUser)}><span><strong>{demoUser.name}</strong><small>{demoUser.email}</small></span><span className="demo-role">{demoUser.role} ↗</span></button>)}</div><label className="custom-demo-email">OR USE YOUR EMAIL<input type="email" placeholder="you@example.com" value={customEmail} onChange={(event) => setCustomEmail(event.target.value)} /><button disabled={!/^\S+@\S+\.\S+$/.test(customEmail)} onClick={() => login({ name: customEmail.split("@")[0].replace(/[._-]/g, " "), email: customEmail, role: "customer" })}>Continue as customer <ArrowRight size={15} /></button></label><small className="demo-warning">Demo access only · Not real authentication or secure account storage</small></div><div className="sign-in-photo"><span>YOUR NEXT STORY<br /><em>starts here.</em></span></div></div>}</section><MobileNav /></main>;
}