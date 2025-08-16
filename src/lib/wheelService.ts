import { supabase } from './supabaseClient';
import { generateQrCode } from './qrCodeUtils';

interface CreateWheelProject {
  name: string;
  description?: string;
  prizes: Array<{
    label: string;
    probability: number;
    color: string;
  }>;
}

export const createProject = async (project: CreateWheelProject) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Insert the project
    const { data, error } = await supabase
      .from('wheel_projects')
      .insert({
        ...project,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create project');

    // Generate QR code URL
    const qrUrl = await generateQrCode(data.id);

    return {
      ...data,
      qrUrl,
    };
  } catch (error) {
    console.error('Error creating wheel project:', error);
    throw error;
  }
};