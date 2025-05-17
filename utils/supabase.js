import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://supabase-demo.example.com';
const supabaseKey = 'eyJh...demo-key...xyz123';

export const supabase = createClient(supabaseUrl, supabaseKey);