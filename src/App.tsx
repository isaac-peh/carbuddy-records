import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import B2BLayout from "./layouts/B2BLayout";
import Dashboard from "./pages/workshop/Dashboard";
import Inventory from "./pages/workshop/Inventory";
import Invoices from "./pages/workshop/Invoices";
import CreateInvoice from "./pages/workshop/CreateInvoice";
import InvoiceDetail from "./pages/workshop/InvoiceDetail";
import Services from "./pages/workshop/Services";
import Reports from "./pages/workshop/Reports";
import Customers from "./pages/workshop/Customers";
import CustomerDetail from "./pages/workshop/CustomerDetail";
import Suppliers from "./pages/workshop/Suppliers";
import PurchaseOrders from "./pages/workshop/PurchaseOrders";
import CreatePurchaseOrder from "./pages/workshop/CreatePurchaseOrder";
import PurchaseOrderDetail from "./pages/workshop/PurchaseOrderDetail";
import { Navigate } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* B2B Workshop Platform */}
            <Route path="/workshop" element={<B2BLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="services" element={<Services />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="purchase-orders/new" element={<CreatePurchaseOrder />} />
              <Route path="purchase-orders/:id" element={<PurchaseOrderDetail />} />
              <Route path="purchase-orders/:id/edit" element={<CreatePurchaseOrder />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="invoices/new" element={<CreateInvoice />} />
              <Route path="invoices/:id" element={<InvoiceDetail />} />
              <Route path="invoices/:id/edit" element={<CreateInvoice />} />
              <Route path="reports" element={<Reports />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/:id" element={<CustomerDetail />} />
              <Route path="suppliers" element={<Suppliers />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
