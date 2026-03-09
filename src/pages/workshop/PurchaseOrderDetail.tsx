import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, Pencil, Trash2, Send, Printer, PackageCheck,
  FileText, Package, StickyNote, Truck, AlertTriangle,
  CheckCircle2, Clock, XCircle, CircleDot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { mockPurchaseOrders, type PurchaseOrder, type POStatus } from "@/data/purchaseOrdersData";
import { mockSuppliers } from "@/data/suppliersData";

const STATUS_CONFIG: Record<POStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground border-muted", icon: FileText },
  ORDERED: { label: "Ordered", className: "bg-accent/10 text-accent border-accent/20", icon: Send },
  PARTIALLY_RECEIVED: { label: "Partially Received", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  RECEIVED: { label: "Received", className: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
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

export default function PurchaseOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [po, setPO] = useState<PurchaseOrder | undefined>(() => mockPurchaseOrders.find(p => p.id === id));

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [receiveQtys, setReceiveQtys] = useState<Record<string, number>>({});

  if (!po) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-lg font-semibold text-foreground mb-2">Purchase order not found</h2>
        <Button variant="ghost" onClick={() => navigate("/workshop/purchase-orders")}>Back to Purchase Orders</Button>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[po.status];
  const supplier = po.supplierId ? mockSuppliers.find(s => s.id === po.supplierId) : null;
  const isOverdue = (po.status === "ORDERED" || po.status === "PARTIALLY_RECEIVED") && po.expectedDeliveryDate && new Date(po.expectedDeliveryDate) < new Date();

  // Receiving progress
  const totalOrdered = po.lines.reduce((s, l) => s + l.quantityOrdered, 0);
  const totalReceived = po.lines.reduce((s, l) => s + l.quantityReceived, 0);
  const receivePercent = totalOrdered > 0 ? Math.min(100, Math.round((totalReceived / totalOrdered) * 100)) : 0;

  const openReceiveDialog = () => {
    const qtys: Record<string, number> = {};
    po.lines.forEach(l => { qtys[l.id] = Math.max(0, l.quantityOrdered - l.quantityReceived); });
    setReceiveQtys(qtys);
    setReceiveOpen(true);
  };

  const hasOverReceipt = po.lines.some(l => {
    const receiving = receiveQtys[l.id] || 0;
    return l.quantityReceived + receiving > l.quantityOrdered;
  });

  const handleSubmit = () => {
    setPO({ ...po, status: "ORDERED", orderDate: new Date().toISOString().slice(0, 10) });
    toast.success("Order submitted");
    setSubmitOpen(false);
  };

  const handleCancel = () => {
    setPO({ ...po, status: "CANCELLED" });
    toast.success("Purchase order cancelled");
    setCancelOpen(false);
  };

  const handleDelete = () => {
    toast.success("Purchase order deleted");
    navigate("/workshop/purchase-orders");
  };

  const handleConfirmReceipt = () => {
    const updatedLines = po.lines.map(l => ({
      ...l,
      quantityReceived: l.quantityReceived + (receiveQtys[l.id] || 0),
    }));
    const allReceived = updatedLines.every(l => l.quantityReceived >= l.quantityOrdered);
    const someReceived = updatedLines.some(l => l.quantityReceived > 0);
    let newStatus: POStatus = po.status;
    if (allReceived) newStatus = "RECEIVED";
    else if (someReceived) newStatus = "PARTIALLY_RECEIVED";
    setPO({
      ...po,
      lines: updatedLines,
      status: newStatus,
      receivedDate: allReceived ? new Date().toISOString().slice(0, 10) : po.receivedDate,
    });
    toast.success(allReceived ? "Goods received. Stock levels updated." : "Partial receipt recorded.");
    setReceiveOpen(false);
  };

  // Timeline steps
  const steps = [
    { label: "Created", date: po.createdAt, done: true },
    { label: "Ordered", date: po.orderDate, done: po.status !== "DRAFT" && po.status !== "CANCELLED" },
    ...(po.status === "PARTIALLY_RECEIVED" || (po.status === "RECEIVED" && po.lines.some(l => l.quantityReceived !== l.quantityOrdered))
      ? [{ label: "Partially Received", date: null, done: po.status === "PARTIALLY_RECEIVED" || po.status === "RECEIVED" }]
      : []),
    { label: po.status === "CANCELLED" ? "Cancelled" : "Received", date: po.status === "CANCELLED" ? null : po.receivedDate, done: po.status === "RECEIVED" || po.status === "CANCELLED" },
  ];

  return (
    <div className={cn("space-y-6 pb-8 min-w-0", po.status === "CANCELLED" && "opacity-70")}>
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => navigate("/workshop/purchase-orders")}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground tracking-tight font-mono">{po.poNumber}</h1>
            <Badge variant="outline" className={cn("text-[11px]", cfg.className)}>{cfg.label}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {po.status === "DRAFT" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => navigate(`/workshop/purchase-orders/${id}/edit`)}>
                <Pencil className="w-3.5 h-3.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setCancelOpen(true)}>
                <XCircle className="w-3.5 h-3.5" /> Cancel PO
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setSubmitOpen(true)}>
                <Send className="w-3.5 h-3.5" /> Submit Order
              </Button>
            </>
          )}
          {po.status === "ORDERED" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print PO
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90" onClick={openReceiveDialog}>
                <PackageCheck className="w-3.5 h-3.5" /> Receive Goods
              </Button>
            </>
          )}
          {po.status === "PARTIALLY_RECEIVED" && (
            <>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                <Printer className="w-3.5 h-3.5" /> Print PO
              </Button>
              <Button size="sm" className="text-xs gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90" onClick={openReceiveDialog}>
                <PackageCheck className="w-3.5 h-3.5" /> Receive Remaining
              </Button>
            </>
          )}
          {po.status === "RECEIVED" && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
              <Printer className="w-3.5 h-3.5" /> Print PO
            </Button>
          )}
          {po.status === "CANCELLED" && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-3.5 h-3.5" /> Delete PO
            </Button>
          )}
        </div>
      </div>

      {/* Muted subtext */}
      <p className="text-sm text-muted-foreground -mt-2">
        {po.supplierName || "Ad-hoc"} · {po.orderDate ? `Ordered ${po.orderDate}` : "Not ordered"} · {po.expectedDeliveryDate ? `Expected ${po.expectedDeliveryDate}` : "No delivery date"}
      </p>

      {/* Received banner */}
      {po.status === "RECEIVED" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
          <CheckCircle2 className="w-4 h-4 text-success" />
          <span className="text-sm font-medium text-success">Fully Received — {po.receivedDate}</span>
        </div>
      )}

      {/* Cancelled watermark */}
      {po.status === "CANCELLED" && (
        <div className="text-center py-2">
          <span className="text-4xl font-bold text-muted-foreground/20 tracking-widest">CANCELLED</span>
        </div>
      )}

      {/* Overdue banner */}
      {isOverdue && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-warning">This order is overdue — expected delivery was {po.expectedDeliveryDate}.</span>
        </div>
      )}

      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start min-w-0">
        {/* Left column */}
        <div className="space-y-6">
          {/* PO Details */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={FileText} title="PO Details" />
            </CardHeader>
            <CardContent className="pt-5 space-y-1">
              <InfoRow label="PO Number" value={<span className="font-mono">{po.poNumber}</span>} />
              <InfoRow label="Supplier" value={po.supplierName || <span className="italic text-muted-foreground">Ad-hoc</span>} />
              <InfoRow label="Order Date" value={po.orderDate || "—"} />
              <InfoRow label="Expected Delivery" value={po.expectedDeliveryDate || "—"} />
              {po.receivedDate && <InfoRow label="Received Date" value={po.receivedDate} />}
              <InfoRow label="Created" value={po.createdAt} />
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={Package} title="Line Items" accent />
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20">
                    <TableHead className="text-xs">Item</TableHead>
                    <TableHead className="text-xs">SKU</TableHead>
                    <TableHead className="text-xs">UoM</TableHead>
                    <TableHead className="text-xs text-center">Ordered</TableHead>
                    <TableHead className="text-xs text-center">Received</TableHead>
                    <TableHead className="text-xs text-right">Unit Cost</TableHead>
                    <TableHead className="text-xs text-right">Line Total</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {po.lines.map(line => {
                    const isComplete = line.quantityReceived >= line.quantityOrdered;
                    const isPartial = line.quantityReceived > 0 && !isComplete;
                    const isOver = line.quantityReceived > line.quantityOrdered;
                    return (
                      <TableRow key={line.id}>
                        <TableCell className="text-sm font-medium">{line.name}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{line.sku}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{line.uom}</TableCell>
                        <TableCell className="text-center text-sm">{line.quantityOrdered}</TableCell>
                        <TableCell className="text-center text-sm">{line.quantityReceived}</TableCell>
                        <TableCell className="text-right text-sm">${line.unitCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-sm font-semibold">${line.lineTotal.toFixed(2)}</TableCell>
                        <TableCell>
                          {isComplete ? (
                            <div className="flex items-center gap-1">
                              <Badge variant="outline" className="text-[10px] bg-success/10 text-success border-success/20">Complete</Badge>
                              {isOver && <span className="text-[10px] text-warning">Over-received</span>}
                            </div>
                          ) : isPartial ? (
                            <Badge variant="outline" className="text-[10px] bg-warning/10 text-warning border-warning/20">
                              Partial ({line.quantityReceived}/{line.quantityOrdered})
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">Not received</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6} className="text-right font-bold">Order Total</TableCell>
                    <TableCell className="text-right font-bold text-accent">${po.totalAmount.toFixed(2)}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={StickyNote} title="Notes" />
            </CardHeader>
            <CardContent className="pt-5">
              {po.notes ? (
                <p className="text-sm text-foreground">{po.notes}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — sticky sidebar */}
        <div className="space-y-4 xl:sticky xl:top-[calc(3.5rem+1.5rem)]">
          {/* Order Summary */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={FileText} title="Order Summary" accent />
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <Badge variant="secondary">{po.lines.length}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Order Total</span>
                <span className="text-accent">${po.totalAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Receiving Progress</span>
                  <span>{totalReceived} of {totalOrdered} items</span>
                </div>
                <Progress
                  value={receivePercent}
                  className={cn("h-2", receivePercent === 100 ? "[&>div]:bg-success" : receivePercent > 0 ? "[&>div]:bg-warning" : "[&>div]:bg-muted")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Supplier */}
          {supplier && (
            <Card className="shadow-soft border-border/50">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={Truck} title="Supplier" />
              </CardHeader>
              <CardContent className="pt-5 space-y-2">
                <p className="text-sm font-bold">{supplier.name}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{supplier.contactPerson}</p>
                  <p><a href={`mailto:${supplier.email}`} className="text-accent hover:underline">{supplier.email}</a></p>
                  <p>{supplier.phone}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs mt-2 p-0 h-auto text-accent" onClick={() => navigate("/workshop/suppliers")}>
                  View Supplier →
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={Clock} title="Timeline" />
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const isCurrent = i === steps.findIndex(s => !s.done) - 1 || (step.done && i === steps.length - 1 && steps[steps.length - 1].done);
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-3 h-3 rounded-full border-2 shrink-0",
                          step.done
                            ? isCurrent ? "bg-accent border-accent" : "bg-success border-success"
                            : "bg-background border-muted-foreground/30"
                        )} />
                        {i < steps.length - 1 && <div className={cn("w-0.5 h-8", step.done ? "bg-success/30" : "bg-muted")} />}
                      </div>
                      <div className="pb-6">
                        <p className={cn("text-sm font-medium", step.done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                        {step.date && <p className="text-xs text-muted-foreground">{step.date}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit AlertDialog */}
      <AlertDialog open={submitOpen} onOpenChange={setSubmitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Order</AlertDialogTitle>
            <AlertDialogDescription>Submitting this order will lock line items. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel AlertDialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>This PO will be cancelled. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleCancel}>Cancel PO</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete AlertDialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the purchase order.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receive Goods Dialog */}
      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receive Goods — {po.poNumber}</DialogTitle>
            <DialogDescription>Enter the quantities received for each item. You can receive partially.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="text-xs">Item</TableHead>
                    <TableHead className="text-xs">SKU</TableHead>
                    <TableHead className="text-xs text-center">Ordered</TableHead>
                    <TableHead className="text-xs text-center">Already Received</TableHead>
                    <TableHead className="text-xs text-center">Receiving Now</TableHead>
                    <TableHead className="text-xs text-center">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {po.lines.map(line => {
                    const receiving = receiveQtys[line.id] || 0;
                    const remaining = line.quantityOrdered - line.quantityReceived - receiving;
                    return (
                      <TableRow key={line.id}>
                        <TableCell className="text-sm font-medium">{line.name}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{line.sku}</TableCell>
                        <TableCell className="text-center text-sm">{line.quantityOrdered}</TableCell>
                        <TableCell className="text-center text-sm">{line.quantityReceived}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            min={0}
                            className="w-20 mx-auto text-center h-8 text-sm"
                            value={receiving}
                            onChange={e => setReceiveQtys(prev => ({ ...prev, [line.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                          />
                        </TableCell>
                        <TableCell className={cn("text-center text-sm font-medium", remaining < 0 && "text-destructive")}>
                          {remaining}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {hasOverReceipt && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-warning/10 border border-warning/20">
                <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
                <p className="text-xs text-warning">One or more items will be over-received. This is allowed but please verify quantities.</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button variant="ghost" onClick={() => setReceiveOpen(false)}>Cancel</Button>
            <Button className="bg-success text-success-foreground hover:bg-success/90" onClick={handleConfirmReceipt}>Confirm Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
