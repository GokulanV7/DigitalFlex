export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  stripe: {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || "",
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3002",
  },
  app: {
    name: "Digital Collectibles Marketplace",
    version: "1.0.0",
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
} as const;

export type Config = typeof config;
