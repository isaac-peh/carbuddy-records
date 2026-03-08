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

  // ── Render helpers ──────────────────────────────────────────────────

  const renderChangeLink = () => (
    <button
      onClick={reset}
      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
    >
      <RotateCcw className="w-3 h-3" /> Change
    </button>
  );

  const statusConfig: Record<string, { icon: React.ElementType; label: string; dotClass: string; iconClass: string }> = {
    verified: {
      icon: ShieldCheck,
      label: "Verified",
      dotClass: "bg-[hsl(var(--success))]",
      iconClass: "text-[hsl(var(--success))]",
    },
    "verified-vin-mismatch": {
      icon: AlertTriangle,
      label: "VIN Mismatch",
      dotClass: "bg-[hsl(var(--warning))]",
      iconClass: "text-[hsl(var(--warning))]",
    },
    workshop: {
      icon: Building2,
      label: "Workshop Record",
      dotClass: "bg-[hsl(var(--accent))]",
      iconClass: "text-[hsl(var(--accent))]",
    },
    new: {
      icon: PlusCircle,
      label: "New Vehicle",
      dotClass: "bg-muted-foreground",
      iconClass: "text-muted-foreground",
    },
  };

  const renderStatusLine = (key: string) => {
    const cfg = statusConfig[key];
    if (!cfg) return null;
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dotClass)} />
        <span className="font-medium">{cfg.label}</span>
      </div>
    );
  };

  const renderReadOnlyField = (label: string, value: string) => (
    <div className="space-y-1">
      <Label className="text-[11px] text-muted-foreground font-normal">{label}</Label>
      <p className="text-sm font-medium truncate">{value || "—"}</p>
    </div>
  );

  // ── IDLE state ──────────────────────────────────────────────────────

  if (state === "idle" || state === "loading") {
    return (
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="py-4 bg-secondary/20">
          <SectionHeader icon={Car} title="Vehicle Lookup" />
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Vehicle Plate Number</Label>
            <Input
              autoFocus
              placeholder="Enter plate number to begin..."
              className="text-base font-medium h-12 tracking-wide uppercase"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && performLookup()}
              disabled={state === "loading"}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">VIN (optional)</Label>
            <Input
              placeholder="Enter VIN for cross-reference..."
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
            {state === "loading" ? "Looking up..." : "Look Up Vehicle"}
          </Button>

          {/* Grayed-out placeholder for locked fields */}
          <div className="grid grid-cols-2 gap-3 opacity-30 pointer-events-none select-none">
            {["Make", "Model", "Type", "Mileage"].map((f) => (
              <div key={f} className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{f}</Label>
                <div className="h-10 rounded-md bg-secondary/50 border border-border/30" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── VERIFIED state ──────────────────────────────────────────────────

  if (state === "verified" && matchedRecord) {
    return (
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="py-4 bg-[hsl(var(--success)/0.05)]">
          <div className="flex items-center justify-between">
            <SectionHeader icon={ShieldCheck} title="Vehicle" />
            {renderChangeLink()}
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {renderStateBadge("verified")}
          <div className="grid grid-cols-2 gap-3">
            {renderReadOnlyField("Plate Number", matchedRecord.plateNumber)}
            {renderReadOnlyField("VIN", matchedRecord.vin || "")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderReadOnlyField("Make", matchedRecord.make || "")}
            {renderReadOnlyField("Model", matchedRecord.model || "")}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vehicle Type</Label>
              <Badge variant="outline" className="text-xs py-1 px-2.5">
                {matchedRecord.vehicleType || "—"}
              </Badge>
            </div>
            {renderReadOnlyField("Current Mileage (km)", matchedRecord.mileage?.toLocaleString() || "—")}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── VIN MISMATCH state ──────────────────────────────────────────────

  if (state === "verified-vin-mismatch" && matchedRecord) {
    return (
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="py-4 bg-[hsl(var(--warning)/0.05)]">
          <div className="flex items-center justify-between">
            <SectionHeader icon={AlertTriangle} title="Vehicle" />
            {renderChangeLink()}
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {renderStateBadge("verified-vin-mismatch")}

          {/* Warning banner */}
          <div className="rounded-lg border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.06)] p-3 space-y-3">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-[hsl(var(--warning))] shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                The VIN you entered does not match the verified record for this plate number.
                This may indicate a plate transfer or data error.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={acceptVerified}>
                <ShieldCheck className="w-3.5 h-3.5" /> Use Verified Vehicle
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={createNewFromMismatch}>
                <PlusCircle className="w-3.5 h-3.5" /> Create New Vehicle Record
              </Button>
            </div>
          </div>

          {/* Show verified record for reference */}
          <div className="grid grid-cols-2 gap-3 opacity-70">
            {renderReadOnlyField("Plate Number", matchedRecord.plateNumber)}
            {renderReadOnlyField("VIN (on record)", matchedRecord.vin || "")}
          </div>
          <div className="grid grid-cols-2 gap-3 opacity-70">
            {renderReadOnlyField("Make", matchedRecord.make || "")}
            {renderReadOnlyField("Model", matchedRecord.model || "")}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── WORKSHOP (partial/enriched) state ───────────────────────────────

  if (state === "workshop") {
    const plate = matchedRecord?.plateNumber || searchPlate.trim().toUpperCase();
    return (
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="py-4 bg-primary/5">
          <div className="flex items-center justify-between">
            <SectionHeader icon={Building2} title="Vehicle" />
            {renderChangeLink()}
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {renderStateBadge("workshop")}

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
            <p className="text-xs text-muted-foreground">
              Adding VIN, make, or model helps build a stronger vehicle record.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {renderReadOnlyField("Plate Number", plate)}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">VIN</Label>
              <Input
                value={editVin}
                onChange={(e) => syncEditable("vin", e.target.value)}
                placeholder="Enter VIN..."
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Make</Label>
              <Input
                value={editMake}
                onChange={(e) => syncEditable("make", e.target.value)}
                placeholder="e.g. Toyota"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Model</Label>
              <Input
                value={editModel}
                onChange={(e) => syncEditable("model", e.target.value)}
                placeholder="e.g. Corolla"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vehicle Type <span className="text-destructive">*</span></Label>
              <Select value={editVehicleType} onValueChange={(v) => syncEditable("vehicleType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {renderReadOnlyField("Current Mileage (km)", matchedRecord?.mileage?.toLocaleString() || "—")}
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── NEW VEHICLE state ───────────────────────────────────────────────

  if (state === "new") {
    const plate = searchPlate.trim().toUpperCase();
    return (
      <Card className="shadow-soft border-border/50 overflow-hidden">
        <CardHeader className="py-4 bg-secondary/20">
          <div className="flex items-center justify-between">
            <SectionHeader icon={PlusCircle} title="Vehicle" />
            {renderChangeLink()}
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          {renderStateBadge("new")}

          <div className="grid grid-cols-2 gap-3">
            {renderReadOnlyField("Plate Number", plate)}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vehicle Type <span className="text-destructive">*</span></Label>
              <Select value={editVehicleType} onValueChange={(v) => syncEditable("vehicleType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">VIN (optional)</Label>
            <Input
              value={editVin}
              onChange={(e) => syncEditable("vin", e.target.value)}
              placeholder="Providing a VIN creates an enriched record"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Make</Label>
              <Input
                value={editMake}
                onChange={(e) => syncEditable("make", e.target.value)}
                placeholder="e.g. Toyota"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Model</Label>
              <Input
                value={editModel}
                onChange={(e) => syncEditable("model", e.target.value)}
                placeholder="e.g. Corolla"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border/50 bg-secondary/30 p-2.5">
            <p className="text-xs text-muted-foreground">
              A new vehicle record will be created when this invoice is saved.
              Providing VIN, make, and model improves record quality.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
