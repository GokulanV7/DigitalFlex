import { createClient } from '@supabase/supabase-js';
import { config } from '@/config';

// Use the centralized configuration from config/index.ts
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);
