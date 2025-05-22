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
