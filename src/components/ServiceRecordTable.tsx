import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Calendar,
  Gauge,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  Wrench,
  Settings,
  Droplets,
  RotateCcw,
  Zap,
  CircleDot,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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
    id: 1,
    workshopName: "Tesla Service Center",
    workshopLogo: "T",
    workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia",
    date: "03 March 2026",
    mileage: 106569,
    serviceType: "Scheduled Maintenance",
    partsChanged: ["Cabin Air Filter", "Wiper Blades", "Brake Fluid"],
    workDone: ["Brake Fluid Flush", "Filter Replacement", "Software Update v11.2", "Wheel Alignment"],
    cost: 450,
    technician: "Ahmad Razak",
    duration: "3 hours",
    notes: "All systems functioning normally. Recommended tire rotation at next service.",
    invoiceNumber: "TSC-2026-0892",
  },
  {
    id: 2,
    workshopName: "EVolution Auto Care",
    workshopLogo: "E",
    workshopColor: "bg-emerald-600",
    location: "Petaling Jaya, Malaysia",
    date: "15 December 2025",
    mileage: 98234,
    serviceType: "Tire Service",
    partsChanged: ["Continental EcoContact 6 Tires (4x)"],
    workDone: ["Tire Replacement (All 4)", "Wheel Balancing", "TPMS Sensor Check"],
    cost: 2800,
    technician: "Lee Wei Ming",
    duration: "2 hours",
    notes: "Upgraded to premium all-season tires for better range and comfort.",
    invoiceNumber: "EVO-2025-4521",
  },
  {
    id: 3,
    workshopName: "Tesla Service Center",
    workshopLogo: "T",
    workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia",
    date: "20 August 2025",
    mileage: 85102,
    serviceType: "Annual Service",
    partsChanged: ["HEPA Air Filter", "12V Battery"],
    workDone: ["Full Inspection", "Battery Health Check", "Suspension Inspection", "Software Update v10.8"],
    cost: 680,
    technician: "Nurul Aisyah",
    duration: "4 hours",
    notes: "Battery at 96% health. All components in excellent condition.",
    invoiceNumber: "TSC-2025-0567",
  },
  {
    id: 4,
    workshopName: "QuickCharge Solutions",
    workshopLogo: "Q",
    workshopColor: "bg-blue-600",
    location: "Shah Alam, Malaysia",
    date: "10 May 2025",
    mileage: 72456,
    serviceType: "Charging System Service",
    partsChanged: ["Mobile Connector Cable"],
    workDone: ["Charge Port Inspection", "Connector Replacement", "Charging System Diagnostic"],
    cost: 350,
    technician: "Raj Kumar",
    duration: "1.5 hours",
    notes: "Replaced faulty mobile connector. Home charging tested and working perfectly.",
    invoiceNumber: "QCS-2025-0234",
  },
  {
    id: 5,
    workshopName: "AutoGlaze Detailing",
    workshopLogo: "A",
    workshopColor: "bg-purple-600",
    location: "Bangsar, Malaysia",
    date: "28 February 2025",
    mileage: 65890,
    serviceType: "Detailing & Protection",
    partsChanged: ["Ceramic Coating Application"],
    workDone: ["Full Paint Correction", "Ceramic Coating (5-Year)", "Interior Deep Clean", "Glass Treatment"],
    cost: 3500,
    technician: "Jason Lim",
    duration: "2 days",
    notes: "Premium ceramic coating applied. Warranty card provided for 5 years.",
    invoiceNumber: "AGD-2025-0089",
  },
  {
    id: 6,
    workshopName: "Tesla Service Center",
    workshopLogo: "T",
    workshopColor: "bg-red-600",
    location: "Kuala Lumpur, Malaysia",
    date: "05 November 2024",
    mileage: 52340,
    serviceType: "Brake Service",
    partsChanged: ["Front Brake Pads", "Brake Rotors (Front)"],
    workDone: ["Brake Pad Replacement", "Rotor Resurfacing", "Brake Fluid Top-up", "Caliper Inspection"],
    cost: 1200,
    technician: "Ahmad Razak",
    duration: "3 hours",
    notes: "Front brakes showing normal wear. Rear brakes still at 70% life.",
    invoiceNumber: "TSC-2024-0934",
  },
];

const getServiceIcon = (serviceType: string) => {
  switch (serviceType.toLowerCase()) {
    case "scheduled maintenance":
      return Wrench;
    case "tire service":
      return CircleDot;
    case "annual service":
      return Settings;
    case "charging system service":
      return Zap;
    case "detailing & protection":
      return Droplets;
    case "brake service":
      return RotateCcw;
    default:
      return Wrench;
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
      record.partsChanged.some((part) =>
        part.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      record.workDone.some((work) =>
        work.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter =
      filterType === "all" ||
      record.serviceType.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <Card className="bg-card border-border shadow-card">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            Service Records
            <Badge variant="secondary" className="ml-2">
              {filteredRecords.length} records
            </Badge>
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search services, parts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-secondary border-border"
              />
            </div>

            {/* Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-secondary border-border">
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
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Workshop
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Service Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Parts Changed
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Work Done
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Mileage
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const ServiceIcon = getServiceIcon(record.serviceType);
                const isExpanded = expandedRow === record.id;

                return (
                  <>
                    <tr
                      key={record.id}
                      className={`border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer ${
                        isExpanded ? "bg-secondary/50" : ""
                      }`}
                      onClick={() => toggleExpand(record.id)}
                    >
                      {/* Workshop */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg ${record.workshopColor} flex items-center justify-center text-white font-bold text-sm`}
                          >
                            {record.workshopLogo}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {record.workshopName}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {record.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service Type */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
                            <ServiceIcon className="w-4 h-4 text-accent" />
                          </div>
                          <span className="text-sm text-foreground">
                            {record.serviceType}
                          </span>
                        </div>
                      </td>

                      {/* Parts Changed */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {record.partsChanged.slice(0, 2).map((part, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-secondary"
                            >
                              {part.length > 20 ? `${part.slice(0, 20)}...` : part}
                            </Badge>
                          ))}
                          {record.partsChanged.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{record.partsChanged.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>

                      {/* Work Done */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {record.workDone.slice(0, 2).map((work, i) => (
                            <span
                              key={i}
                              className="text-xs text-muted-foreground"
                            >
                              {work}
                              {i < Math.min(record.workDone.length - 1, 1) && ", "}
                            </span>
                          ))}
                          {record.workDone.length > 2 && (
                            <span className="text-xs text-accent">
                              +{record.workDone.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {record.date}
                          </span>
                        </div>
                      </td>

                      {/* Mileage */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {record.mileage.toLocaleString()} km
                          </span>
                        </div>
                      </td>

                      {/* Expand Button */}
                      <td className="py-4 px-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <tr key={`${record.id}-expanded`}>
                        <td colSpan={7} className="bg-secondary/30 border-b border-border">
                          <div className="p-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              {/* Parts Changed */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Settings className="w-4 h-4 text-accent" />
                                  Parts Changed
                                </h4>
                                <ul className="space-y-1">
                                  {record.partsChanged.map((part, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-muted-foreground flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-3 h-3 text-success" />
                                      {part}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Work Done */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <Wrench className="w-4 h-4 text-accent" />
                                  Work Performed
                                </h4>
                                <ul className="space-y-1">
                                  {record.workDone.map((work, i) => (
                                    <li
                                      key={i}
                                      className="text-sm text-muted-foreground flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-3 h-3 text-success" />
                                      {work}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Service Details */}
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-accent" />
                                  Service Details
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Technician:</span>
                                    <span className="text-foreground font-medium">
                                      {record.technician}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Duration:</span>
                                    <span className="text-foreground font-medium flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {record.duration}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Invoice:</span>
                                    <span className="text-accent font-medium">
                                      {record.invoiceNumber}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Cost:</span>
                                    <span className="text-foreground font-bold">
                                      RM {record.cost.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-accent" />
                                  Technician Notes
                                </h4>
                                <p className="text-sm text-muted-foreground bg-card p-3 rounded-lg border border-border">
                                  "{record.notes}"
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No service records found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceRecordTable;
