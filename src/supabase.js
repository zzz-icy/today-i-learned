import { createClient } from "@supabase/supabase-js"
const supabaseUrl = "https://yvuudvqduzfmdoklrszg.supabase.corrr"
const supabaseKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2dXVkdnFkdXpmbWRva2xyc3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4ODY3ODYsImV4cCI6MjAyNjQ2Mjc4Nn0.xfgs_xM3xzSO04ToBWO99RfsyXptGMKhtAwFHMIrPc8"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase
