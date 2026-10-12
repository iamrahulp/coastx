import { NextResponse } from "next/server";
import { experiences } from "@/data/experiences";

const reservations = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const body = await request.json() as { slug?: unknown; date?: unknown; time?: unknown; adults?: unknown; children?: unknown; name?: unknown; email?: unknown; phone?: unknown; promo?: unknown };
    const experience = experiences.find((item) => item.slug === body.slug);
    const adults = Number(body.adults);
    const children = Number(body.children);
    const date = String(body.date || "");
    const time = String(body.time || "");
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").replace(/\D/g, "");
    const todayInIndia = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
    const dateIsReal = /^\d{4}-\d{2}-\d{2}$/.test(date) && new Date(`${date}T00:00:00.000Z`).toISOString().startsWith(date);
    if (!experience || !dateIsReal || date < todayInIndia || !["6:30 AM", "9:00 AM", "3:30 PM"].includes(time)) return NextResponse.json({ error: "Choose a valid future date and time." }, { status: 400 });
    if (!Number.isInteger(adults) || !Number.isInteger(children) || adults < 1 || children < 0 || adults + children > 8) return NextResponse.json({ error: "Choose between 1 and 8 guests." }, { status: 400 });
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 10 || phone.length > 15) return NextResponse.json({ error: "Enter a valid name, email and phone number." }, { status: 400 });
    const slotKey = `${experience.slug}:${date}:${time}`;
    const reserved = reservations.get(slotKey) || 0;
    if (reserved + adults + children > 10) return NextResponse.json({ error: "This time is nearly full. Please choose a different time or fewer guests." }, { status: 409 });
    reservations.set(slotKey, reserved + adults + children);
    const subtotal = adults * experience.price + children * Math.round(experience.price * .62);
    const promo = String(body.promo || "").trim().toUpperCase();
    const discount = promo === "WELCOME20" && subtotal >= 1000 ? Math.min(Math.round(subtotal * .2), 500) : promo === "WEEKEND10" && subtotal >= 1200 ? Math.min(Math.round(subtotal * .1), 300) : promo === "SURF15" && subtotal >= 1000 ? Math.min(Math.round(subtotal * .15), 400) : 0;
    const serviceFee = 49;
    const taxes = Math.round((subtotal + serviceFee - discount) * .05);
    return NextResponse.json({ bookingId: `CX-${Date.now().toString(36).toUpperCase()}`, total: subtotal + serviceFee + taxes - discount, currency: "INR", payment: "DEMO_CONFIRMED" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We couldn't process the booking. Please try again." }, { status: 400 });
  }
}