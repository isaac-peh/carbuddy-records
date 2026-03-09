import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Plus, Trash2, Car, Calendar, DollarSign, FileText, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockCustomers } from "@/data/customersData";
import { mockInvoices } from "@/data/invoicesData";

const statusColor: Record<string, string> = {
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Awaiting Parts": "bg-warning/10 text-warning border-warning/20",
  "Scheduled": "bg-secondary text-foreground border-border/50",
  "Paid": "bg-success/10 text-success border-success/20",
  "Pending": "bg-accent/10 text-accent border-accent/20",
  "Overdue": "bg-destructive/10 text-destructive border-destructive/20",
  "Draft": "bg-secondary text-muted-foreground border-border/50",
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const customer = mockCustomers.find(c => c.id === id);
  const [activeVehicle, setActiveVehicle] = useState<string | null>(null);
  const [notes, setNotes] = useState(customer?.notes || "");

  // Get customer's invoices and sort newest first
  const customerInvoices = useMemo(() => {
    if (!customer) return [];
    let invoices = mockInvoices
      .filter(i => customer.invoiceHistory.includes(i.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (activeVehicle) {
      invoices = invoices.filter(i => i.plateNumber === activeVehicle);
    }
    return invoices;
  }, [customer, activeVehicle]);

  // Extract top services
  const topServices = useMemo(() => {
    if (!customer) return [];
    const serviceCounts: Record<string, number> = {};
    mockInvoices.filter(i => customer.invoiceHistory.includes(i.id)).forEach(inv => {
      inv.serviceTypes.forEach(t => {
        serviceCounts[t] = (serviceCounts[t] || 0) + 1;
      });
    });
    return Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [customer]);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold mb-2">Customer Not Found</h2>
        <Button onClick={() => navigate('/workshop/customers')} variant="outline">Back to Customers</Button>
      </div>
    );
  }

  const handleSaveNotes = () => {
    toast({ title: "Note saved", description: "Customer notes have been updated." });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" className="-ml-3 mb-2 text-muted-foreground hover:text-foreground" onClick={() => navigate('/workshop/customers')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Customers
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xl shrink-0">
              {customer.name.split(' ').map(n=>n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                {customer.name}
                {customer.loyaltyStatus === 'VIP' && <Badge variant="secondary" className="bg-warning/20 text-warning hover:bg-warning/20">VIP</Badge>}
                {customer.loyaltyStatus === 'Regular' && <Badge variant="secondary">Regular</Badge>}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span>{customer.phone}</span>
                {customer.email && <span>• {customer.email}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => navigate('/workshop/invoices/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
            <Button variant="outline" className="text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vehicles Seen */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                Vehicles
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {customer.vehicles.map(v => (
                  <div 
                    key={v.plate} 
                    className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-colors ${
                      activeVehicle === v.plate ? "bg-accent/5" : "hover:bg-secondary/20"
                    }`}
                    onClick={() => setActiveVehicle(activeVehicle === v.plate ? null : v.plate)}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`font-mono ${activeVehicle === v.plate ? "border-accent text-accent" : ""}`}>
                          {v.plate}
                        </Badge>
                        <span className="font-medium">{v.make} {v.model} {v.year}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.type} • Last service: {v.lastServiceDate}</p>
                    </div>
                    <Badge variant="secondary">{v.visitCount} visits</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visit History Timeline */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Visit History
              </CardTitle>
              {activeVehicle && (
                <Badge variant="secondary" className="cursor-pointer hover:bg-destructive/20 hover:text-destructive" onClick={() => setActiveVehicle(null)}>
                  Filter: {activeVehicle} ✕
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 space-y-8 border-l-2 border-border/50 py-2">
                {customerInvoices.map((invoice, i) => (
                  <div key={invoice.id} className="relative">
                    {/* Timeline dot */}
                    <div className={`absolute -left-[33px] w-4 h-4 rounded-full border-4 border-background ${
                      invoice.status === 'Paid' ? 'bg-success' : 
                      invoice.status === 'Pending' ? 'bg-accent' : 
                      invoice.status === 'Overdue' ? 'bg-destructive' : 'bg-muted'
                    }`} />
                    
                    <div className="bg-secondary/20 p-4 rounded-lg border border-border/50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-mono text-sm font-medium hover:text-accent cursor-pointer transition-colors"
                              onClick={() => navigate(`/workshop/invoices/${invoice.id}`)}
                            >
                              {invoice.number}
                            </span>
                            <span className="text-xs text-muted-foreground">{invoice.date}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-[10px] bg-background">{invoice.plateNumber}</Badge>
                            <span className="text-xs text-muted-foreground">{invoice.odometer} km</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${invoice.grandTotal}</div>
                          <Badge variant="outline" className={`text-[10px] mt-1 ${statusColor[invoice.status] || ""}`}>
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">{invoice.services}</p>
                        <div className="flex gap-1 flex-wrap">
                          {invoice.serviceTypes.map(t => (
                            <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex gap-1.5 flex-wrap flex-1">
                          {invoice.parts.slice(0, 2).map(p => (
                            <div key={p.sku} className="text-[11px] bg-background border border-border/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              {p.name}
                            </div>
                          ))}
                          {invoice.parts.length > 2 && (
                            <div className="text-[11px] bg-background border border-border/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              +{invoice.parts.length - 2} more
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground ml-4 shrink-0 flex items-center">
                          <Wrench className="w-3 h-3 mr-1" />
                          {invoice.technician}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {customerInvoices.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">No visits found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar (Sticky) */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Summary Card */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Visits</span>
                  <span className="font-medium">{customer.totalVisits}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Spent</span>
                  <span className="font-bold text-foreground">${customer.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Outstanding</span>
                  <span className={`font-medium ${customer.outstandingBalance > 0 ? "text-warning" : ""}`}>
                    ${customer.outstandingBalance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">Avg Spend / Visit</span>
                  <span className="text-sm font-medium">
                    ${Math.round(customer.totalSpent / Math.max(1, customer.totalVisits)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">First Visit</span>
                  <span className="text-sm">{customer.firstVisitDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          {topServices.length > 0 && (
            <Card className="shadow-soft border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Preferred Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topServices.map(([service, count], i) => (
                  <div key={service} className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-muted-foreground">{i + 1}.</span>
                    <span className="flex-1 font-medium truncate">{service}</span>
                    <Badge variant="secondary">{count}×</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="shadow-soft border-border/50 bg-secondary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Add private notes about this customer..."
                className="min-h-[120px] bg-background resize-none mb-3"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
              <Button size="sm" className="w-full" onClick={handleSaveNotes}>
                Save Notes
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}