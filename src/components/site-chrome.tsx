"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Heart, Search } from "lucide-react";

export function Brand() {
  return <Link aria-label="CoastX home" className="brand" href="/"><span>COAST</span><b>X</b></Link>;
}

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const update = () => setCompact(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [overlay]);

  return <header className={`site-header ${overlay ? "site-header-overlay" : ""} ${compact ? "site-header-compact" : ""}`}><Brand /><nav className="desktop-nav" aria-label="Main navigation"><Link href="/explore">Explore</Link><Link href="/explore">Experiences</Link><Link href="/map">Destinations</Link><Link href="/experiences/traditional-fishing-morning">CoastX Originals</Link></nav><div className="header-actions"><Link className="header-icon-link" href="/explore" aria-label="Search experiences"><Search size={17} /></Link><Link className="header-icon-link header-wishlist" href="/trips#wishlist" aria-label="Wishlist"><Heart size={17} /></Link><Link className="login-link" href="/profile">Sign in</Link><Link className="profile-button" href="/profile" aria-label="Open your profile"><ArrowUpRight size={16} /></Link><Link className="header-cta" href="/explore">Explore <ArrowRight size={14} /></Link></div></header>;
}

export function MobileNav() {
  const pathname = usePathname();
  const items = [["/", "⌂", "Home"], ["/explore", "⌕", "Explore"], ["/map", "◎", "Map"], ["/trips", "▤", "Trips"], ["/profile", "◯", "Profile"]];
  return <nav className="mobile-nav" aria-label="Mobile navigation">{items.map(([href, icon, label]) => <Link href={href} key={label} className={pathname === href ? "mobile-selected" : ""} aria-current={pathname === href ? "page" : undefined}><span className="mobile-nav-icon">{icon}</span><span>{label}</span></Link>)}</nav>;
}

export function SiteFooter() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return <footer className="site-footer"><div className="footer-main"><div><Brand /><p>Experience the coast.<br />Not just visit it.</p></div><div className="footer-links"><div><span>EXPLORE</span><Link href="/explore">Experiences</Link><Link href="/explore?category=Water">Water adventures</Link><Link href="/experiences/yakshagana-backstage">CoastX Originals</Link></div><div><span>COASTX</span><Link href="/partner">Become a host</Link><Link href="/profile">Your trips</Link><Link href="/legal/safety">Safety &amp; care</Link></div><div><span>HERE TO HELP</span><Link href="/legal/terms">Terms</Link><Link href="/legal/privacy">Privacy</Link>{contactEmail ? <a href={`mailto:${contactEmail}`}>Get in touch</a> : <span className="contact-pending">Contact details coming soon</span>}</div></div></div><div className="footer-bottom"><span>© 2026 COASTX · MADE FOR THE COAST</span><span>MANGALURU, KARNATAKA&nbsp; ↗</span></div></footer>;
}