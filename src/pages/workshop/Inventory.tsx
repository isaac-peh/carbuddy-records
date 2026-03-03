import { useState } from "react";
import {
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const categories = ["All", "Brakes", "Lubricants", "Filters", "Ignition", "Accessories", "Electrical"];

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = mockParts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = mockParts.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  const lowStockCount = mockParts.filter((p) => p.stock <= p.minStock).length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Parts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your spare parts and supplies
          </p>
        </div>
        <Button className="gap-2 shadow-soft">
          <Plus className="w-4 h-4" />
          Add Part
        </Button>
      </div>

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
          {categories.map((cat) => (
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
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-xs font-medium">Part Name</TableHead>
                <TableHead className="text-xs font-medium">SKU</TableHead>
                <TableHead className="text-xs font-medium hidden md:table-cell">Category</TableHead>
                <TableHead className="text-xs font-medium text-center">Stock</TableHead>
                <TableHead className="text-xs font-medium hidden sm:table-cell text-right">Cost</TableHead>
                <TableHead className="text-xs font-medium text-right">Sell Price</TableHead>
                <TableHead className="text-xs font-medium hidden lg:table-cell">Supplier</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((part) => {
                const isLow = part.stock <= part.minStock;
                return (
                  <TableRow key={part.id} className="hover:bg-secondary/20">
                    <TableCell className="font-medium text-sm">{part.name}</TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{part.sku}</TableCell>
                    <TableCell className="hidden md:table-cell">
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
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{part.supplier}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
