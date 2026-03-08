import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Clock,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface StockMovement {
  id: string;
  partId: string;
  date: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  referenceType: "purchase_order" | "service_job" | "manual" | "return";
  referenceId: string;
  costPriceAtTime: number;
  notes: string;
  balanceAfter: number;
}

interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  supplier: string;
  uom?: string;
  description?: string;
}

interface PartDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  movements: StockMovement[];
  onRecordMovement: (movement: Omit<StockMovement, "id" | "balanceAfter">) => void;
}

const REFERENCE_TYPE_LABELS: Record<StockMovement["referenceType"], string> = {
  purchase_order: "Purchase Order",
  service_job: "Service Job",
  manual: "Manual",
  return: "Return",
};

const MOVEMENT_TYPE_CONFIG: Record<
  StockMovement["type"],
  { label: string; className: string; icon: typeof ArrowUpCircle }
> = {
  in: { label: "IN", className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", icon: ArrowDownCircle },
  out: { label: "OUT", className: "bg-destructive/15 text-destructive border-destructive/20", icon: ArrowUpCircle },
  adjustment: { label: "ADJ", className: "bg-blue-500/15 text-blue-600 border-blue-500/20", icon: RefreshCw },
};

export default function PartDetailDialog({
  open,
  onOpenChange,
  part,
  movements,
  onRecordMovement,
}: PartDetailDialogProps) {
  const [showForm, setShowForm] = useState(false);
  const [movType, setMovType] = useState<StockMovement["type"]>("in");
  const [quantity, setQuantity] = useState("");
  const [refType, setRefType] = useState<StockMovement["referenceType"]>("manual");
  const [refId, setRefId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [movFilter, setMovFilter] = useState<"all" | StockMovement["type"]>("all");

  if (!part) return null;

  const partMovements = movements
    .filter((m) => m.partId === part.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredMovements = movFilter === "all"
    ? partMovements
    : partMovements.filter((m) => m.type === movFilter);

  const resetForm = () => {
    setMovType("in");
    setQuantity("");
    setRefType("manual");
    setRefId("");
    setCostPrice("");
    setNotes("");
    setShowForm(false);
  };

  const handleSubmit = () => {
    const qty = Number(quantity);
    if (!qty) return;
    const signedQty = movType === "out" ? -Math.abs(qty) : movType === "in" ? Math.abs(qty) : qty;
    onRecordMovement({
      partId: part.id,
      date: new Date().toISOString(),
      type: movType,
      quantity: signedQty,
      referenceType: refType,
      referenceId: refType === "manual" ? "" : refId,
      costPriceAtTime: Number(costPrice) || part.costPrice,
      notes,
    });
    resetForm();
  };

  const isValid = quantity !== "" && Number(quantity) !== 0;
  const isLowStock = part.stock <= part.minStock;
  const margin = part.sellPrice - part.costPrice;
  const marginPct = part.costPrice > 0 ? ((margin / part.costPrice) * 100).toFixed(1) : "—";
  const stockValue = part.stock * part.costPrice;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-6xl h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-border/60 shrink-0 pr-12">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            {/* Left: icon + name + category */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <DialogHeader className="p-0 space-y-0">
                    <DialogTitle className="text-lg font-semibold leading-tight">{part.name}</DialogTitle>
                  </DialogHeader>
                  <Badge variant="secondary" className="text-[11px] font-medium shrink-0 hidden sm:inline-flex">
                    {part.category}
                  </Badge>
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-1">{part.sku}</p>
              </div>
            </div>

            {/* Right: stats strip — equal sizing */}
            <div className="flex items-center justify-center w-full sm:w-auto bg-secondary/50 rounded-lg border border-border/40 shrink-0">
              <StatPill label="Stock" value={String(part.stock)} highlight={isLowStock} />
              <div className="w-px h-8 bg-border/50" />
              <StatPill label="Cost" value={`$${part.costPrice}`} />
              <div className="w-px h-8 bg-border/50" />
              <StatPill label="Sell" value={`$${part.sellPrice}`} />
              <div className="w-px h-8 bg-border/50" />
              <StatPill label="Value" value={`$${stockValue.toLocaleString()}`} />
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b border-border/60 shrink-0 overflow-x-auto no-scrollbar">
            <TabsList className="bg-transparent h-11 p-0 gap-1 rounded-none w-max">
              <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-xs font-medium px-3 py-1.5 h-7 my-auto transition-colors">Overview</TabsTrigger>
              <TabsTrigger value="movements" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-xs font-medium px-3 py-1.5 h-7 my-auto transition-colors">Movements</TabsTrigger>
              <TabsTrigger value="purchase-orders" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-xs font-medium px-3 py-1.5 h-7 my-auto transition-colors">Purchase Orders</TabsTrigger>
              <TabsTrigger value="sales" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-xs font-medium px-3 py-1.5 h-7 my-auto transition-colors">Sales</TabsTrigger>
            </TabsList>
          </div>

          {/* ── Overview Tab ── */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto no-scrollbar m-0 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5">
                {/* Item Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Item Details</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      <DetailItem label="Category" value={part.category} />
                      <DetailItem label="Unit of Measure" value={part.uom?.toUpperCase() || "—"} />
                      <DetailItem label="Supplier" value={part.supplier || "—"} />
                      <DetailItem label="Item Type" value="Good" />
                      <DetailItem label="Min Stock Level" value={String(part.minStock)} />
                      <DetailItem label="SKU" value={part.sku} mono />
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Description</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {part.description || "No description provided."}
                    </p>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {partMovements.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4 text-center">No activity recorded yet.</p>
                    ) : (
                      <div className="space-y-0">
                        {partMovements.slice(0, 5).map((m, i) => {
                          const config = MOVEMENT_TYPE_CONFIG[m.type];
                          const Icon = config.icon;
                          return (
                            <div key={m.id} className={`flex items-start gap-3 py-3 ${i < Math.min(partMovements.length, 5) - 1 ? "border-b border-border/40" : ""}`}>
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${config.className}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium">{config.label}</span>
                                  <span className="text-[11px] text-muted-foreground">
                                    {REFERENCE_TYPE_LABELS[m.referenceType]}
                                    {m.referenceId && ` · ${m.referenceId}`}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                                  <span className="text-[11px] text-muted-foreground">
                                    {format(new Date(m.date), "dd MMM yyyy, HH:mm")}
                                  </span>
                                </div>
                                {m.notes && (
                                  <p className="text-[11px] text-muted-foreground/70 mt-1 truncate">{m.notes}</p>
                                )}
                              </div>
                              <span className={`text-sm font-semibold shrink-0 ${m.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}>
                                {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-5">
                {/* Stock Status */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Stock Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col items-center py-4">
                      <span className={`text-4xl font-bold tabular-nums ${isLowStock ? "text-destructive" : "text-foreground"}`}>
                        {part.stock}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {part.uom?.toUpperCase() || "units"} in stock
                      </span>
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5 mb-4">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                        <span className="text-xs text-destructive font-medium">Stock is at or below minimum level</span>
                      </div>
                    )}
                    <Separator className="mb-3" />
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-muted-foreground">Reorder Point</span>
                      <span className="text-sm font-medium">{part.minStock}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-0">
                    <PricingRow label="Cost Price" value={`$${part.costPrice}`} />
                    <PricingRow label="Sell Price" value={`$${part.sellPrice}`} />
                    <PricingRow label="Margin" value={`$${margin.toFixed(2)}`} sub={`(${marginPct}%)`} highlight />
                    <Separator className="my-2" />
                    <PricingRow label="Stock Value" value={`$${stockValue.toLocaleString()}`} bold />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Movements Tab ── */}
          <TabsContent value="movements" className="flex-1 overflow-y-auto no-scrollbar m-0 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">Stock Movements</h3>
                <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{filteredMovements.length}</Badge>
                <Select value={movFilter} onValueChange={(v) => setMovFilter(v as "all" | StockMovement["type"])}>
                  <SelectTrigger className="h-7 text-[11px] w-[100px] gap-1">
                    <Filter className="w-3 h-3 text-muted-foreground shrink-0" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!showForm && (
                <Button size="sm" className="gap-1.5 h-7 text-xs" onClick={() => setShowForm(true)}>
                  <Plus className="w-3 h-3" />
                  Record Movement
                </Button>
              )}
            </div>

            {/* Inline Form */}
            {showForm && (
              <div className="border rounded-lg p-4 mb-4 bg-secondary/30 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Type</label>
                    <Select value={movType} onValueChange={(v) => setMovType(v as StockMovement["type"])}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Stock In</SelectItem>
                        <SelectItem value="out">Stock Out</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Quantity</label>
                    <Input type="number" placeholder="e.g. 10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Cost Price</label>
                    <Input type="number" placeholder={`${part.costPrice}`} value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Reference Type</label>
                    <Select value={refType} onValueChange={(v) => setRefType(v as StockMovement["referenceType"])}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="purchase_order">Purchase Order</SelectItem>
                        <SelectItem value="service_job">Service Job</SelectItem>
                        <SelectItem value="return">Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">Reference ID</label>
                    <Input placeholder={refType === "manual" ? "N/A" : "e.g. PO-0012"} value={refId} onChange={(e) => setRefId(e.target.value)} disabled={refType === "manual"} className="h-9 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
                  <Textarea placeholder="Reason for movement..." value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm min-h-[60px]" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
                  <Button size="sm" disabled={!isValid} onClick={handleSubmit}>Save Movement</Button>
                </div>
              </div>
            )}

            {/* Movement Table */}
            <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                    <TableHead className="text-[11px] font-medium h-8">Date</TableHead>
                    <TableHead className="text-[11px] font-medium h-8">Type</TableHead>
                    <TableHead className="text-[11px] font-medium h-8 text-right">Qty</TableHead>
                    <TableHead className="text-[11px] font-medium h-8">Ref Type</TableHead>
                    <TableHead className="text-[11px] font-medium h-8">Ref ID</TableHead>
                    <TableHead className="text-[11px] font-medium h-8">Notes</TableHead>
                    <TableHead className="text-[11px] font-medium h-8 text-right">Cost</TableHead>
                    <TableHead className="text-[11px] font-medium h-8 text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMovements.map((m) => {
                    const config = MOVEMENT_TYPE_CONFIG[m.type];
                    return (
                      <TableRow key={m.id} className="hover:bg-secondary/10 group">
                        <TableCell className="text-xs text-muted-foreground py-2">{format(new Date(m.date), "dd MMM yy")}</TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${config.className}`}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className={`text-xs text-right font-semibold py-2 ${m.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}>
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground py-2">{REFERENCE_TYPE_LABELS[m.referenceType]}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground py-2">{m.referenceId || "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground py-2 max-w-[220px]">
                          {m.notes ? (
                            <ExpandableNotes text={m.notes} />
                          ) : "—"}
                        </TableCell>
                        <TableCell className="text-xs text-right text-muted-foreground py-2">${m.costPriceAtTime}</TableCell>
                        <TableCell className="text-xs text-right font-medium py-2">{m.balanceAfter}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredMovements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-6">
                        {movFilter === "all" ? "No movements recorded yet" : `No ${movFilter} movements found`}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* ── Purchase Orders Tab ── */}
          <TabsContent value="purchase-orders" className="flex-1 m-0">
            <ComingSoon
              icon={ShoppingCart}
              title="Purchase Orders"
              description="Track and manage purchase orders for this part. Create POs, monitor deliveries, and link them to stock movements."
            />
          </TabsContent>

          {/* ── Sales Tab ── */}
          <TabsContent value="sales" className="flex-1 m-0">
            <ComingSoon
              icon={TrendingUp}
              title="Sales Tracking"
              description="View sales history and trends for this part. Track which jobs consumed stock and analyze demand over time."
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

/* ── Sub-components ── */

function StatPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center px-3 sm:px-4 py-2 flex-1 min-w-0">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
      <span className={`text-xs sm:text-sm font-semibold tabular-nums truncate ${highlight ? "text-destructive" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

function PricingRow({ label, value, sub, highlight, bold }: { label: string; value: string; sub?: string; highlight?: boolean; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-semibold"} ${highlight ? "text-emerald-600" : "text-foreground"}`}>
        {value}{sub && <span className="text-sm font-normal text-muted-foreground ml-1">{sub}</span>}
      </span>
    </div>
  );
}

function ComingSoon({ icon: Icon, title, description }: { icon: typeof ShoppingCart; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground/60" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">{description}</p>
      <Badge variant="secondary" className="mt-4 text-[11px]">Coming Soon</Badge>
    </div>
  );
}

function ExpandableNotes({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 50;

  if (!isLong) return <span>{text}</span>;

  return (
    <div>
      <span className={expanded ? "" : "line-clamp-1"}>{text}</span>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[10px] text-primary hover:underline mt-0.5 block"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
