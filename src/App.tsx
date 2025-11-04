import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { monitoringService, initializeErrorHandling } from "@/lib/monitoring";
import { observabilityService } from "@/lib/observability";
import { useEffect, Suspense, lazy } from "react";

// Initialize Guardian middleware
if (typeof window !== 'undefined') {
  import('../guardian/middleware').then(({ initializeGuardianMiddleware }) => {
    initializeGuardianMiddleware();
  });
}
import Index from "./pages/Index";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import ROICalculator from "./pages/ROICalculator";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Platform from "./pages/Platform";
import NotFound from "./pages/NotFound";
import PrivacyCompliance from "./components/PrivacyCompliance";
import TrustBadges from "./components/TrustBadges";
import AutomationDashboard from "./components/AutomationDashboard";
import BusinessDashboard from "./components/BusinessDashboard";
import Pricing from "./components/Pricing";
import Marketplace from "./components/platform/Marketplace";
import PartnershipPortal from "./components/PartnershipPortal";
import Health from "./pages/Health";

// Lazy load heavy components
const LazyPlatform = lazy(() => import("./pages/Platform"));
const LazyAdmin = lazy(() => import("./pages/Admin"));
const LazyBusinessDashboard = lazy(() => import("./components/BusinessDashboard"));
const LazyAutomationDashboard = lazy(() => import("./components/AutomationDashboard"));
const LazyMarketplace = lazy(() => import("./components/platform/Marketplace"));
const LazyPartnershipPortal = lazy(() => import("./components/PartnershipPortal"));
const LazyTrustDashboard = lazy(() => import("./pages/TrustDashboard"));
const LazyGuardianOnboarding = lazy(() => import("./pages/GuardianOnboarding"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize error handling
    initializeErrorHandling();
    
    // Initialize observability service
    observabilityService;
    
    // Track app initialization
    monitoringService.trackEvent('app_initialized', {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE,
      userAgent: navigator.userAgent,
    });

    // Track page view
    monitoringService.trackPageView(window.location.pathname);
    
    // Record performance metrics
    observabilityService.recordMetric('app_initialized', 1, {
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment: import.meta.env.MODE
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatedBackground />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/roi-calculator" element={<ROICalculator />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyAdmin />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyBusinessDashboard />
              </Suspense>
            } />
            <Route path="/platform/*" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyPlatform />
              </Suspense>
            } />
            <Route path="/marketplace" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyMarketplace />
              </Suspense>
            } />
            <Route path="/partners" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyPartnershipPortal />
              </Suspense>
            } />
            <Route path="/privacy" element={<PrivacyCompliance />} />
            <Route path="/trust" element={<TrustBadges />} />
            <Route path="/automation" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyAutomationDashboard />
              </Suspense>
            } />
            <Route path="/health" element={<Health />} />
            <Route path="/dashboard/trust" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyTrustDashboard />
              </Suspense>
            } />
            <Route path="/guardian/onboarding" element={
              <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
                <LazyGuardianOnboarding />
              </Suspense>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
