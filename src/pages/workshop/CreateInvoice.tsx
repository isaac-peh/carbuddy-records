import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft, CalendarIcon, Plus, Trash2, Save, Send, Printer,
  Copy, FileText, Wrench, Car, UserRound,
  Package, ClipboardList, StickyNote, Receipt, DollarSign, RefreshCw,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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
import VehicleLookup, { type ResolvedVehicle } from "@/components/workshop/VehicleLookup";

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
  pricingMode: "hourly" | "flat";
  hours: number;
  rate: number;
}

let lineCounter = 0;
const nextId = () => `line-${++lineCounter}`;

let dailyInvoiceCounter = 0;

function generateInvoiceNumber(): string {
  dailyInvoiceCounter++;
  const today = format(new Date(), "yyyyMMdd");
  return `INV-${today}-${String(dailyInvoiceCounter).padStart(3, "0")}`;
}

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
  const [suggestedInvoiceNumber] = useState(() => generateInvoiceNumber());
  const [invoiceNumber, setInvoiceNumber] = useState(suggestedInvoiceNumber);

  const resetInvoiceNumber = useCallback(() => {
    setInvoiceNumber(suggestedInvoiceNumber);
  }, [suggestedInvoiceNumber]);
  const [serviceDate, setServiceDate] = useState<Date | undefined>(new Date());
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  const toggleServiceType = useCallback((type: string) => {
    setServiceTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);
  const [technician, setTechnician] = useState("");

  // Customer
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Vehicle (resolved from lookup widget)
  const [resolvedVehicle, setResolvedVehicle] = useState<ResolvedVehicle | null>(null);
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
    () => labour.reduce((s, l) => l.pricingMode === "flat" ? s + l.rate : s + l.hours * l.rate, 0),
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
    const isFlat = svc.flatPrice != null;
    setLabour((prev) => [
      ...prev,
      {
        id: nextId(),
        serviceId: svc.id,
        description: svc.name,
        pricingMode: isFlat ? "flat" : "hourly",
        hours: 1,
        rate: isFlat ? (svc.flatPrice ?? 0) : (svc.hourlyRate ?? 0),
      },
    ]);
    setServiceSearchOpen(false);
    setServiceSearch("");
  };

  const addLabourManual = () =>
    setLabour((prev) => [
      ...prev,
      { id: nextId(), serviceId: null, description: "", pricingMode: "hourly" as const, hours: 1, rate: 0 },
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
          <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm" onClick={handleDuplicate}>
            <Copy className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Separator orientation="vertical" className="h-8 hidden sm:block" />
          <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm" onClick={handleSaveDraft}>
            <Save className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Save Draft</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm" onClick={handleSend}>
            <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Send</span>
          </Button>
          <Button size="sm" className="gap-1.5 text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleIssue}>
            <FileText className="w-3.5 h-3.5" /> Issue
          </Button>
        </div>
      </div>

      {/* ── Two‑column grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* ═══ Left column ═══════════════════════════════════════════ */}
        <div className="space-y-6">
          {/* Invoice Details + Vehicle Lookup side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Header */}
            <Card className="shadow-soft border-border/50 overflow-hidden">
              <CardHeader className="py-4 bg-secondary/20">
                <SectionHeader icon={FileText} title="Invoice Details" />
              </CardHeader>
              <CardContent className="space-y-3 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Invoice Number</Label>
                    <div className="relative">
                      <Input
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="INV-0001"
                        className="pr-8"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              onClick={resetInvoiceNumber}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            Reset to generated invoice number
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60">Auto-generated. Edit to use your own reference.</p>
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
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Service Type</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal text-left h-10 group">
                        {serviceTypes.length === 0 ? (
                          <span className="text-muted-foreground group-hover:text-primary-foreground">Select types</span>
                        ) : (
                          <span className="truncate">{serviceTypes.length} type{serviceTypes.length !== 1 ? "s" : ""} selected</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-2" align="start">
                      <div className="space-y-1 max-h-[240px] overflow-y-auto">
                        {SERVICE_TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleServiceType(t)}
                            className={cn(
                              "flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors text-left",
                              serviceTypes.includes(t)
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-secondary"
                            )}
                          >
                            <div className={cn(
                              "w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0",
                              serviceTypes.includes(t)
                                ? "bg-primary border-primary"
                                : "border-input"
                            )}>
                              {serviceTypes.includes(t) && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4.5 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" /></svg>
                              )}
                            </div>
                            {t}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {serviceTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {serviceTypes.map(t => (
                        <Badge
                          key={t}
                          variant="secondary"
                          className="text-[11px] gap-1 pr-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => toggleServiceType(t)}
                        >
                          {t}
                          <span className="text-[10px] ml-0.5">×</span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Technician</Label>
                  <Input
                    placeholder="Technician name"
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Odometer at Service (km)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    placeholder="Current reading"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Lookup */}
            <VehicleLookup
              onVehicleResolved={setResolvedVehicle}
              onVehicleCleared={() => setResolvedVehicle(null)}
            />
          </div>

          {/* Customer */}
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
                <PopoverContent className="w-[min(420px,calc(100vw-2rem))] p-0" align="end">
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
                            className="flex items-center justify-between gap-3 data-[selected=true]:text-accent-foreground"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{p.name}</p>
                              <p className="text-xs opacity-60 font-mono">{p.sku}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-medium">${p.sellPrice.toFixed(2)}</span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px]",
                                  p.stock <= 5
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : ""
                                )}
                              >
                                {p.stock}
                              </Badge>
                            </div>
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
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="bg-secondary/30">
                        <TableHead className="text-xs font-medium">Part</TableHead>
                        <TableHead className="text-xs font-medium">SKU</TableHead>
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
                          <TableCell className="text-xs text-muted-foreground font-mono">{line.sku}</TableCell>
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
                              className="h-8 w-20 text-center mx-auto"
                              value={line.quantity}
                              onChange={(e) => {
                                const qty = Math.max(1, Number(e.target.value));
                                if (qty > line.stock) {
                                  toast.warning(`Only ${line.stock} units of "${line.name}" in stock`);
                                }
                                updatePartField(line.id, "quantity", qty);
                              }}
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
                              className="h-7 w-7 text-muted-foreground hover:!text-destructive hover:bg-destructive/10"
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
            <CardHeader className="py-4 flex flex-row items-center justify-between bg-secondary/20 gap-2">
              <SectionHeader icon={Wrench} title="Labour" />
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Popover open={serviceSearchOpen} onOpenChange={setServiceSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="gap-1 sm:gap-1.5 text-xs sm:text-sm px-2 sm:px-3">
                      <ClipboardList className="w-3.5 h-3.5" /> <span className="hidden sm:inline">From </span>Services
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[min(420px,calc(100vw-2rem))] p-0" align="end">
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
                              className="flex items-center justify-between gap-3 data-[selected=true]:text-accent-foreground"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{svc.name}</p>
                                <p className="text-xs opacity-60 truncate">{svc.description}</p>
                              </div>
                              <Badge variant="outline" className="text-[10px] shrink-0">
                                {svc.flatPrice != null ? `$${svc.flatPrice.toFixed(2)}` : `$${svc.hourlyRate?.toFixed(2)}/hr`}
                              </Badge>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Button size="sm" variant="outline" className="gap-1 sm:gap-1.5 text-xs sm:text-sm px-2 sm:px-3" onClick={addLabourManual}>
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
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="bg-secondary/30">
                        <TableHead className="text-xs font-medium">Description</TableHead>
                        <TableHead className="text-xs font-medium text-center w-24">Type</TableHead>
                        <TableHead className="text-xs font-medium text-center w-24">Hours</TableHead>
                        <TableHead className="text-xs font-medium text-right w-28">Rate</TableHead>
                        <TableHead className="text-xs font-medium text-right w-24">Total</TableHead>
                        <TableHead className="w-10" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {labour.map((line) => {
                        const lineTotal = line.pricingMode === "flat" ? line.rate : line.hours * line.rate;
                        return (
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
                            <TableCell className="text-center">
                              <div className="flex h-8 rounded-md border border-input overflow-hidden mx-auto w-fit">
                                <button
                                  className={cn(
                                    "w-14 text-[10px] font-medium transition-colors",
                                    line.pricingMode === "hourly" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                  )}
                                  onClick={() => updateLabourField(line.id, "pricingMode", "hourly")}
                                >
                                  Hourly
                                </button>
                                <button
                                  className={cn(
                                    "w-14 text-[10px] font-medium transition-colors border-l border-input",
                                    line.pricingMode === "flat" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                  )}
                                  onClick={() => updateLabourField(line.id, "pricingMode", "flat")}
                                >
                                  Flat
                                </button>
                              </div>
                            </TableCell>
                            <TableCell>
                              {line.pricingMode === "hourly" ? (
                                <Input
                                  type="number"
                                  min={0.25}
                                  step={0.25}
                                  className="h-8 w-20 text-center mx-auto"
                                  value={line.hours}
                                  onChange={(e) =>
                                    updateLabourField(line.id, "hours", Number(e.target.value))
                                  }
                                />
                              ) : (
                                <span className="block text-center text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={0}
                                step={0.5}
                                className="h-8 w-24 text-right ml-auto"
                                value={line.rate}
                                onChange={(e) =>
                                  updateLabourField(line.id, "rate", Number(e.target.value))
                                }
                              />
                            </TableCell>
                            <TableCell className="text-right text-sm font-semibold">
                              ${lineTotal.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:!text-destructive hover:bg-destructive/10"
                                onClick={() => removeLabour(line.id)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
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
        <div className="lg:sticky lg:top-[calc(3.5rem+1.5rem)] space-y-6">
          <Card className="shadow-soft border-border/50 overflow-hidden">
            <CardHeader className="py-3 bg-accent/5">
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
                          "w-9 text-xs font-semibold transition-colors",
                          discountMode === "value" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => setDiscountMode("value")}
                      >
                        $
                      </button>
                      <button
                        className={cn(
                          "w-9 text-xs font-semibold transition-colors border-l border-input",
                          discountMode === "percent" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
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
              {serviceTypes.length > 0 && (
                <div className="flex justify-between items-start gap-2">
                  <span className="shrink-0">Service type</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {serviceTypes.map(t => (
                      <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {resolvedVehicle?.vehicleType && (
                <div className="flex justify-between">
                  <span>Vehicle type</span>
                  <Badge variant="outline" className="text-[10px]">{resolvedVehicle.vehicleType}</Badge>
                </div>
              )}
              {resolvedVehicle?.plateNumber && (
                <div className="flex justify-between">
                  <span>Plate</span>
                  <span className="font-mono font-medium text-foreground">{resolvedVehicle.plateNumber}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
