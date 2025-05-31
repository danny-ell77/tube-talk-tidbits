import React, { useRef, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Landing from "./pages/Landing";
import Digest from "./pages/Digest"; // Renamed from Dashboard
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import ProfilePage from "./pages/Profile";

const queryClient = new QueryClient();

// Protected route component - only allows logged-in users (not anonymous)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  return (user && !user.isAnonymous) ? <>{children}</> : <Navigate to="/login" replace />;
};

// AppInitializer handles setup of anonymous users
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, getOrCreateProfile } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // const initApp = useCallback(async () => {
  //   if (initialized) return;

  //   // If no user is logged in, get/create an anonymous user
  //   if (!user && !loading) {
  //     try {
  //       await getOrCreateProfile(null);
  //     } catch (error) {
  //       console.error("Error initializing anonymous user:", error);
  //     }
  //   }
  //   setInitialized(true);
  // }, [user, loading, initialized, getOrCreateProfile]);
  
  useEffect(() => {
    debugger;
    const initApp = async () => {
      if (initialized) return;

      // If no user is logged in, get/create an anonymous user
      if (!user) {
        try {
          await getOrCreateProfile(null);
        } catch (error) {
          console.error("Error initializing anonymous user:", error);
        }
      }
      setInitialized(true);
    };
    initApp();
  }, [user, loading, initialized, getOrCreateProfile]);
  
  return <>{children}</>;
};

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider defaultTheme="light">
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  {/* <AppInitializer> */}
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Landing />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/digest" element={<Digest />} /> {/* Public digest route */}
                    
                      {/* Protected routes */}
                      <Route 
                        path="/digest/saved" 
                      element={
                        <ProtectedRoute>
                          <Digest showSaved={true} />
                        </ProtectedRoute>
                      } 
                    />
                    {/* <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    /> */}

                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  {/* </AppInitializer> */}
                </BrowserRouter>
              </TooltipProvider>
            </ThemeProvider>
          </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;