import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updateUserPassword, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if URL has a valid hash for password reset
    const checkResetToken = async () => {
      try {
        setChecking(true);
        
        // This will automatically read the hash from the URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setTokenValid(false);
          return;
        }

        // If we have an active session with recovery mode, the token is valid
        // We specifically look for a recovery session type vs normal login
        const isRecoverySession = data.session?.user?.email_confirmed_at && 
                                 data.session?.user?.aud === 'authenticated' &&
                                 window.location.hash.includes('type=recovery');
                                 
        setTokenValid(!!isRecoverySession);
      } catch (err) {
        console.error('Error verifying reset token:', err);
        setTokenValid(false);
      } finally {
        setChecking(false);
      }
    };

    checkResetToken();
  }, []);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!tokenValid) {
      toast.error('Invalid or expired password reset link');
      return;
    }

    setIsLoading(true);

    try {
      await updateUserPassword(data.password);
      toast.success('Password successfully reset!');
      
      // Add a delay before navigation
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      // Main error is handled in auth context
    } finally {
      setIsLoading(false);
    }
  };
  if (checking) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <p>Verifying password reset link...</p>
        </CardContent>
      </Card>
    );
  }

  if (!checking && !tokenValid) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CardTitle className="text-2xl font-bold mb-4">Invalid Reset Link</CardTitle>
          <CardDescription className="mb-6">
            Your password reset link is invalid or has expired. Please request a new password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <a href="/forgot-password">Request New Reset Link</a>
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <CardTitle className="text-2xl font-bold mb-6">Reset Your Password</CardTitle>
        <CardDescription className="mb-6">
          Enter your new password below.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        {...field} 
                      />
                      <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
            {isLoading || authLoading ? "Resetting..." : "Reset Password"}
          </Button>
                  </form>
              </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
