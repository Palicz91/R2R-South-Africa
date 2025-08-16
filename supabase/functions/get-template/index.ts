import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get query parameters
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    const version = url.searchParams.get('version') || 'v1.0';

    if (!slug) {
      throw new Error('Slug parameter is required');
    }

    // Query the template
    const { data: template, error } = await supabase
      .from('templates')
      .select('*')
      .eq('slug', slug)
      .eq('version', version)
      .single();

    if (error) throw error;
    if (!template) throw new Error('Template not found');

    return new Response(
      JSON.stringify(template),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error in get-template function:', error);
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});