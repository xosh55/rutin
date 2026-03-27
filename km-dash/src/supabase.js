import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://wimmxhivojtjqfzhwmbk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpbW14aGl2b2p0anFmemh3bWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MTU1NzgsImV4cCI6MjA5MDE5MTU3OH0.reDfi0hP62JsxxPmHFGki7hUub_u7zDFsPXwM_L6aEY'
)
