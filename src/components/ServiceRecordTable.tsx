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
}

const serviceRecords: ServiceRecord[] = [
  {
    id: 1, workshopName: "Tesla Service Center", workshopLogo: "T", workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia", date: "03 March 2026", mileage: 106569,
    serviceType: "Scheduled Maintenance", partsChanged: ["Cabin Air Filter", "Wiper Blades", "Brake Fluid"],
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
    serviceType: "Charging System Service", partsChanged: ["Mobile Connector Cable"],
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
              className={`rounded-xl transition-all duration-200 ${
                isExpanded ? "bg-background shadow-elevated" : "bg-background hover:shadow-soft"
              }`}
            >
              {/* Main Row */}
              <div
                className={`flex items-center gap-4 p-4 cursor-pointer rounded-xl transition-colors ${
                  isExpanded ? "" : "hover:bg-secondary/30"
                }`}
                onClick={() => toggleExpand(record.id)}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${record.workshopColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-soft`}
                >
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
                <div className="hidden md:block flex-1 min-w-0">
                  <div className="flex flex-wrap gap-1">
                    {record.partsChanged.slice(0, 2).map((part, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] border-border/50">
                        {part.length > 18 ? `${part.slice(0, 18)}...` : part}
                      </Badge>
                    ))}
                    {record.partsChanged.length > 2 && (
                      <Badge variant="secondary" className="text-[10px]">+{record.partsChanged.length - 2}</Badge>
                    )}
                  </div>
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
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 ml-15 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-5 rounded-xl bg-section-warm border border-border/30">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                        Parts Changed
                      </h4>
                      <ul className="space-y-1.5">
                        {record.partsChanged.map((part, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" strokeWidth={1.5} />
                            {part}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                        Work Performed
                      </h4>
                      <ul className="space-y-1.5">
                        {record.workDone.map((work, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" strokeWidth={1.5} />
                            {work}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                        Details
                      </h4>
                      <div className="space-y-2">
                        {[
                          { label: "Technician", value: record.technician },
                          { label: "Duration", value: record.duration, icon: Clock },
                          { label: "Invoice", value: record.invoiceNumber },
                          { label: "Cost", value: `RM ${record.cost.toLocaleString()}`, bold: true },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className={`text-foreground ${item.bold ? "font-bold" : "font-medium"}`}>
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-accent" strokeWidth={1.5} />
                        Notes
                      </h4>
                      <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg italic leading-relaxed">
                        "{record.notes}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Blurred locked records */}
        {filteredRecords.length > 5 && (
          <div className="relative">
            <div className="space-y-2 blur-sm pointer-events-none select-none">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-background/80 backdrop-blur-sm shadow-elevated border border-border/50">
                <Lock className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-foreground">
                  {filteredRecords.length - 5} more record{filteredRecords.length - 5 > 1 ? "s" : ""} available
                </p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
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
