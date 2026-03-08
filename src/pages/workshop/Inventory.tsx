import { useState, useMemo } from "react";
import { toast } from "sonner";
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
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Tags,
} from "lucide-react";
import AddPartDialog from "@/components/workshop/AddPartDialog";
import EditPartDialog from "@/components/workshop/EditPartDialog";
import PartDetailDialog, { type StockMovement } from "@/components/workshop/PartDetailDialog";
import ManageCategoriesDialog from "@/components/workshop/ManageCategoriesDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  uom: string;
  description: string;
}

const mockParts: Part[] = [
  {
    id: "1",
    name: "Brake Pads (Front)",
    sku: "BP-FRT-001",
    category: "Brakes",
    stock: 2,
    minStock: 10,
    costPrice: 35,
    sellPrice: 65,
    supplier: "AutoParts SG",
    uom: "set",
    description: "Front brake pad set for passenger vehicles. Semi-metallic compound with wear indicators.",
  },
  {
    id: "2",
    name: "Engine Oil 5W-30 (5L)",
    sku: "OIL-5W30-5L",
    category: "Lubricants",
    stock: 3,
    minStock: 8,
    costPrice: 28,
    sellPrice: 55,
    supplier: "Shell SG",
    uom: "bottle",
    description: "Fully synthetic 5W-30 engine oil. 5-litre bottle. Suitable for most modern petrol engines.",
  },
  {
    id: "3",
    name: "Oil Filter (Universal)",
    sku: "FLT-OIL-UNI",
    category: "Filters",
    stock: 4,
    minStock: 15,
    costPrice: 5,
    sellPrice: 15,
    supplier: "AutoParts SG",
    uom: "pc",
    description: "Universal spin-on oil filter. Fits most Japanese & Korean vehicles.",
  },
  {
    id: "4",
    name: "Spark Plug (Iridium)",
    sku: "SP-IRD-001",
    category: "Ignition",
    stock: 24,
    minStock: 10,
    costPrice: 12,
    sellPrice: 28,
    supplier: "NGK Dist.",
    uom: "pc",
    description: "Iridium-tipped spark plug for improved ignition and fuel efficiency.",
  },
  {
    id: "5",
    name: "Air Filter",
    sku: "FLT-AIR-001",
    category: "Filters",
    stock: 18,
    minStock: 10,
    costPrice: 8,
    sellPrice: 22,
    supplier: "AutoParts SG",
    uom: "pc",
    description: "Panel-type air filter element. Washable and reusable up to 3 times.",
  },
  {
    id: "6",
    name: "Brake Disc (Front)",
    sku: "BD-FRT-001",
    category: "Brakes",
    stock: 6,
    minStock: 4,
    costPrice: 65,
    sellPrice: 120,
    supplier: "Brembo SG",
    uom: "pc",
    description: "Ventilated front brake disc rotor. Direct OEM replacement.",
  },
  {
    id: "7",
    name: "Coolant (1L)",
    sku: "CLT-001",
    category: "Lubricants",
    stock: 12,
    minStock: 6,
    costPrice: 8,
    sellPrice: 18,
    supplier: "Shell SG",
    uom: "bottle",
    description: "Pre-mixed long-life coolant. Compatible with aluminium radiators.",
  },
  {
    id: "8",
    name: "Wiper Blade (Pair)",
    sku: "WB-UNI-001",
    category: "Accessories",
    stock: 30,
    minStock: 10,
    costPrice: 10,
    sellPrice: 25,
    supplier: "Bosch SG",
    uom: "pair",
    description: "Flat-blade frameless wiper set. Universal J-hook adapter included.",
  },
  {
    id: "9",
    name: "Battery (12V 60Ah)",
    sku: "BAT-12V-60",
    category: "Electrical",
    stock: 5,
    minStock: 3,
    costPrice: 85,
    sellPrice: 160,
    supplier: "Amaron SG",
    uom: "pc",
    description: "Maintenance-free calcium battery. 24-month warranty.",
  },
  {
    id: "10",
    name: "Transmission Fluid (1L)",
    sku: "TF-ATF-001",
    category: "Lubricants",
    stock: 7,
    minStock: 5,
    costPrice: 15,
    sellPrice: 32,
    supplier: "Shell SG",
    uom: "bottle",
    description: "Multi-vehicle ATF suitable for most 4- and 6-speed automatic transmissions.",
  },
];

const defaultCategories = [
  "Brakes",
  "Lubricants",
  "Filters",
  "Ignition",
  "Accessories",
  "Electrical",
  "Suspension",
  "Cooling",
  "Others",
];

const mockMovements: StockMovement[] = [
  {
    id: "m1",
    partId: "1",
    date: "2026-03-01T10:00:00Z",
    type: "in",
    quantity: 20,
    referenceType: "purchase_order",
    referenceId: "PO-0012",
    costPriceAtTime: 35,
    notes: "Initial stock order",
    balanceAfter: 20,
  },
  {
    id: "m2",
    partId: "1",
    date: "2026-03-02T14:30:00Z",
    type: "out",
    quantity: -4,
    referenceType: "service_job",
    referenceId: "SJ-0045",
    costPriceAtTime: 35,
    notes: "Brake job - Toyota Camry",
    balanceAfter: 16,
  },
  {
    id: "m3",
    partId: "1",
    date: "2026-03-02T16:00:00Z",
    type: "out",
    quantity: -14,
    referenceType: "service_job",
    referenceId: "SJ-0046",
    costPriceAtTime: 35,
    notes: "Fleet service",
    balanceAfter: 2,
  },
  {
    id: "m4",
    partId: "2",
    date: "2026-02-28T09:00:00Z",
    type: "in",
    quantity: 10,
    referenceType: "purchase_order",
    referenceId: "PO-0010",
    costPriceAtTime: 28,
    notes: "",
    balanceAfter: 10,
  },
  {
    id: "m5",
    partId: "2",
    date: "2026-03-01T11:00:00Z",
    type: "out",
    quantity: -5,
    referenceType: "service_job",
    referenceId: "SJ-0040",
    costPriceAtTime: 28,
    notes: "Oil change batch",
    balanceAfter: 5,
  },
  {
    id: "m6",
    partId: "2",
    date: "2026-03-02T08:00:00Z",
    type: "out",
    quantity: -2,
    referenceType: "manual",
    referenceId: "",
    costPriceAtTime: 28,
    notes: "Damaged stock write-off",
    balanceAfter: 3,
  },
  {
    id: "m7",
    partId: "4",
    date: "2026-02-25T10:00:00Z",
    type: "in",
    quantity: 30,
    referenceType: "purchase_order",
    referenceId: "PO-0008",
    costPriceAtTime: 12,
    notes: "",
    balanceAfter: 30,
  },
  {
    id: "m8",
    partId: "4",
    date: "2026-03-01T15:00:00Z",
    type: "out",
    quantity: -6,
    referenceType: "service_job",
    referenceId: "SJ-0042",
    costPriceAtTime: 12,
    notes: "Spark plug replacement x6",
    balanceAfter: 24,
  },
  {
    id: "m9",
    partId: "3",
    date: "2026-03-01T09:00:00Z",
    type: "in",
    quantity: 10,
    referenceType: "purchase_order",
    referenceId: "PO-0011",
    costPriceAtTime: 5,
    notes: "",
    balanceAfter: 10,
  },
  {
    id: "m10",
    partId: "3",
    date: "2026-03-02T12:00:00Z",
    type: "out",
    quantity: -6,
    referenceType: "service_job",
    referenceId: "SJ-0044",
    costPriceAtTime: 5,
    notes: "Oil change bundle",
    balanceAfter: 4,
  },
];

type SortKey = "name" | "sku" | "category" | "stock" | "costPrice" | "sellPrice" | "supplier" | "uom";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

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
          currentDir === "asc" ? (
            <ArrowUp className="w-3 h-3" />
          ) : (
            <ArrowDown className="w-3 h-3" />
          )
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
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeSuppliers, setActiveSuppliers] = useState<string[]>([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [editPart, setEditPart] = useState<Part | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deletePart, setDeletePart] = useState<Part | null>(null);
  const [detailPart, setDetailPart] = useState<Part | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [manageCategoriesOpen, setManageCategoriesOpen] = useState(false);

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
        p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategories.length === 0 || activeCategories.includes(p.category);
      const matchesSupplier = activeSuppliers.length === 0 || activeSuppliers.includes(p.supplier);
      const matchesLowStock = !showLowStockOnly || p.stock <= p.minStock;
      return matchesSearch && matchesCategory && matchesSupplier && matchesLowStock;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDir === "asc" ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [parts, search, activeCategories, activeSuppliers, showLowStockOnly, sortKey, sortDir]);

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [search, activeCategories, activeSuppliers, showLowStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedParts = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const handleRenameCategory = (oldName: string, newName: string) => {
    // Update parts that use this category
    setParts((prev) => prev.map((p) => (p.category === oldName ? { ...p, category: newName } : p)));
    // Update custom categories list
    if (defaultCategories.includes(oldName)) {
      // Renaming a default: remove old from defaults conceptually by adding new as custom
      setCustomCategories((prev) => [...prev.filter((c) => c !== oldName), newName]);
    } else {
      setCustomCategories((prev) => prev.map((c) => (c === oldName ? newName : c)));
    }
    // Update active filters
    setActiveCategories((prev) => prev.map((c) => (c === oldName ? newName : c)));
  };

  const handleDeleteCategory = (name: string) => {
    // Move parts with this category to "Others"
    setParts((prev) => prev.map((p) => (p.category === name ? { ...p, category: "Others" } : p)));
    // Remove from custom categories
    setCustomCategories((prev) => prev.filter((c) => c !== name));
    // Remove from active filters
    setActiveCategories((prev) => prev.filter((c) => c !== name));
  };

  const handleAddCategory = (name: string) => {
    setCustomCategories((prev) => [...prev, name]);
  };

  const getPartCountForCategory = (category: string) => {
    return parts.filter((p) => p.category === category).length;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Parts</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your spare parts and supplies</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setManageCategoriesOpen(true)}>
              <Tags className="w-4 h-4" />
              Manage Categories
            </Button>
            <Button className="gap-2 shadow-soft" onClick={() => setAddDialogOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Part
            </Button>
          </div>
        </div>

        <AddPartDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          categories={allCategories}
          suppliers={allSuppliers}
          onAdd={handleAddPart}
        />

        <ManageCategoriesDialog
          open={manageCategoriesOpen}
          onOpenChange={setManageCategoriesOpen}
          categories={allCategories}
          defaultCategories={defaultCategories}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
          getPartCountForCategory={getPartCountForCategory}
        />

        <EditPartDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          part={editPart}
          categories={allCategories}
          suppliers={allSuppliers}
          onSave={handleEditPart}
        />

        <PartDetailDialog
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          part={detailPart}
          movements={movements}
          onRecordMovement={handleRecordMovement}
        />

        <AlertDialog
          open={!!deletePart}
          onOpenChange={(v) => {
            if (!v) setDeletePart(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Part</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deletePart?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => deletePart && handleDeletePart(deletePart.id)}
              >
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
        {(() => {
          const activeFilterCount = activeCategories.length + activeSuppliers.length + (showLowStockOnly ? 1 : 0);
          return (
            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search parts or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-secondary/60 border-0 shadow-soft"
                />
              </div>
              <Popover open={filterOpen} onOpenChange={(open) => { setFilterOpen(open); if (!open) { setCategorySearch(""); setSupplierSearch(""); } }}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-9 text-xs">
                    <Filter className="w-3.5 h-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="h-5 w-5 p-0 flex items-center justify-center text-[10px] rounded-full">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Filters</p>
                    {activeFilterCount > 0 && (
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => {
                          setActiveCategories([]);
                          setActiveSuppliers([]);
                          setShowLowStockOnly(false);
                        }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="category" className="border-b-0">
                      <AccordionTrigger className="py-2 text-xs font-medium text-muted-foreground hover:no-underline">
                        <span className="flex items-center gap-2">
                          Category
                          {activeCategories.length > 0 && (
                            <Badge className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                              {activeCategories.length}
                            </Badge>
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        {allCategories.length > 5 && (
                          <Input
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="h-7 text-xs mb-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        )}
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {allCategories
                            .filter((cat) => cat.toLowerCase().includes(categorySearch.toLowerCase()))
                            .map((cat) => (
                              <div key={cat} className="flex items-center gap-2">
                                <Checkbox
                                  id={`cat-${cat}`}
                                  checked={activeCategories.includes(cat)}
                                  onCheckedChange={(checked) => {
                                    setActiveCategories((prev) => (checked ? [...prev, cat] : prev.filter((c) => c !== cat)));
                                  }}
                                />
                                <label htmlFor={`cat-${cat}`} className="text-xs cursor-pointer">
                                  {cat}
                                </label>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="supplier" className="border-b-0">
                      <AccordionTrigger className="py-2 text-xs font-medium text-muted-foreground hover:no-underline">
                        <span className="flex items-center gap-2">
                          Supplier
                          {activeSuppliers.length > 0 && (
                            <Badge className="h-4 min-w-4 p-0 flex items-center justify-center text-[10px] rounded-full">
                              {activeSuppliers.length}
                            </Badge>
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        {allSuppliers.length > 5 && (
                          <Input
                            placeholder="Search suppliers..."
                            value={supplierSearch}
                            onChange={(e) => setSupplierSearch(e.target.value)}
                            className="h-7 text-xs mb-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        )}
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                          {allSuppliers
                            .filter((s) => s.toLowerCase().includes(supplierSearch.toLowerCase()))
                            .map((s) => (
                              <div key={s} className="flex items-center gap-2">
                                <Checkbox
                                  id={`sup-${s}`}
                                  checked={activeSuppliers.includes(s)}
                                  onCheckedChange={(checked) => {
                                    setActiveSuppliers((prev) => (checked ? [...prev, s] : prev.filter((x) => x !== s)));
                                  }}
                                />
                                <label htmlFor={`sup-${s}`} className="text-xs cursor-pointer">
                                  {s}
                                </label>
                              </div>
                            ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Others</label>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="low-stock-filter"
                          checked={showLowStockOnly}
                          onCheckedChange={(v) => setShowLowStockOnly(v === true)}
                        />
                        <label
                          htmlFor="low-stock-filter"
                          className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5"
                        >
                          <AlertTriangle className="w-3 h-3 text-warning" />
                          Low stock only
                        </label>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Active filter badges - hidden on mobile */}
              {activeFilterCount > 0 && (
                <div className="hidden md:flex gap-1.5 flex-wrap">
                  {activeCategories.map((cat) => (
                    <Badge
                      key={cat}
                      variant="secondary"
                      className="gap-1 text-xs cursor-pointer h-9 px-3 rounded-md"
                      onClick={() => setActiveCategories((prev) => prev.filter((c) => c !== cat))}
                    >
                      {cat} <X className="w-3 h-3" />
                    </Badge>
                  ))}
                  {activeSuppliers.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="gap-1 text-xs cursor-pointer h-9 px-3 rounded-md"
                      onClick={() => setActiveSuppliers((prev) => prev.filter((x) => x !== s))}
                    >
                      {s} <X className="w-3 h-3" />
                    </Badge>
                  ))}
                  {showLowStockOnly && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-xs cursor-pointer h-9 px-3 rounded-md"
                      onClick={() => setShowLowStockOnly(false)}
                    >
                      Low Stock <X className="w-3 h-3" />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Table */}
        <Card className="shadow-soft border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <SortableHead
                    label="Part Name"
                    sortKey="name"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[200px]"
                  />
                  <SortableHead
                    label="SKU"
                    sortKey="sku"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[130px]"
                  />
                  <SortableHead
                    label="Category"
                    sortKey="category"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[110px] hidden md:table-cell"
                  />
                  <SortableHead
                    label="UOM"
                    sortKey="uom"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[80px] hidden md:table-cell"
                  />
                  <SortableHead
                    label="Stock"
                    sortKey="stock"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[90px] text-center"
                  />
                  <SortableHead
                    label="Cost"
                    sortKey="costPrice"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[90px] hidden sm:table-cell text-right"
                  />
                  <SortableHead
                    label="Sell Price"
                    sortKey="sellPrice"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[100px] text-right"
                  />
                  <SortableHead
                    label="Supplier"
                    sortKey="supplier"
                    currentSort={sortKey}
                    currentDir={sortDir}
                    onSort={handleSort}
                    className="w-[130px] hidden lg:table-cell"
                  />
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedParts.map((part) => {
                  const isLow = part.stock <= part.minStock;
                  return (
                    <TableRow
                      key={part.id}
                      className="hover:bg-secondary/20 cursor-pointer"
                      onClick={() => {
                        setDetailPart(part);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium text-sm max-w-[200px]">
                        <TruncatedCell>{part.name}</TruncatedCell>
                      </TableCell>
                      <TableCell className="max-w-[130px]">
                        <TruncatedCell className="text-xs font-mono text-muted-foreground">{part.sku}</TruncatedCell>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[110px]">
                        <Badge variant="secondary" className="text-[11px]">
                          {part.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground uppercase">
                        {part.uom}
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
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setDetailPart(part);
                                setDetailDialogOpen(true);
                              }}
                            >
                              <Package className="w-3.5 h-3.5 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditPart(part);
                                setEditDialogOpen(true);
                              }}
                            >
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
                {paginatedParts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                      No parts found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
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
                {filtered.length === 0 ? "0" : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)}`} of {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
}
