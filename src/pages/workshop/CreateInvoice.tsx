import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, CalendarIcon, Plus, Trash2, Save, Send, Printer,
  Copy, XCircle, FileText, ChevronDown, Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { mockParts, type Part } from "@/data/inventoryParts";

// ── Constants ──────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  "GENERAL SERVICE", "REPAIR", "INSPECTION", "ACCIDENT REPAIR",
  "TYRE CHANGE", "BATTERY CHANGE", "BRAKE SERVICE", "ENGINE WORK",
  "TRANSMISSION", "OTHER",
] as const;

const VEHICLE_TYPES = [
  "SEDAN", "SUV", "HATCHBACK", "MPV", "PICKUP", "VAN", "TRUCK",
  "MOTORCYCLE", "OTHER",
] as const;

// ── Types ──────────────────────────────────────────────────────────────

interface PartLine {
  id: string;
  partId: string;
  name: string;
  sku: string;
  stock: number;
  quantity: number;
  unitPrice: number;
}

interface LabourLine {
  id: string;
  description: string;
  hours: number;
  hourlyRate: number;
}

let lineCounter = 0;
const nextId = () => `line-${++lineCounter}`;

// ── Component ──────────────────────────────────────────────────────────

export default function CreateInvoice() {
  const navigate = useNavigate();

  // Header
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [serviceDate, setServiceDate] = useState<Date | undefined>(new Date());
  const [serviceType, setServiceType] = useState("");
  const [technician, setTechnician] = useState("");

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Vehicle
  const [plateNumber, setPlateNumber] = useState("");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [odometer, setOdometer] = useState("");

  // Lines
  const [parts, setParts] = useState<PartLine[]>([]);
  const [labour, setLabour] = useState<LabourLine[]>([]);

  // Notes
  const [description, setDescription] = useState("");
  const [partsSummary, setPartsSummary] = useState("");
  const [remarks, setRemarks] = useState("");

  // Discount
  const [discount, setDiscount] = useState("0");

  // Parts picker
  const [partSearchOpen, setPartSearchOpen] = useState(false);
  const [partSearch, setPartSearch] = useState("");

  // ── Derived totals ────────────────────────────────────────────────────

  const partsTotal = useMemo(
    () => parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0),
    [parts],
  );

  const labourTotal = useMemo(
    () => labour.reduce((s, l) => s + l.hours * l.hourlyRate, 0),
    [labour],
  );

  const discountValue = Number(discount) || 0;
  const grandTotal = partsTotal + labourTotal - discountValue;

  // ── Handlers ──────────────────────────────────────────────────────────

  const addPart = (part: Part) => {
    // If already added, bump qty
    const existing = parts.find((p) => p.partId === part.id);
    if (existing) {
      setParts((prev) =>
        prev.map((p) =>
          p.partId === part.id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      setParts((prev) => [
        ...prev,
        {
          id: nextId(),
          partId: part.id,
          name: part.name,
          sku: part.sku,
          stock: part.stock,
          quantity: 1,
          unitPrice: part.sellPrice,
        },
      ]);
    }
    setPartSearchOpen(false);
    setPartSearch("");
  };

  const updatePartField = (
    id: string,
    field: "quantity" | "unitPrice",
    value: number,
  ) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const removePart = (id: string) =>
    setParts((prev) => prev.filter((p) => p.id !== id));

  const addLabour = () =>
    setLabour((prev) => [
      ...prev,
      { id: nextId(), description: "", hours: 1, hourlyRate: 0 },
    ]);

  const updateLabourField = (
    id: string,
    field: keyof Omit<LabourLine, "id">,
    value: string | number,
  ) => {
    setLabour((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const removeLabour = (id: string) =>
    setLabour((prev) => prev.filter((l) => l.id !== id));

  const handleSaveDraft = () => toast.success("Draft saved");
  const handleIssue = () => toast.success("Invoice issued");
  const handleSend = () => toast.success("Invoice sent to customer");
  const handlePrint = () => window.print();
  const handleDuplicate = () => toast.info("Invoice duplicated");
  const handleVoid = () => toast.warning("Invoice voided");

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Action Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 self-start text-muted-foreground"
          onClick={() => navigate("/workshop/invoices")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDuplicate}>
            <Copy className="w-3.5 h-3.5" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleVoid}>
            <XCircle className="w-3.5 h-3.5" /> Void
          </Button>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSaveDraft}>
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" /> Send
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleIssue}>
            <FileText className="w-3.5 h-3.5" /> Issue Invoice
          </Button>
        </div>
      </div>

      {/* ── Two‑column grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* ═══ Left column ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Invoice Header */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                <Input
                  placeholder="e.g. INV-2024-043"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Service Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !serviceDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 w-4 h-4" />
                      {serviceDate ? format(serviceDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={serviceDate}
                      onSelect={setServiceDate}
                      disabled={(d) => d > new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Technician</Label>
                <Input
                  placeholder="Technician name"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer & Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-soft border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer name" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+65 ..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Plate Number</Label>
                    <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="SGA 1234A" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">VIN</Label>
                    <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="VIN" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Make</Label>
                    <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Model</Label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Corolla" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Odometer (km)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Parts ──────────────────────────────────────────────── */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Parts</CardTitle>
              <Popover open={partSearchOpen} onOpenChange={setPartSearchOpen}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Part
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="end">
                  <Command>
                    <CommandInput
                      placeholder="Search parts..."
                      value={partSearch}
                      onValueChange={setPartSearch}
                    />
                    <CommandList>
                      <CommandEmpty>No parts found.</CommandEmpty>
                      <CommandGroup>
                        {mockParts.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.name}
                            onSelect={() => addPart(p)}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <span className="text-sm">{p.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{p.sku}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px]">
                              {p.stock} in stock
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent className="p-0">
              {parts.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-muted-foreground text-center py-8">
                  No parts added yet. Click "Add Part" to begin.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/30">
                        <TableHead className="text-xs font-medium">Part</TableHead>
                        <TableHead className="text-xs font-medium hidden sm:table-cell">SKU</TableHead>
                        <TableHead className="text-xs font-medium text-center">Stock</TableHead>
                        <TableHead className="text-xs font-medium text-center w-20">Qty</TableHead>
                        <TableHead className="text-xs font-medium text-right w-28">Unit Price</TableHead>
                        <TableHead className="text-xs font-medium text-right w-24">Total</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parts.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="text-sm font-medium">{line.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">{line.sku}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                line.stock <= 5
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-success/10 text-success border-success/20",
                              )}
                            >
                              {line.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              className="h-8 w-16 text-center mx-auto"
                              value={line.quantity}
                              onChange={(e) =>
                                updatePartField(line.id, "quantity", Math.max(1, Number(e.target.value)))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.01}
                              className="h-8 w-24 text-right ml-auto"
                              value={line.unitPrice}
                              onChange={(e) =>
                                updatePartField(line.id, "unitPrice", Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            ${(line.quantity * line.unitPrice).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removePart(line.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Labour ─────────────────────────────────────────────── */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Labour</CardTitle>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={addLabour}>
                <Plus className="w-3.5 h-3.5" /> Add Labour
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {labour.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-muted-foreground text-center py-8">
                  No labour items added yet. Click "Add Labour" to begin.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/30">
                        <TableHead className="text-xs font-medium">Description</TableHead>
                        <TableHead className="text-xs font-medium text-center w-20">Hours</TableHead>
                        <TableHead className="text-xs font-medium text-right w-28">Rate ($/hr)</TableHead>
                        <TableHead className="text-xs font-medium text-right w-24">Total</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labour.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell>
                            <Input
                              className="h-8"
                              placeholder="e.g. Oil change labour"
                              value={line.description}
                              onChange={(e) =>
                                updateLabourField(line.id, "description", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0.25}
                              step={0.25}
                              className="h-8 w-16 text-center mx-auto"
                              value={line.hours}
                              onChange={(e) =>
                                updateLabourField(line.id, "hours", Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              step={0.5}
                              className="h-8 w-24 text-right ml-auto"
                              value={line.hourlyRate}
                              onChange={(e) =>
                                updateLabourField(line.id, "hourlyRate", Number(e.target.value))
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right text-sm font-semibold">
                            ${(line.hours * line.hourlyRate).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeLabour(line.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Notes ──────────────────────────────────────────────── */}
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Textarea
                  rows={2}
                  placeholder="General service description visible in history..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Parts Summary</Label>
                <Textarea
                  rows={2}
                  placeholder="Summary of parts used..."
                  value={partsSummary}
                  onChange={(e) => setPartsSummary(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Remarks</Label>
                <Textarea
                  rows={2}
                  placeholder="Additional notes..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ═══ Right column — Summary sidebar ════════════════════════ */}
        <div className="lg:sticky lg:top-6 space-y-6">
          <Card className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parts Total</span>
                <span className="font-medium">${partsTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Labour Total</span>
                <span className="font-medium">${labourTotal.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${(partsTotal + labourTotal).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm gap-3">
                <span className="text-muted-foreground">Discount</span>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  className="h-8 w-28 text-right"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium text-muted-foreground">Grand Total</span>
                <span className="text-2xl font-bold text-foreground">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Parts items</span>
                <span className="font-medium text-foreground">{parts.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Labour items</span>
                <span className="font-medium text-foreground">{labour.length}</span>
              </div>
              {serviceType && (
                <div className="flex justify-between">
                  <span>Service type</span>
                  <Badge variant="outline" className="text-[10px]">{serviceType}</Badge>
                </div>
              )}
              {vehicleType && (
                <div className="flex justify-between">
                  <span>Vehicle type</span>
                  <Badge variant="outline" className="text-[10px]">{vehicleType}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
