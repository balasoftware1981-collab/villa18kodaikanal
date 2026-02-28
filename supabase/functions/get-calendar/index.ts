import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Initialize the Supabase client with internal system keys
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Fetch all confirmed bookings to generate the calendar events
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, room_rates(room_name)')
    .eq('status', 'confirmed')

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  // Generate iCal format header
  let ical = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Villa18//NONSGML v1.0//EN\n";

  // Loop through bookings and add each as an event
  bookings?.forEach(b => {
    ical += "BEGIN:VEVENT\n";
    ical += `SUMMARY:Booked - ${b.room_rates?.room_name || 'Villa18'}\n`;
    ical += `DTSTART;VALUE=DATE:${b.check_in.replace(/-/g, '')}\n`;
    ical += `DTEND;VALUE=DATE:${b.check_out.replace(/-/g, '')}\n`;
    ical += "END:VEVENT\n";
  });

  ical += "END:VCALENDAR";

  // Return the calendar file with the correct content type for portals
  return new Response(ical, { 
    headers: { 
      "Content-Type": "text/calendar",
      "Access-Control-Allow-Origin": "*" 
    } 
  })
})