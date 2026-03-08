import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Search,
  Plus,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  Send,
} from "lucide-react";
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

interface Invoice {
  id: string;
  number: string;
  customer: string;
  vehicle: string;
  services: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Draft";
  date: string;
  dueDate: string;
}

const mockInvoices: Invoice[] = [
  { id: "1", number: "INV-2024-042", customer: "Ahmad Tan", vehicle: "Toyota Corolla 2019", services: "Oil Change, Filter Replacement", amount: 185, status: "Paid", date: "2024-01-15", dueDate: "2024-01-30" },
  { id: "2", number: "INV-2024-041", customer: "Sarah Lim", vehicle: "Honda Civic 2021", services: "Brake Pad Replacement", amount: 320, status: "Pending", date: "2024-01-14", dueDate: "2024-01-29" },
  { id: "3", number: "INV-2024-040", customer: "David Ng", vehicle: "BMW 320i 2020", services: "Full Service", amount: 580, status: "Overdue", date: "2024-01-10", dueDate: "2024-01-25" },
  { id: "4", number: "INV-2024-039", customer: "Wei Ming", vehicle: "Mazda 3 2022", services: "Suspension Check, Alignment", amount: 250, status: "Paid", date: "2024-01-08", dueDate: "2024-01-23" },
  { id: "5", number: "INV-2024-038", customer: "Rachel Ong", vehicle: "Mercedes C200 2021", services: "Battery Replacement", amount: 280, status: "Draft", date: "2024-01-07", dueDate: "-" },
  { id: "6", number: "INV-2024-037", customer: "Jason Lee", vehicle: "Subaru WRX 2020", services: "Spark Plug, Coil Replacement", amount: 420, status: "Paid", date: "2024-01-05", dueDate: "2024-01-20" },
  { id: "7", number: "INV-2024-036", customer: "Michelle Tan", vehicle: "Audi A4 2019", services: "Transmission Fluid Change", amount: 195, status: "Pending", date: "2024-01-03", dueDate: "2024-01-18" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  Paid: { icon: CheckCircle2, color: "bg-success/10 text-success border-success/20" },
  Pending: { icon: Clock, color: "bg-accent/10 text-accent border-accent/20" },
  Overdue: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/20" },
  Draft: { icon: FileText, color: "bg-muted text-muted-foreground border-muted" },
};

const tabs = ["All", "Paid", "Pending", "Overdue", "Draft"] as const;

export default function Invoices() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const filtered = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.vehicle.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || inv.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalPaid = mockInvoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalPending = mockInvoices.filter((i) => i.status === "Pending").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = mockInvoices.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage service invoices for your customers
          </p>
        </div>
        <Button className="gap-2 shadow-soft" onClick={() => navigate("/workshop/invoices/new")}>
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalPending.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">${totalOverdue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/60 border-0 shadow-soft"
          />
        </div>
        <div className="flex gap-1.5">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              size="sm"
              className="text-xs h-8"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {mockInvoices.filter((i) => i.status === tab).length}
                </span>
              )}
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
                <TableHead className="text-xs font-medium">Invoice</TableHead>
                <TableHead className="text-xs font-medium">Customer</TableHead>
                <TableHead className="text-xs font-medium hidden md:table-cell">Vehicle</TableHead>
                <TableHead className="text-xs font-medium hidden lg:table-cell">Services</TableHead>
                <TableHead className="text-xs font-medium text-right">Amount</TableHead>
                <TableHead className="text-xs font-medium">Status</TableHead>
                <TableHead className="text-xs font-medium hidden sm:table-cell">Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const config = statusConfig[inv.status];
                return (
                  <TableRow key={inv.id} className="hover:bg-secondary/20">
                    <TableCell className="font-mono text-xs font-medium text-accent">{inv.number}</TableCell>
                    <TableCell className="text-sm font-medium">{inv.customer}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{inv.vehicle}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground max-w-[200px] truncate">{inv.services}</TableCell>
                    <TableCell className="text-right text-sm font-semibold">${inv.amount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[11px] ${config.color}`}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{inv.date}</TableCell>
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
