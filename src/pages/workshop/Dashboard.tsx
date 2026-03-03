import {
  Package,
  FileText,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wrench,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Parts",
    value: "1,284",
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    description: "vs last month",
  },
  {
    title: "Open Invoices",
    value: "23",
    change: "$18,420",
    trend: "up" as const,
    icon: FileText,
    description: "outstanding",
  },
  {
    title: "Revenue (MTD)",
    value: "$32,580",
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Low Stock Items",
    value: "7",
    change: "-3",
    trend: "down" as const,
    icon: AlertTriangle,
    description: "vs last week",
  },
];

const recentJobs = [
  { id: "J-1042", vehicle: "Toyota Corolla 2019", service: "Oil Change + Filter", status: "In Progress", customer: "Ahmad Tan" },
  { id: "J-1041", vehicle: "Honda Civic 2021", service: "Brake Pad Replacement", status: "Completed", customer: "Sarah Lim" },
  { id: "J-1040", vehicle: "BMW 320i 2020", service: "Full Service", status: "Awaiting Parts", customer: "David Ng" },
  { id: "J-1039", vehicle: "Mazda 3 2022", service: "Suspension Check", status: "Completed", customer: "Wei Ming" },
];

const lowStockItems = [
  { name: "Brake Pads (Front)", sku: "BP-FRT-001", stock: 2, min: 10 },
  { name: "Engine Oil 5W-30 (5L)", sku: "OIL-5W30-5L", stock: 3, min: 8 },
  { name: "Oil Filter (Universal)", sku: "FLT-OIL-UNI", stock: 4, min: 15 },
];

const statusColor: Record<string, string> = {
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Awaiting Parts": "bg-warning/10 text-warning border-warning/20",
};

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here's what's happening today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-soft border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-secondary">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-success" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-destructive" />
                  )}
                  <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.title} · {stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2 shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                Recent Jobs
              </CardTitle>
              <a href="/workshop/jobs" className="text-xs text-accent hover:underline">
                View all
              </a>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{job.id}</span>
                      <span className="text-sm font-medium text-foreground truncate">{job.vehicle}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {job.service} · {job.customer}
                    </p>
                  </div>
                  <Badge variant="outline" className={`text-[11px] shrink-0 ${statusColor[job.status] || ""}`}>
                    {job.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-soft border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {lowStockItems.map((item) => (
                <div key={item.sku} className="px-5 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <Badge variant="destructive" className="text-[11px]">
                      {item.stock} left
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-mono text-muted-foreground">{item.sku}</span>
                    <span className="text-[11px] text-muted-foreground">· Min: {item.min}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 pt-2">
              <a href="/workshop/inventory" className="text-xs text-accent hover:underline flex items-center gap-1">
                Manage inventory <TrendingUp className="w-3 h-3" />
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
