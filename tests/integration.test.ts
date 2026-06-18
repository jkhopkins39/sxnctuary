/**
 * Sxnctuary — integration tests
 *
 * Requires env vars:
 *   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY  → Supabase auth
 *
 * ⚠️  Known issue: database.ts and ContentContext.tsx hardcode
 *     http://localhost:3001/api — the Express server must be running
 *     for product/content tests. These tests are skipped unless
 *     SXNCTUARY_API_URL env var points to a live server.
 *
 * Run:  npx vitest run tests/integration.test.ts
 */

import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseConfigured = !!(supabaseUrl && supabaseKey);
const itSupabase = supabaseConfigured ? it : it.skip;

const apiUrl = process.env.SXNCTUARY_API_URL; // e.g. http://localhost:3001
const itApi = apiUrl ? it : it.skip;

// ─── Supabase auth ────────────────────────────────────────────────────────────
describe("Supabase auth (anon client)", () => {
  itSupabase("can create a client and reach the auth endpoint", async () => {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    // getSession() returns null session for unauthenticated state — not an error
    const { data, error } = await supabase.auth.getSession();
    expect(error).toBeNull();
    expect(data).toHaveProperty("session");
  });

  itSupabase("rejects bad credentials", async () => {
    const supabase = createClient(supabaseUrl!, supabaseKey!);
    const { error } = await supabase.auth.signInWithPassword({
      email: "nobody@example.com",
      password: "wrong_password_12345",
    });
    expect(error).not.toBeNull();
    expect(error!.message).toBeTruthy();
  });
});

// ─── Express API (requires running server) ────────────────────────────────────
describe("Express API server", () => {
  itApi("GET /api/content returns an object", async () => {
    const res = await fetch(`${apiUrl}/api/content`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(typeof data).toBe("object");
  });

  itApi("GET /api/products returns an array", async () => {
    const res = await fetch(`${apiUrl}/api/products`);
    expect(res.ok).toBe(true);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});

// ─── Known issue reminder ─────────────────────────────────────────────────────
it("KNOWN ISSUE: API_BASE_URL is hardcoded to localhost:3001", () => {
  // database.ts line 1: const API_BASE_URL = 'http://localhost:3001/api'
  // ContentContext.tsx line 32: const API_BASE_URL = 'http://localhost:3001/api'
  // Fix: replace with import.meta.env.VITE_API_URL || 'http://localhost:3001'
  // Until fixed, product/content features won't work in production.
  expect(true).toBe(true); // placeholder — reminder visible in test output
});
