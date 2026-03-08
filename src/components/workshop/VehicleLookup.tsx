import { useState, useCallback } from "react";
import {
  Search, ShieldCheck, AlertTriangle, Building2, PlusCircle,
  RotateCcw, Loader2, Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────

const VEHICLE_TYPES = [
  "SEDAN", "SUV", "HATCHBACK", "MPV", "PICKUP", "VAN", "TRUCK",
  "MOTORCYCLE", "OTHER",
] as const;

type VehicleType = (typeof VEHICLE_TYPES)[number];

export interface VehicleRecord {
  plateNumber: string;
  vin?: string;
  make?: string;
  model?: string;
  vehicleType?: VehicleType;
  mileage?: number;
  status: "verified" | "enriched" | "partial";
}

export interface ResolvedVehicle {
  plateNumber: string;
  vin: string;
  make: string;
  model: string;
  vehicleType: string;
}

type LookupState =
  | "idle"
  | "loading"
  | "verified"
  | "verified-vin-mismatch"
  | "workshop"
  | "new";

// ── Mock lookup database ──────────────────────────────────────────────

const MOCK_VEHICLES: VehicleRecord[] = [
  {
    plateNumber: "SGA1234A",
    vin: "5YJ3E1EA8MF00001",
    make: "Tesla",
    model: "Model 3",
    vehicleType: "SEDAN",
    mileage: 42350,
    status: "verified",
  },
  {
    plateNumber: "SJK5678B",
    vin: "WBAPH5C55BA123456",
    make: "BMW",
    model: "320i",
    vehicleType: "SEDAN",
    mileage: 67200,
    status: "verified",
  },
  {
    plateNumber: "SGX9012C",
    vin: "",
    make: "Toyota",
    model: "",
    vehicleType: "SUV",
    mileage: 31000,
    status: "partial",
  },
  {
    plateNumber: "SBA3456D",
    vin: "JN1TBNT30Z0000001",
    make: "Nissan",
    model: "X-Trail",
    vehicleType: "SUV",
    mileage: 55800,
    status: "enriched",
  },
];

function normalize(plate: string) {
  return plate.replace(/[\s-]/g, "").toUpperCase();
}

// ── Section header (matches invoice style) ────────────────────────────

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-secondary text-muted-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────

interface VehicleLookupProps {
  onVehicleResolved: (vehicle: ResolvedVehicle) => void;
  onVehicleCleared: () => void;
}

export default function VehicleLookup({ onVehicleResolved, onVehicleCleared }: VehicleLookupProps) {
  const [state, setState] = useState<LookupState>("idle");
  const [searchPlate, setSearchPlate] = useState("");
  const [searchVin, setSearchVin] = useState("");
  const [matchedRecord, setMatchedRecord] = useState<VehicleRecord | null>(null);

  // Editable fields for workshop / new states
  const [editVin, setEditVin] = useState("");
  const [editMake, setEditMake] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editVehicleType, setEditVehicleType] = useState("");

  const reset = useCallback(() => {
    setState("idle");
    setSearchPlate("");
    setSearchVin("");
    setMatchedRecord(null);
    setEditVin("");
    setEditMake("");
    setEditModel("");
    setEditVehicleType("");
    onVehicleCleared();
  }, [onVehicleCleared]);

  const performLookup = useCallback(() => {
    if (!searchPlate.trim()) return;
    setState("loading");

    // Simulate async lookup
    setTimeout(() => {
      const normalizedPlate = normalize(searchPlate);
      const found = MOCK_VEHICLES.find((v) => normalize(v.plateNumber) === normalizedPlate);

      if (found && found.status === "verified") {
        setMatchedRecord(found);
        // Check VIN mismatch
        if (searchVin.trim() && normalize(searchVin) !== normalize(found.vin || "")) {
          setState("verified-vin-mismatch");
        } else {
          setState("verified");
          onVehicleResolved({
            plateNumber: found.plateNumber,
            vin: found.vin || "",
            make: found.make || "",
            model: found.model || "",
            vehicleType: found.vehicleType || "",
          });
        }
      } else if (found && (found.status === "partial" || found.status === "enriched")) {
        setMatchedRecord(found);
        setEditVin(found.vin || "");
        setEditMake(found.make || "");
        setEditModel(found.model || "");
        setEditVehicleType(found.vehicleType || "");
        setState("workshop");
        onVehicleResolved({
          plateNumber: found.plateNumber,
          vin: found.vin || "",
          make: found.make || "",
          model: found.model || "",
          vehicleType: found.vehicleType || "",
        });
      } else {
        setMatchedRecord(null);
        setEditVin(searchVin);
        setEditMake("");
        setEditModel("");
        setEditVehicleType("");
        setState("new");
        onVehicleResolved({
          plateNumber: searchPlate.trim().toUpperCase(),
          vin: searchVin,
          make: "",
          model: "",
          vehicleType: "",
        });
      }
    }, 800);
  }, [searchPlate, searchVin, onVehicleResolved]);

  const acceptVerified = useCallback(() => {
    if (!matchedRecord) return;
    setState("verified");
    onVehicleResolved({
      plateNumber: matchedRecord.plateNumber,
      vin: matchedRecord.vin || "",
      make: matchedRecord.make || "",
      model: matchedRecord.model || "",
      vehicleType: matchedRecord.vehicleType || "",
    });
  }, [matchedRecord, onVehicleResolved]);

  const createNewFromMismatch = useCallback(() => {
    setState("new");
    setMatchedRecord(null);
    setEditVin(searchVin);
    setEditMake("");
    setEditModel("");
    setEditVehicleType("");
    onVehicleResolved({
      plateNumber: searchPlate.trim().toUpperCase(),
      vin: searchVin,
      make: "",
      model: "",
      vehicleType: "",
    });
  }, [searchPlate, searchVin, onVehicleResolved]);

  // Sync editable fields up
  const syncEditable = useCallback((field: string, value: string) => {
    const plate = matchedRecord?.plateNumber || searchPlate.trim().toUpperCase();
    const newVin = field === "vin" ? value : editVin;
    const newMake = field === "make" ? value : editMake;
    const newModel = field === "model" ? value : editModel;
    const newType = field === "vehicleType" ? value : editVehicleType;

    if (field === "vin") setEditVin(value);
    if (field === "make") setEditMake(value);
    if (field === "model") setEditModel(value);
    if (field === "vehicleType") setEditVehicleType(value);

    onVehicleResolved({
      plateNumber: plate,
      vin: newVin,
      make: newMake,
      model: newModel,
      vehicleType: newType,
    });
  }, [matchedRecord, searchPlate, editVin, editMake, editModel, editVehicleType, onVehicleResolved]);

  // ── Status banner configs ────────────────────────────────────────────

  const statusConfig = {
    verified: {
      icon: ShieldCheck,
      label: "Verified Vehicle",
      desc: "Shared across Mobilis · Read-only",
      bannerClass: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]",
      accentClass: "border-[hsl(var(--success)/0.2)]",
    },
    "verified-vin-mismatch": {
      icon: AlertTriangle,
      label: "VIN Mismatch Detected",
      desc: "Plate matched but VIN differs from verified record",
      bannerClass: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))]",
      accentClass: "border-[hsl(var(--warning)/0.2)]",
    },
    workshop: {
      icon: Building2,
      label: "Workshop Record",
      desc: "From your workshop · Editable",
      bannerClass: "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]",
      accentClass: "border-[hsl(var(--accent)/0.2)]",
    },
    new: {
      icon: PlusCircle,
      label: "New Vehicle",
      desc: "Will be created on save",
      bannerClass: "bg-foreground text-background",
      accentClass: "border-border",
    },
  };

  // ── Render helpers ──────────────────────────────────────────────────

  const renderChangeLink = () => (
    <button
      onClick={reset}
      className="text-[11px] opacity-80 hover:opacity-100 flex items-center gap-1 transition-opacity"
    >
      <RotateCcw className="w-3 h-3" /> Change
    </button>
  );

  const renderStatusBanner = (key: keyof typeof statusConfig) => {
    const cfg = statusConfig[key];
    const Icon = cfg.icon;
    return (
      <div className={cn("px-4 py-2 flex items-center gap-2", cfg.bannerClass)}>
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">{cfg.label}</span>
        <span className="text-[11px] opacity-70">· {cfg.desc}</span>
      </div>
    );
  };

  const renderCardHeader = () => (
    <div className="px-4 py-3 border-b border-border bg-secondary/20 flex items-center justify-between">
      <SectionHeader icon={Car} title="Vehicle" />
      <button
        onClick={reset}
        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> Change
      </button>
    </div>
  );

  const renderReadOnlyField = (label: string, value: string) => (
    <div className="space-y-0.5">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );

  // ── IDLE state ──────────────────────────────────────────────────────

  if (state === "idle" || state === "loading") {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/30 flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Vehicle Lookup</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Plate Number</Label>
            <Input
              autoFocus
              placeholder="e.g. SGA1234A"
              className="text-base font-semibold h-11 tracking-wider uppercase font-mono"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performLookup()}
              disabled={state === "loading"}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">VIN <span className="opacity-50">(optional cross-reference)</span></Label>
            <Input
              placeholder="Enter VIN..."
              className="font-mono text-xs"
              value={searchVin}
              onChange={(e) => setSearchVin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performLookup()}
              disabled={state === "loading"}
            />
          </div>
          <Button
            className="w-full gap-2"
            onClick={performLookup}
            disabled={!searchPlate.trim() || state === "loading"}
          >
            {state === "loading" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {state === "loading" ? "Looking up..." : "Look Up"}
          </Button>
        </div>
      </div>
    );
  }

  // ── VERIFIED state ──────────────────────────────────────────────────

  if (state === "verified" && matchedRecord) {
    return (
      <div className={cn("rounded-xl border overflow-hidden bg-card", statusConfig.verified.accentClass)}>
        {renderCardHeader()}
        {renderStatusBanner("verified")}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-x-5 gap-y-3">
            {renderReadOnlyField("Plate", matchedRecord.plateNumber)}
            {renderReadOnlyField("Make", matchedRecord.make || "")}
            {renderReadOnlyField("Model", matchedRecord.model || "")}
            {renderReadOnlyField("VIN", matchedRecord.vin || "")}
            {renderReadOnlyField("Type", matchedRecord.vehicleType || "")}
            {renderReadOnlyField("Mileage", matchedRecord.mileage ? `${matchedRecord.mileage.toLocaleString()} km` : "—")}
          </div>
        </div>
      </div>
    );
  }

  // ── VIN MISMATCH state ──────────────────────────────────────────────

  if (state === "verified-vin-mismatch" && matchedRecord) {
    return (
      <div className={cn("rounded-xl border overflow-hidden bg-card", statusConfig["verified-vin-mismatch"].accentClass)}>
        {renderCardHeader()}
        {renderStatusBanner("verified-vin-mismatch")}
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={acceptVerified}>
              <ShieldCheck className="w-3.5 h-3.5" /> Use Verified Record
            </Button>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={createNewFromMismatch}>
              <PlusCircle className="w-3.5 h-3.5" /> Create New Vehicle
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-3 opacity-60">
            {renderReadOnlyField("Plate", matchedRecord.plateNumber)}
            {renderReadOnlyField("Make", matchedRecord.make || "")}
            {renderReadOnlyField("Model", matchedRecord.model || "")}
            {renderReadOnlyField("VIN (on record)", matchedRecord.vin || "")}
          </div>
        </div>
      </div>
    );
  }

  // ── WORKSHOP (partial/enriched) state ───────────────────────────────

  if (state === "workshop") {
    const plate = matchedRecord?.plateNumber || searchPlate.trim().toUpperCase();
    return (
      <div className={cn("rounded-xl border overflow-hidden bg-card", statusConfig.workshop.accentClass)}>
        {renderCardHeader()}
        {renderStatusBanner("workshop")}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {renderReadOnlyField("Plate", plate)}
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">VIN</Label>
              <Input className="h-9 font-mono text-xs" value={editVin} onChange={(e) => syncEditable("vin", e.target.value)} placeholder="Enter VIN..." />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Make</Label>
              <Input className="h-9" value={editMake} onChange={(e) => syncEditable("make", e.target.value)} placeholder="e.g. Toyota" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Model</Label>
              <Input className="h-9" value={editModel} onChange={(e) => syncEditable("model", e.target.value)} placeholder="e.g. Corolla" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Type <span className="text-destructive">*</span></Label>
              <Select value={editVehicleType} onValueChange={(v) => syncEditable("vehicleType", v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── NEW VEHICLE state ───────────────────────────────────────────────

  if (state === "new") {
    const plate = searchPlate.trim().toUpperCase();
    return (
      <div className={cn("rounded-xl border overflow-hidden bg-card", statusConfig.new.accentClass)}>
        {renderCardHeader()}
        {renderStatusBanner("new")}
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            {renderReadOnlyField("Plate", plate)}
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Type <span className="text-destructive">*</span></Label>
              <Select value={editVehicleType} onValueChange={(v) => syncEditable("vehicleType", v)}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">VIN</Label>
              <Input className="h-9 font-mono text-xs" value={editVin} onChange={(e) => syncEditable("vin", e.target.value)} placeholder="Optional" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Make</Label>
              <Input className="h-9" value={editMake} onChange={(e) => syncEditable("make", e.target.value)} placeholder="e.g. Toyota" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-muted-foreground">Model</Label>
              <Input className="h-9" value={editModel} onChange={(e) => syncEditable("model", e.target.value)} placeholder="e.g. Corolla" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
