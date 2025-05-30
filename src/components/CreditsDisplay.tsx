import React, { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CircleDollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

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
  const { user, setUser } = useAuth();


  useEffect(() => {
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
              setUser((prevUser) => prevUser ? {
                ...prevUser,
                credits: 0,
              } : null);
            } else {
              setUser((prevUser) => prevUser ? {
                ...prevUser,
                credits: payload.new.credits,
              } : null);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  // Get custom styling based on credit amount using YouTube's color spectrum
  const getCreditsStyle = () => {
    const creditAmount = user?.credits || 0;
    
    if (creditAmount <= 0) {
      return {
        variant: 'outline' as const,
        customClasses: 'border-red-600 text-red-600 bg-transparent dark:border-red-400 dark:text-red-200 dark:bg-red-950/60'
      };
    } else if (creditAmount <= 2) {
      return {
        variant: 'secondary' as const,
        customClasses: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:hover:bg-yellow-800'
      };
    } else if (creditAmount <= 5) {
      return {
        variant: 'secondary' as const,
        customClasses: 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800'
      };
    } else if (creditAmount <= 10) {
      return {
        variant: 'secondary' as const,
        customClasses: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
      };
    } else {
      return {
        variant: 'secondary' as const,
        customClasses: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
      };
    }
  };

  const creditsStyle = getCreditsStyle();

  return (
    <Badge 
      variant={creditsStyle.variant}
      className={cn(
        "font-medium transition-colors",
        creditsStyle.customClasses,
        className
      )}
    >
      {showIcon && <CircleDollarSign className="w-3 h-3 mr-1.5" />}
      {user?.credits ?? 0} credits
    </Badge>
  );
};

export default CreditsDisplay;
