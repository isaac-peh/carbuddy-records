import { useState } from "react";
import { Download, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar, ComposedChart
} from "recharts";
import { mockInvoices } from "@/data/invoicesData";
import { mockParts } from "@/data/inventoryParts";
import { mockCustomers } from "@/data/customersData";

export default function Reports() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("This Month");
  const [revenueView, setRevenueView] = useState("Monthly");

  // Mock filtered data based on date range
  const filteredInvoices = mockInvoices; // In a real app, filter by dateRange
  
  // KPI Calculations
  const paidInvoices = filteredInvoices.filter(i => i.status === "Paid");
  const pendingOverdue = filteredInvoices.filter(i => i.status === "Pending" || i.status === "Overdue");
  const overdueCount = filteredInvoices.filter(i => i.status === "Overdue").length;
  
  const totalRevenue = paidInvoices.reduce((sum, i) => sum + i.grandTotal, 0);
  const outstanding = pendingOverdue.reduce((sum, i) => sum + i.grandTotal, 0);
  const invoicesIssued = filteredInvoices.filter(i => i.status !== "Draft").length;
  const avgInvoiceValue = invoicesIssued > 0 ? totalRevenue / invoicesIssued : 0;
  const collectionRate = invoicesIssued > 0 ? (paidInvoices.length / invoicesIssued) * 100 : 0;

  // Chart Data
  const revenueData = [
    { name: "Jan", revenue: 4000, outstanding: 2400 },
    { name: "Feb", revenue: 3000, outstanding: 1398 },
    { name: "Mar", revenue: 2000, outstanding: 9800 },
    { name: "Apr", revenue: 2780, outstanding: 3908 },
    { name: "May", revenue: 1890, outstanding: 4800 },
    { name: "Jun", revenue: 2390, outstanding: 3800 },
    { name: "Jul", revenue: 3490, outstanding: 4300 },
  ];

  const statusData = [
    { name: 'Paid', value: paidInvoices.length, color: 'hsl(var(--success))' },
    { name: 'Pending', value: filteredInvoices.filter(i=>i.status==='Pending').length, color: 'hsl(var(--accent))' },
    { name: 'Overdue', value: overdueCount, color: 'hsl(var(--destructive))' },
    { name: 'Draft', value: filteredInvoices.filter(i=>i.status==='Draft').length, color: 'hsl(var(--muted-foreground))' },
  ];

  const serviceData = [
    { name: "General Service", revenue: 4500 },
    { name: "Brake Repair", revenue: 3200 },
    { name: "Transmission", revenue: 2800 },
    { name: "Engine Work", revenue: 2100 },
    { name: "Suspension", revenue: 1500 },
    { name: "Battery Change", revenue: 800 },
  ];

  const volumeData = [
    { name: "Jan", paid: 12, pending: 4 },
    { name: "Feb", paid: 15, pending: 3 },
    { name: "Mar", paid: 18, pending: 5 },
    { name: "Apr", paid: 14, pending: 2 },
    { name: "May", paid: 20, pending: 6 },
    { name: "Jun", paid: 24, pending: 4 },
  ];

  const topParts = [
    { name: "Engine Oil 5W-30", count: 45, revenue: 1575 },
    { name: "Oil Filter", count: 42, revenue: 630 },
    { name: "Brake Pads (Front)", count: 18, revenue: 3240 },
    { name: "Air Filter", count: 15, revenue: 300 },
    { name: "Spark Plugs", count: 12, revenue: 1104 },
  ];

  const lowStock = mockParts.filter(p => p.stock <= p.minStock);

  const handleExport = () => {
    toast({ title: "Report exported", description: "Your report has been downloaded successfully." });
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your workshop's performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-secondary/50 rounded-lg p-1 flex items-center">
            {["This Week", "This Month", "Last 3 Months", "This Year"].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  dateRange === range ? "bg-background shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Total Revenue</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Outstanding</p>
            <p className="text-2xl font-bold">${outstanding.toLocaleString()}</p>
            <p className="text-xs text-warning mt-1 font-medium">{overdueCount} overdue</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Invoices Issued</p>
            <p className="text-2xl font-bold">{invoicesIssued}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Avg Invoice Value</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">${avgInvoiceValue.toFixed(0)}</p>
              <span className="flex items-center text-xs font-medium text-success">
                <TrendingUp className="w-3 h-3 mr-0.5" />
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Collection Rate</p>
            <p className="text-2xl font-bold mb-2">{collectionRate.toFixed(0)}%</p>
            <Progress value={collectionRate} className="h-1.5" />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
          <div className="flex items-center bg-secondary/50 rounded-lg p-0.5">
            {["Weekly", "Monthly"].map((view) => (
              <button
                key={view}
                onClick={() => setRevenueView(view)}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${
                  revenueView === view ? "bg-background shadow-soft" : "text-muted-foreground"
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(value) => `$${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '13px' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px', marginBottom: '4px' }}
                  formatter={(value: number) => [`$${value}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--accent))" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="outstanding" name="Outstanding" stroke="hsl(var(--warning))" strokeWidth={2} fillOpacity={1} fill="url(#colorOutstanding)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Invoice Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                <span className="text-3xl font-bold">{filteredInvoices.length}</span>
                <span className="text-xs text-muted-foreground">Invoices</span>
              </div>
            </div>
            <div className="w-full flex justify-center gap-4 mt-2">
              {statusData.map(status => (
                <div key={status.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-muted-foreground">{status.name}</span>
                  <span className="font-medium">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Services by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`$${value}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Monthly Invoice Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--secondary))' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="paid" name="Paid" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 4, 4]} barSize={32} />
                  <Bar dataKey="pending" name="Pending & Overdue" stackId="a" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Technician Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { name: "James Wong", initials: "JW", count: 42, rev: 12500, avg: 297, rate: 95, top: true },
                { name: "Ali Rahman", initials: "AR", count: 38, rev: 9800, avg: 257, rate: 88, top: false },
                { name: "Sarah Lee", initials: "SL", count: 31, rev: 7200, avg: 232, rate: 92, top: false },
              ].map(tech => (
                <div key={tech.name} className={`flex items-center justify-between p-4 ${tech.top ? "border-l-2 border-l-accent bg-accent/5" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                      {tech.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tech.name}</p>
                      <p className="text-[11px] text-muted-foreground">{tech.count} invoices • {tech.rate}% paid rate</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">${tech.rev.toLocaleString()}</p>
                    <p className="text-[11px] text-muted-foreground">Avg ${tech.avg}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Top Parts Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topParts} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={120} />
                  <Tooltip cursor={{ fill: 'hsl(var(--secondary))' }} contentStyle={{ borderRadius: '8px' }} />
                  <Bar dataKey="count" name="Usage Count" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {lowStock.length > 0 ? (
              <div className="divide-y divide-border/50">
                {lowStock.slice(0,5).map(part => (
                  <div key={part.sku} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium">{part.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{part.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant="outline" className={`text-[11px] ${part.stock <= 2 ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                          {part.stock} left (Min: {part.minStock})
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({title: "Restock reminder set"})}>
                        Restock
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                All stock levels healthy
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 6 */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Top Customers</CardTitle>
          <CardDescription>Based on total spend across all time</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Vehicles</th>
                <th className="px-6 py-3 font-medium">Total Spent</th>
                <th className="px-6 py-3 font-medium">Last Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockCustomers.slice(0,5).map((c, i) => (
                <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? "bg-yellow-500/20 text-yellow-700" :
                      i === 1 ? "bg-slate-300/40 text-slate-700" :
                      i === 2 ? "bg-amber-700/20 text-amber-800" : "bg-secondary text-muted-foreground"
                    }`}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">
                        {c.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-foreground flex items-center gap-2">
                          {c.name}
                          {c.loyaltyStatus === 'VIP' && <Badge variant="secondary" className="text-[10px] h-4 px-1 bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20">VIP</Badge>}
                          {c.loyaltyStatus === 'Regular' && <Badge variant="secondary" className="text-[10px] h-4 px-1">Regular</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">{c.totalVisits} visits</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {c.vehicles.map(v => (
                        <Badge key={v.plate} variant="outline" className="font-mono text-[10px]">{v.plate}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    ${c.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {c.lastVisitDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}