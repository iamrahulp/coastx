export function getSiteUrl(env = process.env) {
  const explicitUrl = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitUrl) {
    const parsed = new URL(explicitUrl);
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS outside local development.");
    }
    return new URL(parsed.origin);
  }

  const vercelHost = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  if (vercelHost) return new URL(`https://${vercelHost}`);

  return env.NODE_ENV === "production"
    ? new URL("https://coastx.vercel.app")
    : new URL("http://localhost:3000");
}