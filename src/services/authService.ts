import { supabase } from "@/integrations/supabase/client";

export const getAuthHeaders = async () => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // "ngrok-skip-browser-warning": "1", // This header bypasses the warning
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const headers = await getAuthHeaders();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    // credentials: "include",
    mode: "cors",
  };

  return fetch(url, requestOptions);
};

/**
 * Send a password reset email to the user
 * @param email User's email address
 * @returns Promise resolving to the result of the operation
 */
export const sendPasswordResetEmail = async (email: string) => {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
};

/**
 * Update user's password after reset
 * @param newPassword New password to set
 * @returns Promise resolving to the result of the operation
 */
export const updatePassword = async (newPassword: string) => {
  return supabase.auth.updateUser({ password: newPassword });
};
