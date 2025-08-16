import { supabase } from './supabaseClient';

export interface Template {
  id: string;
  name: string;
  slug: string;
  vertical: string;
  version: string;
  description: string;
  min_stars: number;
  expiry_days: number;
  prizes: Array<{
    label: string;
    probability: number;
  }>;
  disclaimer?: string;
  created_at: string;
}

export async function fetchTemplate(slug: string, version = "v1.0"): Promise<Template> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .eq('version', version)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Template not found');

  return data as Template;
}

export async function listTemplates(vertical?: string): Promise<Template[]> {
  let query = supabase.from('templates').select('*');
  
  if (vertical) {
    query = query.eq('vertical', vertical);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Template[];
}