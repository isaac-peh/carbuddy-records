import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  DollarSign,
  ListChecks,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddServiceDialog from "@/components/workshop/AddServiceDialog";

interface Service {
  id: string;
  name: string;
  description: string;
  flatPrice: number | null;
  hourlyRate: number | null;
}

const initialServices: Service[] = [
  { id: "1", name: "Engine Oil Change (Labor)", description: "Drain & replace engine oil, reset service indicator", flatPrice: 40, hourlyRate: null },
  { id: "2", name: "Tyre Change", description: "Remove & mount tyre, balance wheel", flatPrice: 25, hourlyRate: null },
  { id: "3", name: "Brake Pad Replacement (Labor)", description: "Remove caliper, swap pads, bleed if needed", flatPrice: 60, hourlyRate: null },
  { id: "4", name: "Diagnostic Scan", description: "Full OBD-II scan & fault code report", flatPrice: 35, hourlyRate: null },
  { id: "5", name: "A/C Regas", description: "Evacuate, vacuum & recharge A/C system", flatPrice: 80, hourlyRate: null },
  { id: "6", name: "Wheel Alignment", description: "4-wheel alignment with printout", flatPrice: 50, hourlyRate: null },
  { id: "7", name: "Battery Replacement (Labor)", description: "Remove old battery, install & test new unit", flatPrice: 20, hourlyRate: null },
  { id: "8", name: "Spark Plug Replacement (Labor)", description: "Remove & replace spark plugs, gap check", flatPrice: null, hourlyRate: 45 },
];

type SortKey = "name" | "description" | "flatPrice" | "hourlyRate";
type SortDir = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function formatPrice(flat: number | null, hourly: number | null) {
  const parts: string[] = [];
  if (flat != null) parts.push(`$${flat.toFixed(2)}`);
  if (hourly != null) parts.push(`$${hourly.toFixed(2)}/hr`);
  return parts.length ? parts.join(" · ") : "—";
}

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

export default function Services() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addOpen, setAddOpen] = useState(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleAddService = (svc: { name: string; description: string; flatPrice: number | null; hourlyRate: number | null }) => {
    setServices((prev) => [
      ...prev,
      { id: String(Date.now()), ...svc },
    ]);
  };

  const filtered = useMemo(() => {
    let result = services.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = aVal == null ? "" : String(aVal);
        const bStr = bVal == null ? "" : String(bVal);
        return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [services, search, sortKey, sortDir]);

  // Reset page on search change
  useMemo(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedServices = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const avgFlatPrice = (() => {
    const withFlat = services.filter((s) => s.flatPrice != null);
    return withFlat.length > 0 ? Math.round(withFlat.reduce((sum, s) => sum + (s.flatPrice ?? 0), 0) / withFlat.length) : 0;
  })();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Services</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your labour & workmanship charges
            </p>
          </div>
          <Button className="gap-2 shadow-soft" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Service
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <ListChecks className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{services.length}</p>
                <p className="text-xs text-muted-foreground">Total Services</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">${avgFlatPrice}</p>
                <p className="text-xs text-muted-foreground">Avg Flat Price</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/60 border-0 shadow-soft"
          />
        </div>

        {/* Table */}
        <Card className="shadow-soft border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <SortableHead label="Service Name" sortKey="name" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[240px]" />
                  <SortableHead label="Description" sortKey="description" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="hidden sm:table-cell" />
                  <SortableHead label="Flat Price" sortKey="flatPrice" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[110px] text-right" />
                  <SortableHead label="Hourly Rate" sortKey="hourlyRate" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[110px] text-right" />
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-secondary/20">
                    <TableCell className="font-medium text-sm max-w-[240px]">
                      <TruncatedCell>{service.name}</TruncatedCell>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <TruncatedCell className="text-sm text-muted-foreground">{service.description}</TruncatedCell>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">{service.flatPrice != null ? `$${service.flatPrice.toFixed(2)}` : "—"}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{service.hourlyRate != null ? `$${service.hourlyRate.toFixed(2)}/hr` : "—"}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedServices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      No services found
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
