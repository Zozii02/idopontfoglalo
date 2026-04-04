import { createClient } from '@supabase/supabase-js'

// Fixen beégetjük a publikus kulcsokat, így a Vercel nem tud belekötni!
const supabaseUrl = "https://smixmicmxxwhvthrttpt.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtaXhtaWNteHh3aHZ0aHJ0dHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDkxMzMsImV4cCI6MjA5MDg4NTEzM30.ytCIj6TLuqBEEYzm_wOR8cMpPgMv8thz05TKLPgirAY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)