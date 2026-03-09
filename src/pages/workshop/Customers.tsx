import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users, MoreHorizontal, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockCustomers } from "@/data/customersData";

export default function Customers() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const returningCustomers = mockCustomers.filter(c => c.totalVisits > 1).length;
  const outstandingBalanceTotal = mockCustomers.reduce((sum, c) => sum + c.outstandingBalance, 0);

  const filteredCustomers = mockCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.phone.includes(search) || 
                          (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
                          c.vehicles.some(v => v.plate.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (filter === "Has Outstanding Balance") return c.outstandingBalance > 0;
    if (filter === "Regular") return c.loyaltyStatus === "Regular" || c.loyaltyStatus === "VIP";
    if (filter === "New") return c.loyaltyStatus === "New";
    
    return true;
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer directory and visit history</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Total Customers</p>
            <p className="text-2xl font-bold">{mockCustomers.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Returning Customers</p>
            <p className="text-2xl font-bold">{returningCustomers}</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-muted-foreground mb-1">Outstanding Balance</p>
            <p className={`text-2xl font-bold ${outstandingBalanceTotal > 0 ? "text-warning" : ""}`}>
              ${outstandingBalanceTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, phone, email, or plate..." 
            className="pl-9 bg-background"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Customers</SelectItem>
              <SelectItem value="Has Outstanding Balance">Has Outstanding</SelectItem>
              <SelectItem value="Regular">Regulars & VIPs</SelectItem>
              <SelectItem value="New">New Customers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Card className="shadow-soft border-border/50">
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No customers found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Customers appear automatically when you create invoices. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase whitespace-nowrap">
                  <tr>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Vehicles</th>
                    <th className="px-5 py-3 font-medium">Visits</th>
                    <th className="px-5 py-3 font-medium">Total Spent</th>
                    <th className="px-5 py-3 font-medium">Outstanding</th>
                    <th className="px-5 py-3 font-medium">Last Visit</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredCustomers.map((c) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => navigate(`/workshop/customers/${c.id}`)}
                    >
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-bold text-foreground">{c.name}</div>
                            {c.email && <div className="text-[11px] text-muted-foreground">{c.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {c.phone}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="flex gap-1">
                          {c.vehicles.slice(0,2).map(v => (
                            <Badge key={v.plate} variant="outline" className="font-mono text-[10px] bg-background">{v.plate}</Badge>
                          ))}
                          {c.vehicles.length > 2 && (
                            <Badge variant="secondary" className="text-[10px]">+{c.vehicles.length - 2}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Badge variant="secondary">{c.totalVisits}</Badge>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-medium">
                        ${c.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {c.outstandingBalance > 0 ? (
                          <span className="text-warning font-medium">${c.outstandingBalance.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {c.lastVisitDate}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-right" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/workshop/customers/${c.id}`)}>
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" /> Edit Customer
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}