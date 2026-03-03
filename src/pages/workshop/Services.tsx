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

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

const mockServices: Service[] = [
  { id: "1", name: "Engine Oil Change (Labor)", description: "Drain & replace engine oil, reset service indicator", price: 40 },
  { id: "2", name: "Tyre Change", description: "Remove & mount tyre, balance wheel", price: 25 },
  { id: "3", name: "Brake Pad Replacement (Labor)", description: "Remove caliper, swap pads, bleed if needed", price: 60 },
  { id: "4", name: "Diagnostic Scan", description: "Full OBD-II scan & fault code report", price: 35 },
  { id: "5", name: "A/C Regas", description: "Evacuate, vacuum & recharge A/C system", price: 80 },
  { id: "6", name: "Wheel Alignment", description: "4-wheel alignment with printout", price: 50 },
  { id: "7", name: "Battery Replacement (Labor)", description: "Remove old battery, install & test new unit", price: 20 },
  { id: "8", name: "Spark Plug Replacement (Labor)", description: "Remove & replace spark plugs, gap check", price: 45 },
];

type SortKey = "name" | "description" | "price";
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

export default function Services() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let result = mockServices.filter(
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
        return sortDir === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [search, sortKey, sortDir]);

  const avgPrice =
    mockServices.length > 0
      ? Math.round(mockServices.reduce((sum, s) => sum + s.price, 0) / mockServices.length)
      : 0;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Services</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your labour & workmanship charges
            </p>
          </div>
          <Button className="gap-2 shadow-soft">
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
                <p className="text-xl font-bold text-foreground">{mockServices.length}</p>
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
                <p className="text-xl font-bold text-foreground">${avgPrice}</p>
                <p className="text-xs text-muted-foreground">Average Price</p>
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
                  <SortableHead label="Price" sortKey="price" currentSort={sortKey} currentDir={sortDir} onSort={handleSort} className="w-[100px] text-right" />
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((service) => (
                  <TableRow key={service.id} className="hover:bg-secondary/20">
                    <TableCell className="font-medium text-sm max-w-[240px]">
                      <TruncatedCell>{service.name}</TruncatedCell>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <TruncatedCell className="text-sm text-muted-foreground">{service.description}</TruncatedCell>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium">${service.price}</TableCell>
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
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                      No services found
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
