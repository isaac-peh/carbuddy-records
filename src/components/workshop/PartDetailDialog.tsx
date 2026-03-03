import { useState } from "react";
import { format } from "date-fns";
import {
  Pencil,
  Plus,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCw,
  X,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
}

interface PartDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  movements: StockMovement[];
  onEditClick: () => void;
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
  onEditClick,
  onRecordMovement,
}: PartDetailDialogProps) {
  const [showForm, setShowForm] = useState(false);
  const [movType, setMovType] = useState<StockMovement["type"]>("in");
  const [quantity, setQuantity] = useState("");
  const [refType, setRefType] = useState<StockMovement["referenceType"]>("manual");
  const [refId, setRefId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [notes, setNotes] = useState("");

  if (!part) return null;

  const partMovements = movements
    .filter((m) => m.partId === part.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <DialogTitle className="text-lg">{part.name}</DialogTitle>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{part.sku}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEditClick}>
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4">
          {/* Part Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoItem label="Category" value={part.category} />
            <InfoItem label="Stock" value={String(part.stock)} highlight={part.stock <= part.minStock} />
            <InfoItem label="Min Stock" value={String(part.minStock)} />
            <InfoItem label="Supplier" value={part.supplier || "—"} />
            <InfoItem label="Cost Price" value={`$${part.costPrice}`} />
            <InfoItem label="Sell Price" value={`$${part.sellPrice}`} />
            <InfoItem label="Margin" value={`$${part.sellPrice - part.costPrice}`} />
            <InfoItem label="Stock Value" value={`$${(part.stock * part.costPrice).toLocaleString()}`} />
          </div>
        </div>

        <Separator />

        {/* Movement Section */}
        <div className="flex-1 flex flex-col min-h-0 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground">Stock Movements</h3>
            {!showForm && (
              <Button size="sm" variant="outline" className="gap-1.5 h-7 text-xs" onClick={() => setShowForm(true)}>
                <Plus className="w-3 h-3" />
                Record Movement
              </Button>
            )}
          </div>

          {/* Inline Form */}
          {showForm && (
            <div className="border rounded-lg p-4 mb-3 bg-secondary/30 space-y-3">
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
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-3 h-3 mr-1" /> Cancel
                </Button>
                <Button size="sm" disabled={!isValid} onClick={handleSubmit}>
                  Save Movement
                </Button>
              </div>
            </div>
          )}

          {/* Movement Table */}
          <ScrollArea className="flex-1 max-h-[280px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="text-xs w-[90px]">Date</TableHead>
                  <TableHead className="text-xs w-[60px]">Type</TableHead>
                  <TableHead className="text-xs w-[60px] text-right">Qty</TableHead>
                  <TableHead className="text-xs w-[100px]">Ref Type</TableHead>
                  <TableHead className="text-xs w-[80px]">Ref ID</TableHead>
                  <TableHead className="text-xs w-[70px] text-right">Cost</TableHead>
                  <TableHead className="text-xs w-[70px] text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partMovements.map((m) => {
                  const config = MOVEMENT_TYPE_CONFIG[m.type];
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(m.date), "dd MMM yy")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] px-1.5 ${config.className}`}>
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-xs text-right font-semibold ${m.quantity > 0 ? "text-emerald-600" : "text-destructive"}`}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {REFERENCE_TYPE_LABELS[m.referenceType]}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {m.referenceId || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-right text-muted-foreground">
                        ${m.costPriceAtTime}
                      </TableCell>
                      <TableCell className="text-xs text-right font-medium">
                        {m.balanceAfter}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {partMovements.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-6">
                      No movements recorded yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={`text-sm font-medium ${highlight ? "text-destructive" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
