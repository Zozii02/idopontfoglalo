import { createClient } from '@supabase/supabase-js'

// Ha a Vercel valamiért nem találja a kulcsot építéskor, berakunk egy "vak" kulcsot, 
// hogy ne omoljon össze a rendszer, és az építés le tudjon futni!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ideiglenes.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "ideiglenes_kulcs_hogy_ne_szalljon_el_a_build"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)