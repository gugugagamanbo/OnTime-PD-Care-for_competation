/**
 * API integration interface for the Parkinson care onboarding stub.
 * Replace the base URL and implement actual HTTP calls when connecting to your backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.parkinson-care.example.com';

export interface OnboardingProfile {
  phoneNumber: string;
  countryCode: string;
  profileFor: 'self' | 'family' | 'caregiver';
  priorityArea: 'medication' | 'symptom' | 'coordination' | 'unsure';
  symptomFocuses: string[];
  reportFocuses: string[];
  severityLevels: Record<string, 'mild' | 'moderate' | 'severe'>;
  language: 'zh' | 'en';
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Send OTP verification code */
export async function sendOtp(phone: string, countryCode: string): Promise<ApiResponse> {
  console.log(`[API Stub] sendOtp: ${countryCode}${phone}`);
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/auth/send-otp`, { method: 'POST', body: JSON.stringify({ phone, countryCode }) });
  return { success: true };
}

/** Verify OTP code */
export async function verifyOtp(phone: string, code: string): Promise<ApiResponse<{ token: string }>> {
  console.log(`[API Stub] verifyOtp: ${phone}, code: ${code}`);
  // TODO: Replace with actual API call
  return { success: true, data: { token: 'mock-token' } };
}

/** Submit completed onboarding profile to backend */
export async function submitOnboardingProfile(profile: OnboardingProfile): Promise<ApiResponse> {
  console.log('[API Stub] submitOnboardingProfile:', profile);
  // TODO: Replace with actual API call
  // return fetch(`${API_BASE_URL}/onboarding/profile`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  //   body: JSON.stringify(profile),
  // });
  return { success: true };
}

/** Fetch user profile (check if onboarding is complete) */
export async function getUserProfile(): Promise<ApiResponse<OnboardingProfile | null>> {
  console.log('[API Stub] getUserProfile');
  // TODO: Replace with actual API call
  return { success: true, data: null };
}

export { API_BASE_URL };
