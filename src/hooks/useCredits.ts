import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // Adjust the import based on your project structure
import { useAuth } from "@/contexts/AuthContext";

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch the current user's credit balance directly from the database
   */
  const fetchCredits = async (): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("user_id", user?.id)
        .single();

      if (profileError) throw profileError;

      const creditBalance = profile?.credits ?? 0;
      setCredits(creditBalance);
      return creditBalance;
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to fetch credits");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch the user's credit balance from the API
   * This will have the most up-to-date value
   */
  const fetchCreditsFromAPI = async (): Promise<number | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/credits", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch credits from API");

      const data = await response.json();
      const creditBalance = data.credits ?? 0;
      setCredits(creditBalance);
      return creditBalance;
    } catch (err) {
      console.error("Error fetching credits from API:", err);
      setError("Failed to fetch credits");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Synchronize credits between API and local state
   */
  const syncCredits = async (): Promise<number | null> => {
    // First try the API for the most up-to-date value
    const apiCredits = await fetchCreditsFromAPI().catch(() => null);

    // If API call fails, fall back to direct database query
    if (apiCredits === null) {
      return await fetchCredits();
    }

    return apiCredits;
  };

  /**
   * Update the local credit count (use when receiving credit info from API)
   */
  const updateLocalCredits = (newCreditBalance: number) => {
    setCredits(newCreditBalance);
  };

  return {
    credits,
    loading,
    error,
    fetchCredits,
    fetchCreditsFromAPI,
    syncCredits,
    updateLocalCredits,
  };
};

export default useCredits;
