import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  BarChart3,
  Users,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell, XAxis } from "recharts";
import { mockInvoices } from "@/data/invoicesData";
import { mockParts } from "@/data/inventoryParts";

const statusColor: Record<string, string> = {
  "In Progress": "bg-accent/10 text-accent border-accent/20",
  "Completed": "bg-success/10 text-success border-success/20",
  "Awaiting Parts": "bg-warning/10 text-warning border-warning/20",
  "Scheduled": "bg-secondary text-foreground border-border/50",
  "Paid": "bg-success/10 text-success border-success/20",
  "Pending": "bg-accent/10 text-accent border-accent/20",
  "Overdue": "bg-destructive/10 text-destructive border-destructive/20",
};

const sparklineData = [
  { val: 120 }, { val: 230 }, { val: 180 }, { val: 340 }, { val: 280 }, { val: 410 }, { val: 390 }
];

const countSparkline = [
  { val: 4 }, { val: 7 }, { val: 5 }, { val: 10 }, { val: 8 }, { val: 12 }, { val: 11 }
];

const revenueWeekData = [
  { name: 'Mon', amount: 450 },
  { name: 'Tue', amount: 820 },
  { name: 'Wed', amount: 600 },
  { name: 'Thu', amount: 1200 },
  { name: 'Fri', amount: 950 },
  { name: 'Sat', amount: 1800, today: true },
  { name: 'Sun', amount: 300 },
];

const recentActivity = [
  { id: 1, type: 'payment', desc: 'Invoice INV-2024-042 paid', time: '2 hours ago', icon: DollarSign, color: 'text-success' },
  { id: 2, type: 'job', desc: 'Honda Civic (JKR 8812) service completed', time: '3 hours ago', icon: CheckCircle2, color: 'text-accent' },
  { id: 3, type: 'alert', desc: 'Engine Oil 5W-30 stock critically low', time: '5 hours ago', icon: AlertTriangle, color: 'text-destructive' },
  { id: 4, type: 'invoice', desc: 'New invoice created for BMW 320i', time: 'Yesterday', icon: FileText, color: 'text-muted-foreground' },
  { id: 5, type: 'job', desc: 'Started work on Mazda 3 (BPP 7744)', time: 'Yesterday', icon: Wrench, color: 'text-accent' },
];

const agenda = [
  { id: 1, plate: 'WKL 4521', customer: 'Ahmad Tan', service: 'Oil Change', time: '10:00 AM', status: 'Completed' },
  { id: 2, plate: 'VDN 3301', customer: 'David Ng', service: 'Full Service', time: '02:00 PM', status: 'In Progress' },
  { id: 3, plate: 'WA 9988 C', customer: 'Rachel Ong', service: 'Battery Change', time: '04:30 PM', status: 'Scheduled' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const lowStockParts = mockParts.filter(p => p.stock <= p.minStock);
  const pendingInvoices = mockInvoices.filter(i => i.status === 'Pending' || i.status === 'Overdue');
  const outstandingAmount = pendingInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  const statusData = [
    { name: 'Paid', value: 45, color: 'hsl(var(--success))' },
    { name: 'Pending', value: 12, color: 'hsl(var(--accent))' },
    { name: 'Overdue', value: 3, color: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Greeting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{greeting}, Workshop</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {dateStr} • Here's what's happening today.
          </p>
        </div>
        <Button onClick={() => navigate('/workshop/invoices/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft border-border/50">
          <CardContent className="p-5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Revenue This Month</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-foreground">$32,580</p>
                <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/10 text-[10px] px-1 h-5">+8.2%</Badge>
              </div>
            </div>
            <div className="h-10 w-full mt-4 -mx-2 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="val" stroke="hsl(var(--success))" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-5 flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Invoices This Month</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-foreground">142</p>
                <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/10 text-[10px] px-1 h-5">+12%</Badge>
              </div>
            </div>
            <div className="h-10 w-full mt-4 -mx-2 -mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={countSparkline}>
                  <Line type="monotone" dataKey="val" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50">
          <CardContent className="p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Outstanding Amount</p>
              <p className={`text-2xl font-bold mt-1 ${outstandingAmount > 0 ? "text-warning" : "text-foreground"}`}>
                ${outstandingAmount.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
              <FileText className="w-3.5 h-3.5" />
              {pendingInvoices.length} invoices waiting
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border/50 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => navigate('/workshop/inventory')}>
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Parts Low in Stock</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-foreground">{lowStockParts.length}</p>
                {lowStockParts.length > 0 && (
                  <Badge variant="destructive" className="text-[10px] px-1 h-5">Action needed</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-accent">
              View inventory <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Revenue This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueWeekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                      {revenueWeekData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.today ? 'hsl(var(--accent))' : 'hsl(var(--secondary))'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Invoices */}
          <Card className="shadow-soft border-border/50 flex flex-col">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <div className="divide-y divide-border/50">
                {mockInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} 
                    className="flex items-center justify-between px-5 py-3 hover:bg-secondary/30 cursor-pointer transition-colors"
                    onClick={() => navigate(`/workshop/invoices/${invoice.id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{invoice.customer}</span>
                        <span className="text-xs font-mono text-muted-foreground">{invoice.number}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{invoice.vehicle} • {invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-4 text-right shrink-0">
                      <span className="text-sm font-bold">${invoice.grandTotal}</span>
                      <Badge variant="outline" className={`text-[10px] w-20 justify-center ${statusColor[invoice.status] || ""}`}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="p-3 border-t border-border/50 text-center text-xs font-medium text-accent hover:bg-secondary/20 cursor-pointer transition-colors"
                onClick={() => navigate('/workshop/invoices')}
              >
                View all invoices →
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-2 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {recentActivity.map((activity, i) => (
                  <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-background p-3 rounded-lg border border-border shadow-soft">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">{activity.time}</span>
                      </div>
                      <div className="text-sm">{activity.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width, Sticky */}
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-20 flex flex-col gap-2 shadow-soft hover:border-accent/50 hover:bg-accent/5 transition-all" onClick={() => navigate('/workshop/invoices/new')}>
              <Plus className="w-5 h-5 text-accent" />
              <span className="text-xs">New Invoice</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 shadow-soft hover:border-accent/50 hover:bg-accent/5 transition-all" onClick={() => navigate('/workshop/inventory')}>
              <Package className="w-5 h-5 text-accent" />
              <span className="text-xs">Add Part</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 shadow-soft hover:border-accent/50 hover:bg-accent/5 transition-all" onClick={() => navigate('/workshop/reports')}>
              <BarChart3 className="w-5 h-5 text-accent" />
              <span className="text-xs">View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 shadow-soft hover:border-accent/50 hover:bg-accent/5 transition-all" onClick={() => navigate('/workshop/customers')}>
              <Users className="w-5 h-5 text-accent" />
              <span className="text-xs">Customers</span>
            </Button>
          </div>

          {/* Today's Agenda */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>Today's Agenda</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {agenda.map((item) => (
                  <div key={item.id} className="px-5 py-3.5 hover:bg-secondary/20 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium bg-secondary px-1.5 py-0.5 rounded">{item.time}</span>
                        <Badge variant="outline" className="font-mono text-[10px] px-1">{item.plate}</Badge>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${statusColor[item.status] || ""}`}>{item.status}</Badge>
                    </div>
                    <p className="text-sm font-medium">{item.customer}</p>
                    <p className="text-xs text-muted-foreground">{item.service}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invoice Status Donut */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Invoice Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[160px] w-full relative mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold">60</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="space-y-2">
                {statusData.map(status => (
                  <div key={status.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: status.color }} />
                      <span className="text-muted-foreground">{status.name}</span>
                    </div>
                    <span className="font-medium">{status.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}