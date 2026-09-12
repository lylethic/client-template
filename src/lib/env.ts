import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Environment variable validation with Zod.
 * Validates at build time and runtime — prevents missing/malformed env vars from
 * causing silent failures in production.
 *
 * Add new env vars here and they will be type-safe throughout the app.
 */
export const env = createEnv({
  /**
   * Server-side environment variables (never exposed to browser)
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  /**
   * Client-side environment variables (must be prefixed with NEXT_PUBLIC_)
   */
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  /**
   * Map process.env keys to the schema above.
   * For Next.js, NEXT_PUBLIC_ vars are available on both server and client.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /**
   * Skip validation in CI environments if needed.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
