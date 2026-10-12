import { experiences } from "@/data/experiences";

export const demoPartners = [
  { name: "Riverfolk Outdoors", home: "Mulki", focus: "Water experiences" },
  { name: "Coastline Surf School", home: "Sasihithlu", focus: "Surfing" },
  { name: "Namma Oota Walks", home: "Mangaluru", focus: "Food & local life" },
  { name: "Rangabhoomi Experiences", home: "Mangaluru", focus: "Culture" },
  { name: "Malnad Miles", home: "Bantwal", focus: "Adventure" },
  { name: "Stillwater Yoga", home: "Surathkal", focus: "Wellness" },
  { name: "Kadal Stories", home: "Ullal", focus: "Nature & local life" },
  { name: "Mitti Studio", home: "Moodbidri", focus: "Creative workshops" },
  { name: "Tide & Trail Co.", home: "Mulki", focus: "Outdoor experiences" },
  { name: "Saltwind Collective", home: "Mangaluru", focus: "CoastX Originals" },
].map((partner, index) => ({ ...partner, id: `DEMO-PARTNER-${String(index + 1).padStart(2, "0")}`, demo: true as const }));

export const demoCustomers = [
  { name: "CoastX Guest", email: "customer@coastx.demo" },
  { name: "Demo Guest One", email: "guest.one@coastx.demo" },
  { name: "Demo Guest Two", email: "guest.two@coastx.demo" },
  { name: "Demo Guest Three", email: "guest.three@coastx.demo" },
  { name: "Demo Guest Four", email: "guest.four@coastx.demo" },
  { name: "Demo Host", email: "partner@coastx.demo" },
  { name: "CoastX Admin", email: "admin@coastx.demo" },
].map((customer, index) => ({ ...customer, id: `DEMO-GUEST-${String(index + 1).padStart(2, "0")}`, demo: true as const }));

const reviewOpenings = [
  "A thoughtful way to spend a morning.",
  "Our host made the place feel familiar.",
  "The pace was just right for us.",
  "A lovely little detail in our coastal trip.",
  "We came away with a story to tell.",
];
const reviewClosings = [
  "Everything felt personal and unhurried.",
  "Clear guidance made it easy to enjoy.",
  "Would happily make time for this again.",
  "A genuine highlight of the weekend.",
  "Small group and a generous local perspective.",
];

export const demoReviews = Array.from({ length: 50 }, (_, index) => {
  const experience = experiences[index % experiences.length];
  return {
    id: `DEMO-REVIEW-${String(index + 1).padStart(2, "0")}`,
    experienceSlug: experience.slug,
    experienceTitle: experience.title,
    guestName: `Demo guest ${String(index + 1).padStart(2, "0")}`,
    rating: Math.max(4, Math.round(experience.rating)),
    body: `${reviewOpenings[index % reviewOpenings.length]} ${reviewClosings[Math.floor(index / reviewOpenings.length) % reviewClosings.length]}`,
    label: "SYNTHETIC DEMO REVIEW · NOT A REAL CUSTOMER TESTIMONIAL",
  };
});