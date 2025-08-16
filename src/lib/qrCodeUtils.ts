import { supabase } from './supabaseClient';

// Get the base URL from environment
const BASE = import.meta.env.VITE_APP_URL || window.location.origin;

export const buildProjectUrl = (id: string) => 
  `${BASE}/review/${id.trim().toLowerCase()}`;

export const buildQrCodeUrl = (code: string) =>
  `${BASE}/redeem/${code.trim()}`;

export const generateQrCode = async (projectId: string) => {
  try {
    const { data: project } = await supabase
      .from('wheel_projects')
      .select('id')
      .eq('id', projectId.trim().toLowerCase())
      .maybeSingle();

    if (!project) {
      throw new Error('Project not found');
    }

    return buildProjectUrl(project.id);
  } catch (error) {
    console.error('Error generating QR code URL:', error);
    throw error;
  }
};