import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, FileText, Printer, Send, Pencil, Trash2,
  CheckCircle2, Clock, XCircle, Car, UserRound,
  Package, ClipboardList, StickyNote, Receipt, AlertTriangle,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { mockInvoices, type Invoice } from "@/data/invoicesData";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  Paid: { icon: CheckCircle2, color: "bg-success/10 text-success border-success/20" },
  Pending: { icon: Clock, color: "bg-accent/10 text-accent border-accent/20" },
  Overdue: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  Draft: { icon: FileText, color: "bg-muted text-muted-foreground border-muted" },
};

function SectionHeader({ icon: Icon, title, accent }: { icon: React.ElementType; title: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | undefined>(() => mockInvoices.find((inv) => inv.id === id));

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [markPaidOpen, setMarkPaidOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold text-foreground mb-2">Invoice not found</h2>
        <Button variant="ghost" onClick={() => navigate("/workshop/invoices")}>Back to Invoices</Button>
      </div>
    );
  }

  const config = statusConfig[invoice.status];
  const hasDiscount = invoice.discount > 0;

  const handleDelete = () => {
    toast.success("Invoice deleted");
    navigate("/workshop/invoices");
  };

  const handleIssue = () => {
    setInvoice({ ...invoice, status: "Pending" });
    toast.success("Invoice issued");
    setIssueOpen(false);
  };

  const handleMarkPaid = () => {
    setInvoice({ ...invoice, status: "Paid" });
    toast.success("Invoice marked as paid");
    setMarkPaidOpen(false);
  };

  return (
    <div className="space-y-6 pb-8 min-w-0">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/workshop/invoices")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground tracking-tight font-mono">{invoice.number}</h1>
            <Badge variant="outline" className={`text-[11px] ${config.color}`}>{invoice.status}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Status-driven actions */}
          {invoice.status === "Draft" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate(`/workshop/invoices/${id}/edit`)}>
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button
                variant="outline" size="sm"
                className="text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setIssueOpen(true)}>
                <FileText className="w-3.5 h-3.5" /> Issue Invoice
              </Button>
            </>
          )}
          {invoice.status === "Pending" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Invoice sent to customer")}>
                <Send className="w-3.5 h-3.5" /> Send to Customer
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-success text-success-foreground hover:bg-success/90" onClick={() => setMarkPaidOpen(true)}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid
              </Button>
            </>
          )}
          {invoice.status === "Overdue" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Reminder sent to customer")}>
                <Bell className="w-3.5 h-3.5" /> Send Reminder
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-success text-success-foreground hover:bg-success/90" onClick={() => setMarkPaidOpen(true)}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark as Paid
              </Button>
            </>
          )}
          {invoice.status === "Paid" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Receipt className="w-3.5 h-3.5" /> Print Receipt PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Receipt sent to customer")}>
                <Send className="w-3.5 h-3.5" /> Send Receipt
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start min-w-0">
        {/* Left column */}
        <div className="space-y-6">
          {/* Invoice Details + Vehicle side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Invoice Details */}
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={FileText} title="Invoice Details" />
              </CardHeader>
              <CardContent className="pt-5 space-y-1">
                <InfoRow label="Invoice Number" value={<span className="font-mono">{invoice.number}</span>} />
                <InfoRow label="Service Date" value={invoice.date} />
                {invoice.serviceTypes.length > 0 && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-xs text-muted-foreground">Service Type</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {invoice.serviceTypes.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <InfoRow label="Technician" value={invoice.technician} />
                <InfoRow label="Odometer" value={invoice.odometer ? `${Number(invoice.odometer).toLocaleString()} km` : undefined} />
              </CardContent>
            </Card>

            {/* Vehicle */}
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={Car} title="Vehicle" />
              </CardHeader>
              <CardContent className="pt-5 space-y-1">
                <InfoRow label="Plate Number" value={<span className="font-mono">{invoice.plateNumber}</span>} />
                <InfoRow label="Vehicle Type" value={invoice.vehicleType} />
                <InfoRow label="Make / Model" value={invoice.vehicle} />
                {invoice.vin && <InfoRow label="VIN" value={<span className="font-mono text-xs">{invoice.vin}</span>} />}
                {invoice.mileageStatus !== "VALID" && (
                  <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-md bg-warning/10 border border-warning/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0" />
                    <span className="text-xs text-warning font-medium">Mileage flag</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Customer */}
          {(invoice.customer || invoice.phone || invoice.email) && (
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={UserRound} title="Customer" />
              </CardHeader>
              <CardContent className="pt-5 space-y-1">
                <InfoRow label="Name" value={invoice.customer} />
                {invoice.phone && <InfoRow label="Phone" value={invoice.phone} />}
                {invoice.email && <InfoRow label="Email" value={invoice.email} />}
              </CardContent>
            </Card>
          )}

          {/* Parts Table */}
          {invoice.parts.length > 0 && (
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={Package} title="Parts" accent />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/20">
                      <TableHead className="text-xs">Part</TableHead>
                      <TableHead className="text-xs">SKU</TableHead>
                      <TableHead className="text-xs text-center w-16">Qty</TableHead>
                      <TableHead className="text-xs text-right w-24">Unit Price</TableHead>
                      <TableHead className="text-xs text-right w-24">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.parts.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{p.name}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{p.sku}</TableCell>
                        <TableCell className="text-center text-sm">{p.quantity}</TableCell>
                        <TableCell className="text-right text-sm">${p.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">${(p.quantity * p.unitPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Labour Table */}
          {invoice.labour.length > 0 && (
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={ClipboardList} title="Labour" accent />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/20">
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs w-20">Type</TableHead>
                      <TableHead className="text-xs text-center w-16">Hours</TableHead>
                      <TableHead className="text-xs text-right w-24">Rate</TableHead>
                      <TableHead className="text-xs text-right w-24">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.labour.map((l, i) => {
                      const total = l.pricingMode === "flat" ? l.rate : l.hours * l.rate;
                      return (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{l.description}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-[10px]">
                              {l.pricingMode === "flat" ? "Flat" : "Hourly"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-sm">
                            {l.pricingMode === "flat" ? "—" : l.hours}
                          </TableCell>
                          <TableCell className="text-right text-sm">${l.rate.toFixed(2)}</TableCell>
                          <TableCell className="text-right text-sm font-semibold">${total.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={StickyNote} title="Notes" />
            </CardHeader>
            <CardContent className="pt-5">
              {invoice.description || invoice.remarks ? (
                <div className="space-y-3">
                  {invoice.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground">{invoice.description}</p>
                    </div>
                  )}
                  {invoice.remarks && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Remarks</p>
                      <p className="text-sm text-foreground">{invoice.remarks}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No notes added</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — sticky sidebar */}
        <div className="space-y-4 xl:sticky xl:top-[calc(3.5rem+1.5rem)]">
          {/* Invoice Summary */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={Receipt} title="Invoice Summary" accent />
            </CardHeader>
            <CardContent className="pt-5 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parts Total</span>
                <span className="font-medium">${invoice.partsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labour Total</span>
                <span className="font-medium">${invoice.labourTotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount {invoice.discountMode === "percent" ? `(${invoice.discount}%)` : ""}
                  </span>
                  <span className="text-destructive font-medium">
                    -${(invoice.discountMode === "percent" ? invoice.subtotal * (invoice.discount / 100) : invoice.discount).toFixed(2)}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Grand Total</span>
                <span className="text-accent">${invoice.grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="shadow-soft border-border/50">
            <CardContent className="pt-5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Parts</span>
                <span className="font-medium">{invoice.parts.length} item{invoice.parts.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Labour</span>
                <span className="font-medium">{invoice.labour.length} item{invoice.labour.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Service Types</span>
                <span className="font-medium">{invoice.serviceTypes.join(", ") || "—"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Plate</span>
                <span className="font-mono font-medium">{invoice.plateNumber}</span>
              </div>
              <Separator className="my-2" />
              <p className="text-[10px] text-muted-foreground text-center">Record Source: Workshop Invoice</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Issue Dialog */}
      <AlertDialog open={issueOpen} onOpenChange={setIssueOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Issue Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Once issued, this invoice becomes a service record and cannot be edited. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleIssue}>
              Issue Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mark as Paid Dialog */}
      <AlertDialog open={markPaidOpen} onOpenChange={setMarkPaidOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark as Paid</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this invoice as paid?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-success text-success-foreground hover:bg-success/90" onClick={handleMarkPaid}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
