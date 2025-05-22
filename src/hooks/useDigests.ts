import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import { Digest } from "@/types/digest";

export const useDigests = () => {
  const supabase = useSupabaseClient<Database>();
  const [loading, setLoading] = useState(false);

  const saveDigest = async (digest: Digest) => {
    setLoading(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("digests")
        .single();

      if (error) throw error;

      const existingDigests = profile.digests
        ? JSON.parse(profile.digests as string)
        : [];
      const updatedDigests = [...existingDigests, digest];

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ digests: JSON.stringify(updatedDigests) });

      if (updateError) throw updateError;
      return true;
    } catch (error) {
      console.error("Error saving digest:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDigests = async (): Promise<Digest[]> => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("digests")
        .single();

      if (error) throw error;
      return profile.digests ? JSON.parse(profile.digests as string) : [];
    } catch (error) {
      console.error("Error fetching digests:", error);
      return [];
    }
  };

  return {
    saveDigest,
    getDigests,
    loading,
  };
};
