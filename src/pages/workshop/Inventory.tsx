import { useState, useMemo } from "react";
import {
  Package,
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  AlertTriangle,
  Pencil,
  Trash2,
} from "lucide-react";
import AddPartDialog from "@/components/workshop/AddPartDialog";
import EditPartDialog from "@/components/workshop/EditPartDialog";
import PartDetailDialog, { type StockMovement } from "@/components/workshop/PartDetailDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const mockParts: Part[] = [
  { id: "1", name: "Brake Pads (Front)", sku: "BP-FRT-001", category: "Brakes", stock: 2, minStock: 10, costPrice: 35, sellPrice: 65, supplier: "AutoParts SG" },
  { id: "2", name: "Engine Oil 5W-30 (5L)", sku: "OIL-5W30-5L", category: "Lubricants", stock: 3, minStock: 8, costPrice: 28, sellPrice: 55, supplier: "Shell SG" },
  { id: "3", name: "Oil Filter (Universal)", sku: "FLT-OIL-UNI", category: "Filters", stock: 4, minStock: 15, costPrice: 5, sellPrice: 15, supplier: "AutoParts SG" },
  { id: "4", name: "Spark Plug (Iridium)", sku: "SP-IRD-001", category: "Ignition", stock: 24, minStock: 10, costPrice: 12, sellPrice: 28, supplier: "NGK Dist." },
  { id: "5", name: "Air Filter", sku: "FLT-AIR-001", category: "Filters", stock: 18, minStock: 10, costPrice: 8, sellPrice: 22, supplier: "AutoParts SG" },
  { id: "6", name: "Brake Disc (Front)", sku: "BD-FRT-001", category: "Brakes", stock: 6, minStock: 4, costPrice: 65, sellPrice: 120, supplier: "Brembo SG" },
  { id: "7", name: "Coolant (1L)", sku: "CLT-001", category: "Lubricants", stock: 12, minStock: 6, costPrice: 8, sellPrice: 18, supplier: "Shell SG" },
  { id: "8", name: "Wiper Blade (Pair)", sku: "WB-UNI-001", category: "Accessories", stock: 30, minStock: 10, costPrice: 10, sellPrice: 25, supplier: "Bosch SG" },
  { id: "9", name: "Battery (12V 60Ah)", sku: "BAT-12V-60", category: "Electrical", stock: 5, minStock: 3, costPrice: 85, sellPrice: 160, supplier: "Amaron SG" },
  { id: "10", name: "Transmission Fluid (1L)", sku: "TF-ATF-001", category: "Lubricants", stock: 7, minStock: 5, costPrice: 15, sellPrice: 32, supplier: "Shell SG" },
];

const defaultCategories = ["Brakes", "Lubricants", "Filters", "Ignition", "Accessories", "Electrical"];

const mockMovements: StockMovement[] = [
  { id: "m1", partId: "1", date: "2026-03-01T10:00:00Z", type: "in", quantity: 20, referenceType: "purchase_order", referenceId: "PO-0012", costPriceAtTime: 35, notes: "Initial stock order", balanceAfter: 20 },
  { id: "m2", partId: "1", date: "2026-03-02T14:30:00Z", type: "out", quantity: -4, referenceType: "service_job", referenceId: "SJ-0045", costPriceAtTime: 35, notes: "Brake job - Toyota Camry", balanceAfter: 16 },
  { id: "m3", partId: "1", date: "2026-03-02T16:00:00Z", type: "out", quantity: -14, referenceType: "service_job", referenceId: "SJ-0046", costPriceAtTime: 35, notes: "Fleet service", balanceAfter: 2 },
  { id: "m4", partId: "2", date: "2026-02-28T09:00:00Z", type: "in", quantity: 10, referenceType: "purchase_order", referenceId: "PO-0010", costPriceAtTime: 28, notes: "", balanceAfter: 10 },
  { id: "m5", partId: "2", date: "2026-03-01T11:00:00Z", type: "out", quantity: -5, referenceType: "service_job", referenceId: "SJ-0040", costPriceAtTime: 28, notes: "Oil change batch", balanceAfter: 5 },
  { id: "m6", partId: "2", date: "2026-03-02T08:00:00Z", type: "out", quantity: -2, referenceType: "manual", referenceId: "", costPriceAtTime: 28, notes: "Damaged stock write-off", balanceAfter: 3 },
  { id: "m7", partId: "4", date: "2026-02-25T10:00:00Z", type: "in", quantity: 30, referenceType: "purchase_order", referenceId: "PO-0008", costPriceAtTime: 12, notes: "", balanceAfter: 30 },
  { id: "m8", partId: "4", date: "2026-03-01T15:00:00Z", type: "out", quantity: -6, referenceType: "service_job", referenceId: "SJ-0042", costPriceAtTime: 12, notes: "Spark plug replacement x6", balanceAfter: 24 },
  { id: "m9", partId: "3", date: "2026-03-01T09:00:00Z", type: "in", quantity: 10, referenceType: "purchase_order", referenceId: "PO-0011", costPriceAtTime: 5, notes: "", balanceAfter: 10 },
  { id: "m10", partId: "3", date: "2026-03-02T12:00:00Z", type: "out", quantity: -6, referenceType: "service_job", referenceId: "SJ-0044", costPriceAtTime: 5, notes: "Oil change bundle", balanceAfter: 4 },
];

type SortKey = "name" | "sku" | "category" | "stock" | "costPrice" | "sellPrice" | "supplier";
type SortDir = "asc" | "desc";

function TruncatedCell({ children, className }: { children: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`block truncate ${className ?? ""}`}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p className="text-xs">{children}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function SortableHead({
  label,
  sortKey,
  currentSort,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey | null;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = currentSort === sortKey;
  return (
    <TableHead className={`text-xs font-medium ${className ?? ""}`}>
      <button
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        onClick={() => onSort(sortKey)}
      >
        {label}
        {active ? (
          currentDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-40" />
        )}
      </button>
    </TableHead>
  );
}

export default function Inventory() {
  const [parts, setParts] = useState<Part[]>(mockParts);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customSuppliers, setCustomSuppliers] = useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editPart, setEditPart] = useState<Part | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletePart, setDeletePart] = useState<Part | null>(null);
  const [detailPart, setDetailPart] = useState<Part | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);

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
    setParts((prev) =>
      prev.map((p) => (p.id === movData.partId ? { ...p, stock: newBalance } : p))
    );
    // Update detailPart to reflect new stock
    setDetailPart((prev) => (prev && prev.id === movData.partId ? { ...prev, stock: newBalance } : prev));
  };

  const allCategories = useMemo(() => {
    const merged = new Set([...defaultCategories, ...customCategories]);
    return Array.from(merged).sort();
  }, [customCategories]);

  const allSuppliers = useMemo(() => {
    const fromParts = parts.map((p) => p.supplier).filter(Boolean);
    const merged = new Set([...fromParts, ...customSuppliers]);
    return Array.from(merged).sort();
  }, [parts, customSuppliers]);

  const filterCategories = ["All", ...allCategories];

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleEditPart = (updatedPart: Part) => {
    setParts((prev) => prev.map((p) => (p.id === updatedPart.id ? updatedPart : p)));
    if (!allCategories.includes(updatedPart.category)) {
      setCustomCategories((prev) => [...prev, updatedPart.category]);
    }
    if (updatedPart.supplier && !allSuppliers.includes(updatedPart.supplier)) {
      setCustomSuppliers((prev) => [...prev, updatedPart.supplier]);
    }
  };

  const handleDeletePart = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    setDeletePart(null);
  };

  const filtered = useMemo(() => {
    let result = parts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [parts, search, activeCategory, sortKey, sortDir]);

  const totalValue = parts.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockCount = parts.filter((p) => p.stock <= p.minStock).length;

  const handleAddPart = (partData: Omit<Part, "id">) => {
    const newPart: Part = { ...partData, id: String(Date.now()) };
    setParts((prev) => [...prev, newPart]);
    if (!allCategories.includes(partData.category)) {
      setCustomCategories((prev) => [...prev, partData.category]);
    }
    if (partData.supplier && !allSuppliers.includes(partData.supplier)) {
      setCustomSuppliers((prev) => [...prev, partData.supplier]);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Parts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your spare parts and supplies
            </p>
          </div>
          <Button className="gap-2 shadow-soft" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Part
          </Button>
        </div>

        <AddPartDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          categories={allCategories}
          suppliers={allSuppliers}
          onAdd={handleAddPart}
        />

        <EditPartDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          part={editPart}
          categories={allCategories}
          suppliers={allSuppliers}
          onSave={handleEditPart}
        />

        <AlertDialog open={!!deletePart} onOpenChange={(v) => { if (!v) setDeletePart(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Part</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletePart?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => deletePart && handleDeletePart(deletePart.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{mockParts.length}</p>
                <p className="text-xs text-muted-foreground">Total SKUs</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Inventory Value</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{lowStockCount}</p>
                <p className="text-xs text-muted-foreground">Low Stock Items</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search parts or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary/60 border-0 shadow-soft"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {filterCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="shadow-soft border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <SortableHead label="Part Name" sortKey="name" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[200px]" />
                  <SortableHead label="SKU" sortKey="sku" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[130px]" />
                  <SortableHead label="Category" sortKey="category" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[110px] hidden md:table-cell" />
                  <SortableHead label="Stock" sortKey="stock" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[90px] text-center" />
                  <SortableHead label="Cost" sortKey="costPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[90px] hidden sm:table-cell text-right" />
                  <SortableHead label="Sell Price" sortKey="sellPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[100px] text-right" />
                  <SortableHead label="Supplier" sortKey="supplier" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[130px] hidden lg:table-cell" />
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((part) => {
                  const isLow = part.stock <= part.minStock;
                  return (
                    <TableRow key={part.id} className="hover:bg-secondary/20">
                      <TableCell className="font-medium text-sm max-w-[200px]">
                        <TruncatedCell>{part.name}</TruncatedCell>
                      </TableCell>
                      <TableCell className="max-w-[130px]">
                        <TruncatedCell className="text-xs font-mono text-muted-foreground">{part.sku}</TruncatedCell>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[110px]">
                        <Badge variant="secondary" className="text-[11px]">{part.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm font-semibold ${isLow ? "text-destructive" : "text-foreground"}`}>
                          {part.stock}
                        </span>
                        {isLow && <AlertTriangle className="inline-block w-3 h-3 text-warning ml-1" />}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right text-sm text-muted-foreground">
                        ${part.costPrice}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium">${part.sellPrice}</TableCell>
                      <TableCell className="hidden lg:table-cell max-w-[130px]">
                        <TruncatedCell className="text-xs text-muted-foreground">{part.supplier}</TruncatedCell>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditPart(part); setEditDialogOpen(true); }}>
                              <Pencil className="w-3.5 h-3.5 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletePart(part)}>
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                      No parts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
