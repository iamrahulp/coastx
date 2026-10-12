import Link from "next/link";
import type { Experience } from "@/data/experiences";
import { formatPrice } from "@/data/experiences";

export function ExperienceCard({ experience, saved = false, onSave }: { experience: Experience; saved?: boolean; onSave?: () => void }) {
  return (
    <article className="experience-card">
      <Link className="experience-image" href={`/experiences/${experience.slug}`} style={{ backgroundImage: `url(https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=900&q=82)` }} aria-label={`Explore ${experience.title}`}>
        {experience.label && <span className="image-label">{experience.label}</span>}
        <span className="image-count" aria-hidden="true">↗</span>
      </Link>
      <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} aria-pressed={saved}>{saved ? "♥" : "♡"}</button>
      <div className="experience-copy">
        <div className="card-meta"><span>{experience.location}</span><span className="rating"><span>★</span> {experience.rating} <i>({experience.reviews})</i></span></div>
        <Link className="experience-title" href={`/experiences/${experience.slug}`}>{experience.title}</Link>
        <p className="experience-subtitle">{experience.duration} <span>·</span> {experience.category}</p>
        <div className="card-bottom"><p>From <strong>{formatPrice(experience.price)}</strong> <span>/ person</span></p>{experience.verified && <span className="verified-mark">✓ Verified</span>}</div>
      </div>
    </article>
  );
}