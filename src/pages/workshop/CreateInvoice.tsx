import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, CalendarIcon, Plus, Trash2, Save, Send, Printer,
  Copy, FileText, Wrench, Car, UserRound,
  Package, ClipboardList, StickyNote, Receipt, DollarSign,
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
import { mockServices, type ServiceItem } from "@/data/servicesData";

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
  serviceId: string | null;
  description: string;
  hours: number;
  hourlyRate: number;
}

let lineCounter = 0;
const nextId = () => `line-${++lineCounter}`;

// ── Section Header ────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, accent }: { icon: React.ElementType; title: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
        accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  );
}

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
  const [discountMode, setDiscountMode] = useState<"value" | "percent">("value");

  // Pickers
  const [partSearchOpen, setPartSearchOpen] = useState(false);
  const [partSearch, setPartSearch] = useState("");
  const [serviceSearchOpen, setServiceSearchOpen] = useState(false);
  const [serviceSearch, setServiceSearch] = useState("");

  // ── Derived totals ────────────────────────────────────────────────────

  const partsTotal = useMemo(
    () => parts.reduce((s, p) => s + p.quantity * p.unitPrice, 0),
    [parts],
  );

  const labourTotal = useMemo(
    () => labour.reduce((s, l) => s + l.hours * l.hourlyRate, 0),
    [labour],
  );

  const subtotal = partsTotal + labourTotal;
  const discountRaw = Number(discount) || 0;
  const discountValue = discountMode === "percent" ? subtotal * (discountRaw / 100) : discountRaw;
  const grandTotal = subtotal - discountValue;

  // ── Handlers ──────────────────────────────────────────────────────────

  const addPart = (part: Part) => {
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

  const addLabourFromService = (svc: ServiceItem) => {
    setLabour((prev) => [
      ...prev,
      {
        id: nextId(),
        serviceId: svc.id,
        description: svc.name,
        hours: svc.flatPrice != null ? 1 : 1,
        hourlyRate: svc.hourlyRate ?? svc.flatPrice ?? 0,
      },
    ]);
    setServiceSearchOpen(false);
    setServiceSearch("");
  };

  const addLabourManual = () =>
    setLabour((prev) => [
      ...prev,
      { id: nextId(), serviceId: null, description: "", hours: 1, hourlyRate: 0 },
    ]);

  const updateLabourField = (
    id: string,
    field: keyof Omit<LabourLine, "id" | "serviceId">,
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

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-8">
      {/* ── Action Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => navigate("/workshop/invoices")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">New Invoice</h1>
            <p className="text-xs text-muted-foreground">Create a new service invoice</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDuplicate}>
            <Copy className="w-3.5 h-3.5" /> Duplicate
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
          <Button size="sm" className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleIssue}>
            <FileText className="w-3.5 h-3.5" /> Issue Invoice
          </Button>
        </div>
      </div>

      {/* ── Two‑column grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ═══ Left column ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Invoice Header */}
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={Receipt} title="Invoice Details" accent />
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5">
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
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={UserRound} title="Customer" />
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
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

            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={Car} title="Vehicle" />
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
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
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 flex flex-row items-center justify-between bg-secondary/20">
              <SectionHeader icon={Package} title="Parts" />
              <Popover open={partSearchOpen} onOpenChange={setPartSearchOpen}>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Part
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="end">
                  <Command>
                    <CommandInput
                      placeholder="Search inventory..."
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
                <div className="px-6 pb-6 text-sm text-muted-foreground text-center py-10 flex flex-col items-center gap-2">
                  <Package className="w-8 h-8 text-muted-foreground/30" />
                  <span>No parts added yet. Click <strong>"Add Part"</strong> to begin.</span>
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
                        <TableRow key={line.id} className="hover:bg-secondary/10">
                          <TableCell className="text-sm font-medium">{line.name}</TableCell>
                          <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">{line.sku}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                line.stock <= 5
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-success/10 text-[hsl(var(--success))] border-[hsl(var(--success)/0.2)]",
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
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 flex flex-row items-center justify-between bg-secondary/20">
              <SectionHeader icon={Wrench} title="Labour" />
              <div className="flex items-center gap-2">
                <Popover open={serviceSearchOpen} onOpenChange={setServiceSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5" /> From Services
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <Command>
                      <CommandInput
                        placeholder="Search services..."
                        value={serviceSearch}
                        onValueChange={setServiceSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No services found.</CommandEmpty>
                        <CommandGroup>
                          {mockServices.map((svc) => (
                            <CommandItem
                              key={svc.id}
                              value={svc.name}
                              onSelect={() => addLabourFromService(svc)}
                              className="flex items-center justify-between"
                            >
                              <div className="flex flex-col">
                                <span className="text-sm">{svc.name}</span>
                                <span className="text-xs text-muted-foreground">{svc.description}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px] ml-2 shrink-0">
                                {svc.flatPrice != null ? `$${svc.flatPrice}` : `$${svc.hourlyRate}/hr`}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={addLabourManual}>
                  <Plus className="w-3.5 h-3.5" /> Custom
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {labour.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-muted-foreground text-center py-10 flex flex-col items-center gap-2">
                  <Wrench className="w-8 h-8 text-muted-foreground/30" />
                  <span>No labour items yet. Add from <strong>Services</strong> or create a <strong>Custom</strong> entry.</span>
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
                        <TableRow key={line.id} className="hover:bg-secondary/10">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {line.serviceId && (
                                <Badge variant="secondary" className="text-[10px] shrink-0">Service</Badge>
                              )}
                              <Input
                                className="h-8"
                                placeholder="e.g. Oil change labour"
                                value={line.description}
                                onChange={(e) =>
                                  updateLabourField(line.id, "description", e.target.value)
                                }
                              />
                            </div>
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
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-4 bg-secondary/20">
              <SectionHeader icon={StickyNote} title="Notes" />
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
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
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="pb-3 bg-accent/5">
              <SectionHeader icon={DollarSign} title="Invoice Summary" accent />
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
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
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm gap-3">
                  <span className="text-muted-foreground">Discount</span>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      className="h-8 w-24 text-right"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                    <div className="flex h-8 rounded-md border border-input overflow-hidden shrink-0">
                      <button
                        className={cn(
                          "px-2 text-xs font-medium transition-colors",
                          discountMode === "value" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setDiscountMode("value")}
                      >
                        $
                      </button>
                      <button
                        className={cn(
                          "px-2 text-xs font-medium transition-colors border-l border-input",
                          discountMode === "percent" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setDiscountMode("percent")}
                      >
                        %
                      </button>
                    </div>
                  </div>
                </div>
                {discountMode === "percent" && discountRaw > 0 && (
                  <p className="text-xs text-muted-foreground text-right">−${discountValue.toFixed(2)}</p>
                )}
              </div>
              <Separator />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-medium text-muted-foreground">Grand Total</span>
                <span className="text-3xl font-bold text-foreground tracking-tight">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-4 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Parts items</span>
                <Badge variant="secondary" className="text-[10px] h-5">{parts.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Labour items</span>
                <Badge variant="secondary" className="text-[10px] h-5">{labour.length}</Badge>
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
              {plateNumber && (
                <div className="flex justify-between">
                  <span>Plate</span>
                  <span className="font-mono font-medium text-foreground">{plateNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
