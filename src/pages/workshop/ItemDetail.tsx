import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Plus,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  AlertTriangle,
  Clock,
  TrendingUp,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import EditPartDialog from "@/components/workshop/EditPartDialog";
import { mockParts, mockMovements, type Part } from "@/data/inventoryParts";
import { type StockMovement } from "@/components/workshop/PartDetailDialog";

const REFERENCE_TYPE_LABELS: Record<StockMovement["referenceType"], string> = {
  purchase_order: "Purchase Order",
  service_job: "Service Job",
  manual: "Manual",
  return: "Return",
};

const MOVEMENT_TYPE_CONFIG: Record<
  StockMovement["type"],
  { label: string; className: string; icon: typeof ArrowUpCircle; borderColor: string }
> = {
  in: {
    label: "IN",
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    icon: ArrowDownCircle,
    borderColor: "rgb(16 185 129)",
  },
  out: {
    label: "OUT",
    className: "bg-destructive/15 text-destructive border-destructive/20",
    icon: ArrowUpCircle,
    borderColor: "hsl(var(--destructive))",
  },
  adjustment: {
    label: "ADJ",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/20",
    icon: RefreshCw,
    borderColor: "rgb(59 130 246)",
  },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

// ---------- Sub-components ----------

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-sm font-semibold text-foreground whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

function KpiCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="bg-secondary/40 rounded-xl border border-border/50 p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${highlight ? "text-destructive" : "text-foreground"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function ExpandableNotes({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 50;
  if (!isLong) return <span className="text-xs text-muted-foreground">{text}</span>;
  return (
    <div className="text-xs text-muted-foreground max-w-[70%]">
      <span className={!expanded ? "line-clamp-2" : ""}>{text}</span>
      <button
        type="button"
        className="mt-0.5 block text-xs text-primary underline hover:no-underline"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

// ---------- Overview Section ----------

function OverviewSection({
  part,
  movements,
  onCreatePO,
}: {
  part: Part;
  movements: StockMovement[];
  onCreatePO: () => void;
}) {
  const isLow = part.stock <= part.minStock;
  const margin = part.sellPrice - part.costPrice;
  const marginPct = part.costPrice > 0 ? ((margin / part.costPrice) * 100).toFixed(1) : "—";
  const stockValue = part.stock * part.costPrice;

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const maxStock = Math.max(part.stock * 1.5, part.minStock * 3, 1);
  const fillPct = Math.min((part.stock / maxStock) * 100, 100);
  const reorderPinPct = Math.min((part.minStock / maxStock) * 100, 100);
  const fillColor =
    part.stock > part.minStock
      ? "rgb(16 185 129)"
      : part.stock === part.minStock
        ? "rgb(245 158 11)"
        : "var(--destructive)";

  const detailFields = [
    { label: "SKU", value: <span className="font-mono">{part.sku}</span> },
    { label: "Category", value: part.category || "—" },
    { label: "Unit of Measure", value: part.uom?.toUpperCase() || "—" },
    { label: "Supplier", value: part.supplier || "—" },
    { label: "Min Stock Level", value: `${part.minStock} ${part.uom || "units"}` },
    { label: "Item Type", value: "Good" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left column */}
      <div className="lg:col-span-8 space-y-6">
        {/* Item Details */}
        <div className="border border-border/50 rounded-xl bg-card">
          <div className="px-5 pt-5 pb-3 border-b border-border/40">
            <h3 className="text-sm font-semibold">Item Details</h3>
          </div>
          <div className="px-5 py-1 divide-y divide-border/40">
            {detailFields.map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {part.description && (
          <div className="border border-border/50 rounded-xl bg-card px-5 py-4">
            <h3 className="text-sm font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{part.description}</p>
          </div>
        )}

        {/* Recent Activity */}
        <div className="border border-border/50 rounded-xl bg-card">
          <div className="px-5 pt-5 pb-3 border-b border-border/40">
            <h3 className="text-sm font-semibold">Recent Activity</h3>
          </div>
          <div className="px-5 py-4">
            {recentMovements.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No movements recorded yet</p>
            ) : (
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-px bg-border/60" />
                {recentMovements.map((m) => {
                  const config = MOVEMENT_TYPE_CONFIG[m.type];
                  const Icon = config.icon;
                  return (
                    <div key={m.id} className="relative flex gap-3 pb-4 last:pb-0">
                      <div className="relative z-10 shrink-0 w-6 h-6 rounded-full bg-card flex items-center justify-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${config.className}`}>
                          <Icon className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {m.type === "in" ? "Stock In" : m.type === "out" ? "Stock Out" : "Adjustment"}
                          </span>
                          <span className={`text-sm font-semibold ${m.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}>
                            {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(m.date), "dd MMM yy, HH:mm")}
                          </p>
                        </div>
                        {m.notes && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{m.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="lg:col-span-4 space-y-6">
        {/* Stock Status */}
        <div className="border border-border/50 rounded-xl bg-card px-5 py-5">
          <h3 className="text-sm font-semibold mb-4">Stock Status</h3>
          <p className={`text-4xl font-bold tabular-nums mb-1 ${isLow ? "text-destructive" : "text-foreground"}`}>
            {part.stock}
          </p>
          <p className="text-xs text-muted-foreground mb-4">{part.uom?.toUpperCase() || "units"} in stock</p>
          <div className="relative h-2 bg-secondary rounded-full w-full mb-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${fillPct}%`, backgroundColor: fillColor }}
            />
            {part.minStock > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/30 rounded-full"
                style={{ left: `${reorderPinPct}%` }}
              />
            )}
          </div>
          <p className="text-xs text-muted-foreground">Min level: {part.minStock} {part.uom || "units"}</p>
          {isLow && (
            <Button
              size="sm"
              className="w-full mt-4 gap-1.5 h-8 text-xs bg-foreground text-background hover:bg-foreground/90"
              onClick={onCreatePO}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Create Purchase Order
            </Button>
          )}
        </div>

        {/* Pricing */}
        <div className="border border-border/50 rounded-xl bg-card px-5 py-4">
          <h3 className="text-sm font-semibold mb-3">Pricing</h3>
          <div className="divide-y divide-border/40">
            {[
              { label: "Cost Price", value: `$${part.costPrice}` },
              { label: "Sell Price", value: `$${part.sellPrice}` },
              { label: "Margin", value: `$${margin.toFixed(2)}`, sub: `(${marginPct}%)`, highlight: true },
              { label: "Stock Value", value: `$${stockValue.toLocaleString()}`, bold: true },
            ].map(({ label, value, sub, highlight, bold }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className={`text-sm tabular-nums ${bold ? "font-bold" : "font-semibold"} ${highlight ? "text-emerald-600" : "text-foreground"}`}>
                  {value}
                  {sub && <span className="text-sm font-normal text-muted-foreground ml-1">{sub}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Movements Section ----------

function MovementsSection({
  part,
  movements,
  onRecordMovement,
}: {
  part: Part;
  movements: StockMovement[];
  onRecordMovement: (movData: Omit<StockMovement, "id" | "balanceAfter">) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [movType, setMovType] = useState<StockMovement["type"]>("in");
  const [quantity, setQuantity] = useState("");
  const [refType, setRefType] = useState<StockMovement["referenceType"]>("manual");
  const [refId, setRefId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [filterType, setFilterType] = useState<"all" | StockMovement["type"]>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const filteredMovements =
    filterType === "all" ? sortedMovements : sortedMovements.filter((m) => m.type === filterType);

  const totalPages = Math.max(1, Math.ceil(filteredMovements.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedMovements = filteredMovements.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={(v) => { setFilterType(v as "all" | StockMovement["type"]); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">{filteredMovements.length} movements</span>
        </div>
        {!showForm && (
          <Button size="sm" className="gap-1.5 h-7 text-xs w-full sm:w-auto" onClick={() => setShowForm(true)}>
            <Plus className="w-3.5 h-3.5" />
            Record Movement
          </Button>
        )}
      </div>

      {/* Collapsible recording form */}
      {showForm && (
        <div className="border rounded-lg p-5 bg-secondary/30 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold">Record Movement</p>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={resetForm}
              aria-label="Close form"
            >
              ✕
            </button>
          </div>
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
              <Input
                type="number"
                placeholder="e.g. 10"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Cost Price</label>
              <Input
                type="number"
                placeholder={`${part.costPrice}`}
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="h-9 text-sm"
              />
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
              <Input
                placeholder={refType === "manual" ? "N/A" : "e.g. PO-0012"}
                value={refId}
                onChange={(e) => setRefId(e.target.value)}
                disabled={refType === "manual"}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Notes (optional)</label>
            <Textarea
              placeholder="Reason for movement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm min-h-[60px]"
            />
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
            {pagedMovements.map((m) => {
              const config = MOVEMENT_TYPE_CONFIG[m.type];
              return (
                <TableRow key={m.id} className="hover:bg-secondary/10">
                  <TableCell className="relative text-xs text-muted-foreground py-2 pl-3.5">
                    <div
                      className="absolute left-0 inset-y-0 w-[3px] rounded-full"
                      style={{ backgroundColor: config.borderColor }}
                    />
                    {format(new Date(m.date), "dd MMM yy")}
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${config.className}`}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-xs text-right font-semibold py-2 ${m.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground py-2">
                    {REFERENCE_TYPE_LABELS[m.referenceType]}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground py-2">
                    {m.referenceId || "—"}
                  </TableCell>
                  <TableCell className="py-2">
                    {m.notes ? <ExpandableNotes text={m.notes} /> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs text-right text-muted-foreground py-2">${m.costPriceAtTime}</TableCell>
                  <TableCell className="text-xs text-right font-medium py-2">{m.balanceAfter}</TableCell>
                </TableRow>
              );
            })}
            {pagedMovements.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">
                  {filterType === "all" ? "No movements recorded yet" : "No movements of this type"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-7 w-[60px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-2">
            {filteredMovements.length === 0
              ? "0"
              : `${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filteredMovements.length)}`}{" "}
            of {filteredMovements.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------- Sales Section ----------

function SalesSection() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <TrendingUp className="w-7 h-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1">Sales Analytics</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Sales history and usage trends across service jobs will appear here.
      </p>
      <Badge variant="outline" className="mt-4 text-xs text-muted-foreground">
        Coming Soon
      </Badge>
    </div>
  );
}

// ---------- Main Page Component ----------

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [parts, setParts] = useState<Part[]>(mockParts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);

  const part = parts.find((p) => p.id === id) ?? null;
  const partMovements = movements.filter((m) => m.partId === id);

  const handleRecordMovement = (movData: Omit<StockMovement, "id" | "balanceAfter">) => {
    const currentPart = parts.find((p) => p.id === movData.partId);
    if (!currentPart) return;
    const newBalance = currentPart.stock + movData.quantity;
    const newMovement: StockMovement = {
      ...movData,
      id: String(Date.now()),
      balanceAfter: newBalance,
    };
    setMovements((prev) => [...prev, newMovement]);
    setParts((prev) => prev.map((p) => (p.id === movData.partId ? { ...p, stock: newBalance } : p)));
    toast.success("Stock movement recorded");
  };

  const handleEditPart = (updatedPart: Part) => {
    setParts((prev) => prev.map((p) => (p.id === updatedPart.id ? updatedPart : p)));
    toast.success("Part updated successfully");
  };

  if (!part) {
    return (
      <div className="p-8 text-sm text-muted-foreground">
        Part not found.{" "}
        <button className="text-primary underline" onClick={() => navigate("/workshop/inventory")}>
          Back to inventory
        </button>
      </div>
    );
  }

  const isLow = part.stock <= part.minStock;
  const stockValue = part.stock * part.costPrice;

  return (
    <div className="space-y-8">
      {/* Back nav */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8 px-2 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Parts
        </Button>
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
        <span className="text-sm text-muted-foreground truncate">{part.name}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 mt-0.5">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg font-semibold leading-tight text-foreground">{part.name}</h1>
              {part.category && (
                <Badge variant="secondary" className="text-[11px] font-medium shrink-0 hidden sm:inline-flex">
                  {part.category}
                </Badge>
              )}
            </div>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">SKU: {part.sku}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={() => setEditDialogOpen(true)}
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Item
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={() => navigate("/workshop/purchase-orders")}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Stock" value={String(part.stock)} sub={`/ ${part.minStock} min`} highlight={isLow} />
        <KpiCard label="Cost" value={`$${part.costPrice}`} />
        <KpiCard label="Sell" value={`$${part.sellPrice}`} />
        <KpiCard label="Value" value={`$${stockValue.toLocaleString()}`} />
      </div>

      {/* Low stock warning */}
      {isLow && (
        <div className="flex items-center gap-3 bg-warning/10 border border-warning/25 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
          <p className="text-sm font-medium text-foreground">
            Stock is at or below minimum level ({part.minStock} {part.uom})
          </p>
        </div>
      )}

      {/* Overview Section */}
      <div>
        <SectionHeader title="Overview" />
        <OverviewSection
          part={part}
          movements={partMovements}
          onCreatePO={() => navigate("/workshop/purchase-orders")}
        />
      </div>

      {/* Movements Section */}
      <div>
        <SectionHeader title="Movements" />
        <MovementsSection part={part} movements={partMovements} onRecordMovement={handleRecordMovement} />
      </div>

      {/* Sales Section */}
      <div>
        <SectionHeader title="Sales" />
        <SalesSection />
      </div>

      {/* Edit Part Dialog */}
      <EditPartDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        part={part}
        categories={[...new Set(mockParts.map((p) => p.category))].sort()}
        suppliers={[...new Set(mockParts.map((p) => p.supplier))].sort()}
        onSave={handleEditPart}
      />
    </div>
  );
}
