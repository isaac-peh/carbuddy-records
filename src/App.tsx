import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import B2BLayout from "./layouts/B2BLayout";
import Dashboard from "./pages/workshop/Dashboard";
import Inventory from "./pages/workshop/Inventory";
import Invoices from "./pages/workshop/Invoices";
import Services from "./pages/workshop/Services";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* B2B Workshop Platform */}
          <Route path="/workshop" element={<B2BLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="parts" element={<Inventory />} />
            <Route path="inventory" element={<Navigate to="/workshop/parts" replace />} />
            <Route path="services" element={<Services />} />
            <Route path="invoices" element={<Invoices />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
