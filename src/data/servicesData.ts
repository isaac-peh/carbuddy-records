export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  flatPrice: number | null;
  hourlyRate: number | null;
}

export const mockServices: ServiceItem[] = [
  { id: "1", name: "Engine Oil Change (Labor)", description: "Drain & replace engine oil, reset service indicator", flatPrice: 40, hourlyRate: null },
  { id: "2", name: "Tyre Change", description: "Remove & mount tyre, balance wheel", flatPrice: 25, hourlyRate: null },
  { id: "3", name: "Brake Pad Replacement (Labor)", description: "Remove caliper, swap pads, bleed if needed", flatPrice: 60, hourlyRate: null },
  { id: "4", name: "Diagnostic Scan", description: "Full OBD-II scan & fault code report", flatPrice: 35, hourlyRate: null },
  { id: "5", name: "A/C Regas", description: "Evacuate, vacuum & recharge A/C system", flatPrice: 80, hourlyRate: null },
  { id: "6", name: "Wheel Alignment", description: "4-wheel alignment with printout", flatPrice: 50, hourlyRate: null },
  { id: "7", name: "Battery Replacement (Labor)", description: "Remove old battery, install & test new unit", flatPrice: 20, hourlyRate: null },
  { id: "8", name: "Spark Plug Replacement (Labor)", description: "Remove & replace spark plugs, gap check", flatPrice: null, hourlyRate: 45 },
];
