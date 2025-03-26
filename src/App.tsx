
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import FAQ from "./pages/FAQ";
import BestGames from "./pages/BestGames";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./hooks/use-toast";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ToastProvider>
            <BrowserRouter>
              <LanguageProvider>
                <AuthProvider>
                  <Toaster />
                  <Sonner />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/best-games" element={<BestGames />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </LanguageProvider>
            </BrowserRouter>
          </ToastProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);

export default App;
