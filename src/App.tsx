import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Console from "./pages/Console";
import Profile from "./pages/Profile";
import MetaVatar from "./pages/MetaVatar";
import NotFound from "./pages/NotFound";
import { Auth } from "./components/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { initMoneyPenny } from "./lib/aigent/moneypenny/client";
import { AgentiQConfig } from "./lib/aigent/core/types";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize MoneyPenny client
    const config: AgentiQConfig = {
      agentClass: 'moneypenny',
      tenantId: 'qripto-hft',
      enableA2A: true,
    };

    try {
      initMoneyPenny(config, queryClient);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize MoneyPenny:', error);
      setIsInitialized(true); // Continue anyway to show UI
    }
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing MoneyPenny...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/console" element={<ProtectedRoute><Console /></ProtectedRoute>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/metavatar" element={<MetaVatar />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
