import { createClient } from "@supabase/supabase-js";

// ==========================================
// SUPABASE CONFIGURATION
// Replace these values with your project's
// actual Supabase URL and Anon/Public Key.
// ==========================================

// 1. Paste your Supabase project URL here:
const SUPABASE_URL = "https://kmdsobunpdlqnmctjdka.supabase.co";

// 2. Paste your Supabase project Public/Anon API key here:
const SUPABASE_PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZHNvYnVucGRscW5tY3RqZGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjQ0MzQsImV4cCI6MjA5NzIwMDQzNH0.0IkyQTUzYvk8C0eHAcz_xIvGweAtrJwSxqotjJP_IPA";

// Initialize and export the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
