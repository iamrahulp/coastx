import assert from "node:assert/strict";
import test from "node:test";
import { getSiteUrl } from "../src/lib/site-url.mjs";

test("uses an explicitly configured public origin", () => {
  assert.equal(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://coastx.example/path" }).origin, "https://coastx.example");
});

test("prefers Vercel's stable production domain on deployed builds", () => {
  assert.equal(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "coastx.vercel.app", VERCEL_URL: "preview-123.vercel.app" }).origin, "https://coastx.vercel.app");
});

test("uses Vercel's deployment URL when the stable domain is unavailable", () => {
  assert.equal(getSiteUrl({ VERCEL_URL: "coastx-preview.vercel.app" }).origin, "https://coastx-preview.vercel.app");
});

test("uses localhost only for a local development environment", () => {
  assert.equal(getSiteUrl({ NODE_ENV: "development" }).origin, "http://localhost:3000");
});

test("rejects an insecure non-local production site URL", () => {
  assert.throws(() => getSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://coastx.example", NODE_ENV: "production" }), /must use HTTPS/);
});