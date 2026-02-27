import { useState } from "react";
import {
  Search, Filter, ChevronDown, ChevronUp, Calendar, Gauge, MapPin,
  FileText, Clock, CheckCircle, Wrench, Settings, Droplets, RotateCcw, Zap, CircleDot, Lock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import SectionTitle from "@/components/SectionTitle";
import {
  Tooltip, TooltipTrigger, TooltipContent,
} from "@/components/ui/tooltip";

interface ServiceRecord {
  id: number;
  workshopName: string;
  workshopLogo: string;
  workshopColor: string;
  location: string;
  date: string;
  mileage: number;
  serviceType: string;
  partsChanged: string[];
  workDone: string[];
  cost: number;
  technician: string;
  duration: string;
  notes: string;
  invoiceNumber: string;
  serviceTypes?: string[];
}

const serviceRecords: ServiceRecord[] = [
  {
    id: 1, workshopName: "Tesla Service Center", workshopLogo: "T", workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia", date: "03 March 2026", mileage: 106569,
    serviceType: "Scheduled Maintenance", serviceTypes: ["Scheduled Maintenance", "Brake Inspection", "Tire Rotation"],
    partsChanged: ["Cabin Air Filter", "Wiper Blades", "Brake Fluid"],
    workDone: ["Brake Fluid Flush", "Filter Replacement", "Software Update v11.2", "Wheel Alignment"],
    cost: 450, technician: "Ahmad Razak", duration: "3 hours",
    notes: "All systems functioning normally. Recommended tire rotation at next service.", invoiceNumber: "TSC-2026-0892",
  },
  {
    id: 2, workshopName: "EVolution Auto Care", workshopLogo: "E", workshopColor: "bg-emerald-600",
    location: "Petaling Jaya, Malaysia", date: "15 December 2025", mileage: 98234,
    serviceType: "Tire Service", partsChanged: ["Continental EcoContact 6 Tires (4x)"],
    workDone: ["Tire Replacement (All 4)", "Wheel Balancing", "TPMS Sensor Check"],
    cost: 2800, technician: "Lee Wei Ming", duration: "2 hours",
    notes: "Upgraded to premium all-season tires for better range and comfort.", invoiceNumber: "EVO-2025-4521",
  },
  {
    id: 3, workshopName: "Tesla Service Center", workshopLogo: "T", workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia", date: "20 August 2025", mileage: 85102,
    serviceType: "Annual Service", partsChanged: ["HEPA Air Filter", "12V Battery"],
    workDone: ["Full Inspection", "Battery Health Check", "Suspension Inspection", "Software Update v10.8"],
    cost: 680, technician: "Nurul Aisyah", duration: "4 hours",
    notes: "Battery at 96% health. All components in excellent condition.", invoiceNumber: "TSC-2025-0567",
  },
  {
    id: 4, workshopName: "QuickCharge Solutions", workshopLogo: "Q", workshopColor: "bg-blue-600",
    location: "Shah Alam, Malaysia", date: "10 May 2025", mileage: 72456,
    serviceType: "Charging System Service", serviceTypes: ["Charging System Service", "Battery Health Check", "Software Update"],
    partsChanged: ["Mobile Connector Cable", "Charge Port Adapter", "Wall Connector Mount"],
    workDone: ["Charge Port Inspection", "Connector Replacement", "Charging System Diagnostic"],
    cost: 350, technician: "Raj Kumar", duration: "1.5 hours",
    notes: "Replaced faulty mobile connector. Home charging tested and working perfectly.", invoiceNumber: "QCS-2025-0234",
  },
  {
    id: 5, workshopName: "AutoGlaze Detailing", workshopLogo: "A", workshopColor: "bg-purple-600",
    location: "Bangsar, Malaysia", date: "28 February 2025", mileage: 65890,
    serviceType: "Detailing & Protection", partsChanged: ["Ceramic Coating Application"],
    workDone: ["Full Paint Correction", "Ceramic Coating (5-Year)", "Interior Deep Clean", "Glass Treatment"],
    cost: 3500, technician: "Jason Lim", duration: "2 days",
    notes: "Premium ceramic coating applied. Warranty card provided for 5 years.", invoiceNumber: "AGD-2025-0089",
  },
  {
    id: 6, workshopName: "Tesla Service Center", workshopLogo: "T", workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia", date: "05 November 2024", mileage: 52340,
    serviceType: "Brake Service", partsChanged: ["Front Brake Pads", "Brake Rotors (Front)"],
    workDone: ["Brake Pad Replacement", "Rotor Resurfacing", "Brake Fluid Top-up", "Caliper Inspection"],
    cost: 1200, technician: "Ahmad Razak", duration: "3 hours",
    notes: "Front brakes showing normal wear. Rear brakes still at 70% life.", invoiceNumber: "TSC-2024-0934",
  },
];

const getServiceIcon = (serviceType: string) => {
  switch (serviceType.toLowerCase()) {
    case "scheduled maintenance": return Wrench;
    case "tire service": return CircleDot;
    case "annual service": return Settings;
    case "charging system service": return Zap;
    case "detailing & protection": return Droplets;
    case "brake service": return RotateCcw;
    default: return Wrench;
  }
};

const ServiceRecordTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredRecords = serviceRecords.filter((record) => {
    const matchesSearch =
      record.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.partsChanged.some((part) => part.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.workDone.some((work) => work.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === "all" || record.serviceType.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SectionTitle title="Service Records" subtitle={`${filteredRecords.length} records found`} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services, parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-background border-border/50 shadow-soft focus:shadow-elevated transition-shadow"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 bg-background border-border/50 shadow-soft">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="tire">Tire Service</SelectItem>
              <SelectItem value="brake">Brake Service</SelectItem>
              <SelectItem value="charging">Charging System</SelectItem>
              <SelectItem value="detailing">Detailing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Records List */}
      <div className="space-y-2 relative">
      {filteredRecords.slice(0, 5).map((record) => {
          const isExpanded = expandedRow === record.id;

          return (
            <div
              key={record.id}
              className={`rounded-xl overflow-hidden transition-all duration-200 bg-background ${
                isExpanded ? "shadow-elevated" : "hover:shadow-soft"
              }`}
            >
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/20 transition-colors rounded-xl"
                onClick={() => toggleExpand(record.id)}
              >
                <div className={`w-10 h-10 rounded-lg ${record.workshopColor} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white text-sm font-bold">{record.workshopLogo}</span>
                </div>
                <div className="min-w-0 flex-1 md:flex-none md:w-[35%]">
                  {record.serviceTypes && record.serviceTypes.length > 1 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm font-semibold text-foreground leading-tight cursor-default inline-flex items-center gap-1.5">
                          {record.serviceTypes[0]}
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            +{record.serviceTypes.length - 1} more
                          </span>
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <ul className="space-y-1 text-xs">
                          {record.serviceTypes.map((s, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" strokeWidth={2} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <p className="text-sm font-semibold text-foreground leading-tight">{record.serviceType}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                    {record.workshopName}
                  </p>
                </div>

                {/* Parts column */}
                <div className="hidden md:flex w-[20%] min-w-0 items-center flex-shrink-0">
                  {record.partsChanged.length <= 2 ? (
                    <p className="text-xs text-muted-foreground leading-relaxed truncate">
                      {record.partsChanged.join(", ")}
                    </p>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-xs text-muted-foreground leading-relaxed cursor-default inline-flex items-center gap-1.5 truncate">
                          <span className="truncate">{record.partsChanged[0]}</span>
                          <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground flex-shrink-0">
                            +{record.partsChanged.length - 1} more
                          </span>
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <ul className="space-y-1 text-xs">
                          {record.partsChanged.map((part, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 text-primary flex-shrink-0" strokeWidth={2} />
                              {part}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-muted-foreground flex-shrink-0 ml-auto">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {record.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {record.mileage.toLocaleString()} km
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 animate-fade-in">
                  <div className="rounded-xl border border-border/40 overflow-hidden">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 bg-secondary/40 border-b border-border/30">
                      {[
                        { icon: Clock, label: record.duration },
                        { icon: FileText, label: record.invoiceNumber },
                        { icon: Wrench, label: record.technician },
                      ].map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {item.label}
                        </span>
                      ))}
                      <span className="ml-auto text-sm font-bold text-foreground">RM {record.cost.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/30">
                      <div className="p-5 space-y-3">
                        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Parts Replaced</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {record.partsChanged.map((part, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal py-1 px-2.5 bg-secondary/60">{part}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Work Performed</h4>
                        <ul className="space-y-2">
                          {record.workDone.map((work, i) => (
                            <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                              <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0 mt-0.5" strokeWidth={2} />
                              {work}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-5 space-y-3">
                        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Notes</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{record.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Locked records */}
        {filteredRecords.length > 5 && (
          <div className="relative">
            <div className="space-y-2 blur-sm pointer-events-none select-none opacity-60">
              {filteredRecords.slice(5).map((record) => (
                <div key={record.id} className="rounded-xl bg-background">
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-11 h-11 rounded-xl ${record.workshopColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
                      {record.workshopLogo}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{record.workshopName}</p>
                        <Badge variant="secondary" className="text-[10px] font-medium">{record.serviceType}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" strokeWidth={1.5} />
                        {record.location}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="text-sm text-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                        {record.date}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Gauge className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {record.mileage.toLocaleString()} km
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient overlay with unlock button */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/90 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center px-4">
                <p className="text-sm font-semibold text-foreground">
                  {filteredRecords.length - 5} older service record{filteredRecords.length - 5 > 1 ? "s" : ""} hidden
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2 shadow-elevated mt-1">
                  <Lock className="w-4 h-4" />
                  Unlock Full History
                </Button>
              </div>
            </div>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-foreground font-medium">No service records found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRecordTable;
