// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://itgbdhdccbxlqrdjjjpa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Z2JkaGRjY2J4bHFyZGpqanBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MTE5NzcsImV4cCI6MjA2ODQ4Nzk3N30.Sq8LDJVdukHMiooftRy_I7oKKVot6wfTWNQFXYS6FtQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});