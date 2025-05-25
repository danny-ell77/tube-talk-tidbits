import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await resetPassword(data.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      // Error is already handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CardTitle className="text-2xl font-bold mb-4">Check Your Email</CardTitle>
          </CardHeader>
        <CardContent className="space-y-4">
        <p className="mb-6">
          We've sent password reset instructions to your email address.
          Please check your inbox and follow the link to reset your password.
        </p>
        <Button asChild>
          <Link to="/login">Return to Login</Link>
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
                Enter your email address below and we'll send you instructions to reset your password.
              </CardDescription>
        </CardHeader>
      
          <CardContent className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                    <FormControl>

                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                <FormMessage />
              </FormItem>
            )}
                  />
                  <div className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Instructions"}
        </Button>
        <Button variant="outline" asChild>
          <Link to="/login">Back to Login</Link>
        </Button>
      </div>
        </form>
              </Form>
              </CardContent>
    </Card>
  );
};

export default ForgotPassword;
