import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MobileNav, SiteHeader } from "@/components/site-chrome";

const policies: Record<string, { title: string; text: string }> = {
  terms: { title: "Terms & conditions", text: "These draft terms describe the proposed use of the CoastX experiences marketplace, booking and host tools. Final terms must define eligibility, payment, marketplace responsibilities, partner obligations, cancellation rights, dispute handling and governing law." },
  privacy: { title: "Privacy policy", text: "This draft privacy notice is a placeholder. Before launch it must accurately describe the personal information CoastX collects, the purposes and legal basis for processing, retention periods, data processors, user rights, contact details and cross-border transfers." },
  cancellation: { title: "Cancellation policy", text: "The sample experience page displays an illustrative 24-hour cancellation window. The final policy must define cancellation deadlines, late cancellation, no-shows, partner cancellations and weather-related alternatives." },
  refunds: { title: "Refund policy", text: "Demo payments do not move money and cannot be refunded. A production refund policy must explain eligible refunds, timing, payment provider processing and credits or rescheduling options." },
  safety: { title: "Safety guidelines", text: "Experience hosts must provide accurate risk information, qualified guidance, appropriate equipment, emergency plans and timely weather updates. Customers should follow host instructions and disclose relevant limitations. These draft guidelines require local operational review." },
  "partner-terms": { title: "Partner terms", text: "This draft outlines a proposed relationship between CoastX and experience operators. Final terms must cover verification, insurance, permits, safety, service quality, customer data, payouts, taxes, cancellations and liability." },
};

export const instant = false;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

async function LegalContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies[slug];
  if (!policy) notFound();
  return <main className="inner-page"><SiteHeader /><section className="legal-page"><span className="eyebrow">COASTX · {policy.title.toUpperCase()}</span><h1>{policy.title}</h1><div className="legal-draft"><span>Draft placeholder</span><strong>Requires professional legal review before production</strong></div><p>{policy.text}</p><p>CoastX is an early-stage demonstration. This page is not legal advice and does not create a contract. Replace this content with reviewed, jurisdiction-appropriate language before accepting real bookings or personal data.</p><Link href="/">← Back to CoastX</Link></section><MobileNav /></main>;
}

export default function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<main className="inner-page"><div className="pass-missing">Opening CoastX policy…</div></main>}><LegalContent params={params} /></Suspense>;
}