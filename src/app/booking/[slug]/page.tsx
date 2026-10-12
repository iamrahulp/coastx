import { Suspense } from "react";
import { notFound } from "next/navigation";
import { experiences } from "@/data/experiences";
import { BookingFlow } from "@/components/booking-flow";

export const instant = false;

export function generateStaticParams() {
  return experiences.map((experience) => ({ slug: experience.slug }));
}

async function BookingContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = experiences.find((item) => item.slug === slug);
  if (!experience) notFound();
  return <BookingFlow experience={experience} />;
}

export default function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<main className="checkout-page"><div className="pass-missing">Preparing your booking…</div></main>}><BookingContent params={params} /></Suspense>;
}