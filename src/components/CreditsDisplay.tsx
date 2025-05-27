import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {supabase} from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';  // Import the cn utility if available

interface CreditsDisplayProps {
  showIcon?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const CreditsDisplay: React.FC<CreditsDisplayProps> = ({
  showIcon = true,
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const { user, refreshUserData, setUser } = useAuth();

  useEffect(() => {
    refreshUserData();

    // Only set up subscription if user exists and has an ID
    if (user?.id) {
      const subscription = supabase
        .channel(`profile-${user.id}`)
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public', 
            table: 'profiles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'DELETE') {
              setUser((prevUser) => ({
                ...prevUser,
                credits: 0,
              }));
            } else {
              setUser((prevUser) => ({
                ...prevUser,
                credits: payload.new.credits,
              }));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id, user?.credits]);

  // Determine the badge variant based on credit amount
  const getBadgeVariant = () => {
    const creditAmount = user?.credits || 0;
    if (creditAmount <= 0) {
      return 'outline'; // Changed from 'destructive' to 'outline' for less intense styling
    } else if (creditAmount < 5) {
      return 'secondary';
    }
    return variant;
  };

  // Add a custom class for no credits that's less intense than destructive
  const customClass = user?.credits <= 0 ? 'text-red-500/70' : '';

  return (
    <Badge 
      variant={getBadgeVariant()} 
      className={cn(`font-semibold ${className}`, customClass)}
    >
      {showIcon && <CircleDollarSign className="w-3 h-3 mr-1" />}
      {user?.credits ?? 0} credits
    </Badge>
  );
};

export default CreditsDisplay;
