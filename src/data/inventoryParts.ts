export interface Part {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  costPrice: number;
  sellPrice: number;
  supplier: string;
  uom: string;
  description: string;
}

export const mockParts: Part[] = [
  { id: "1", name: "Brake Pads (Front)", sku: "BP-FRT-001", category: "Brakes", stock: 2, minStock: 10, costPrice: 35, sellPrice: 65, supplier: "AutoParts SG", uom: "set", description: "Front brake pad set for passenger vehicles." },
  { id: "2", name: "Engine Oil 5W-30 (5L)", sku: "OIL-5W30-5L", category: "Lubricants", stock: 3, minStock: 8, costPrice: 28, sellPrice: 55, supplier: "Shell SG", uom: "bottle", description: "Fully synthetic 5W-30 engine oil." },
  { id: "3", name: "Oil Filter (Universal)", sku: "FLT-OIL-UNI", category: "Filters", stock: 4, minStock: 15, costPrice: 5, sellPrice: 15, supplier: "AutoParts SG", uom: "pc", description: "Universal spin-on oil filter." },
  { id: "4", name: "Spark Plug (Iridium)", sku: "SP-IRD-001", category: "Ignition", stock: 24, minStock: 10, costPrice: 12, sellPrice: 28, supplier: "NGK Dist.", uom: "pc", description: "Iridium-tipped spark plug." },
  { id: "5", name: "Air Filter", sku: "FLT-AIR-001", category: "Filters", stock: 18, minStock: 10, costPrice: 8, sellPrice: 22, supplier: "AutoParts SG", uom: "pc", description: "Panel-type air filter element." },
  { id: "6", name: "Brake Disc (Front)", sku: "BD-FRT-001", category: "Brakes", stock: 6, minStock: 4, costPrice: 65, sellPrice: 120, supplier: "Brembo SG", uom: "pc", description: "Ventilated front brake disc rotor." },
  { id: "7", name: "Coolant (1L)", sku: "CLT-001", category: "Lubricants", stock: 12, minStock: 6, costPrice: 8, sellPrice: 18, supplier: "Shell SG", uom: "bottle", description: "Pre-mixed long-life coolant." },
  { id: "8", name: "Wiper Blade (Pair)", sku: "WB-UNI-001", category: "Accessories", stock: 30, minStock: 10, costPrice: 10, sellPrice: 25, supplier: "Bosch SG", uom: "pair", description: "Flat-blade frameless wiper set." },
  { id: "9", name: "Battery (12V 60Ah)", sku: "BAT-12V-60", category: "Electrical", stock: 5, minStock: 3, costPrice: 85, sellPrice: 160, supplier: "Amaron SG", uom: "pc", description: "Maintenance-free calcium battery." },
  { id: "10", name: "Transmission Fluid (1L)", sku: "TF-ATF-001", category: "Lubricants", stock: 7, minStock: 5, costPrice: 15, sellPrice: 32, supplier: "Shell SG", uom: "bottle", description: "Multi-vehicle ATF." },
];
