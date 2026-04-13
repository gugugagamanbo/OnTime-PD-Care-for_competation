import { supabase } from '@/integrations/supabase/client';

interface ScanResult {
  name: string;
  strength: string;
  dose: string;
  times: string[];
  instruction: string;
  confidence: '高' | '中';
}

interface ReportInput {
  medications?: Array<{ name: string; dose: string; times: string[] }>;
  symptoms?: Array<{ symptom: string; severity: string; time?: string }>;
  logs?: Array<{ status: string; scheduled_time: string; actual_time?: string }>;
  deviceData?: Record<string, unknown>;
}

export async function scanPrescription(content: string): Promise<{ medications?: ScanResult[]; error?: string }> {
  const { data, error } = await supabase.functions.invoke('ai-care', {
    body: { action: 'scan-prescription', content },
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { medications: data?.medications };
}

export async function generateReport(input: ReportInput): Promise<{ result?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('ai-care', {
    body: { action: 'generate-report', ...input },
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { result: data?.result };
}

export async function generateVisitSummary(input: ReportInput): Promise<{ result?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('ai-care', {
    body: { action: 'visit-summary', ...input },
  });

  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { result: data?.result };
}
