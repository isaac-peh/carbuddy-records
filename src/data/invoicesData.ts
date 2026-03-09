export interface Invoice {
  id: string;
  number: string;
  customer: string;
  phone: string;
  email: string;
  vehicle: string;
  plateNumber: string;
  vin: string;
  vehicleType: string;
  services: string;
  serviceTypes: string[];
  technician: string;
  odometer: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Draft" | "Voided";
  date: string;
  dueDate: string;
  parts: {
    name: string;
    sku: string;
    quantity: number;
    unitPrice: number;
  }[];
  labour: {
    description: string;
    pricingMode: "hourly" | "flat";
    hours: number;
    rate: number;
  }[];
  partsTotal: number;
  labourTotal: number;
  subtotal: number;
  discount: number;
  discountMode: "value" | "percent";
  grandTotal: number;
  description: string;
  remarks: string;
  mileageStatus: "VALID" | "LOWER_THAN_PREVIOUS_RECORD" | "HIGHER_THAN_NEXT_RECORD";
}

export const mockInvoices: Invoice[] = [
  {
    id: "1", number: "INV-2024-042", customer: "Ahmad Tan", phone: "+60 12-345 6789", email: "ahmad@email.com",
    vehicle: "Toyota Corolla 2019", plateNumber: "WKL 4521", vin: "JTDKN3DU5A0123456", vehicleType: "Sedan",
    services: "Oil Change, Filter Replacement", serviceTypes: ["GENERAL SERVICE"],
    technician: "James Wong", odometer: "85200",
    amount: 185, status: "Paid", date: "2024-01-15", dueDate: "2024-01-30",
    parts: [
      { name: "Engine Oil 5W-30", sku: "OIL-5W30", quantity: 4, unitPrice: 25 },
      { name: "Oil Filter", sku: "FLT-OIL-01", quantity: 1, unitPrice: 15 },
      { name: "Air Filter", sku: "FLT-AIR-01", quantity: 1, unitPrice: 20 },
    ],
    labour: [
      { description: "Oil Change Service", pricingMode: "flat", hours: 1, rate: 25 },
    ],
    partsTotal: 135, labourTotal: 25, subtotal: 160, discount: 0, discountMode: "value", grandTotal: 185,
    description: "Routine oil change and filter replacement.", remarks: "Customer requested synthetic oil.",
    mileageStatus: "VALID",
  },
  {
    id: "2", number: "INV-2024-041", customer: "Sarah Lim", phone: "+60 11-234 5678", email: "sarah.lim@email.com",
    vehicle: "Honda Civic 2021", plateNumber: "JKR 8812", vin: "2HGFC2F53MH501234", vehicleType: "Sedan",
    services: "Brake Pad Replacement", serviceTypes: ["REPAIR", "BRAKE SERVICE"],
    technician: "Ali Rahman", odometer: "42100",
    amount: 320, status: "Pending", date: "2024-01-14", dueDate: "2024-01-29",
    parts: [
      { name: "Front Brake Pads (Set)", sku: "BRK-FP-01", quantity: 1, unitPrice: 180 },
      { name: "Brake Fluid DOT4", sku: "BRK-FL-04", quantity: 1, unitPrice: 30 },
    ],
    labour: [
      { description: "Brake Pad Replacement (Front)", pricingMode: "hourly", hours: 2, rate: 55 },
    ],
    partsTotal: 210, labourTotal: 110, subtotal: 320, discount: 0, discountMode: "value", grandTotal: 320,
    description: "Front brake pads worn — replaced with OEM pads.", remarks: "",
    mileageStatus: "VALID",
  },
  {
    id: "3", number: "INV-2024-040", customer: "David Ng", phone: "+60 17-876 5432", email: "david.ng@email.com",
    vehicle: "BMW 320i 2020", plateNumber: "VDN 3301", vin: "WBA5R1C50LA123456", vehicleType: "Sedan",
    services: "Full Service", serviceTypes: ["GENERAL SERVICE", "INSPECTION"],
    technician: "James Wong", odometer: "61500",
    amount: 580, status: "Overdue", date: "2024-01-10", dueDate: "2024-01-25",
    parts: [
      { name: "Engine Oil 5W-30", sku: "OIL-5W30", quantity: 5, unitPrice: 35 },
      { name: "Oil Filter", sku: "FLT-OIL-02", quantity: 1, unitPrice: 28 },
      { name: "Spark Plugs (Set of 4)", sku: "SPK-04", quantity: 1, unitPrice: 92 },
      { name: "Cabin Air Filter", sku: "FLT-CAB-01", quantity: 1, unitPrice: 35 },
    ],
    labour: [
      { description: "Full Service Package", pricingMode: "flat", hours: 1, rate: 150 },
      { description: "Multi-point Inspection", pricingMode: "flat", hours: 1, rate: 100 },
    ],
    partsTotal: 330, labourTotal: 250, subtotal: 580, discount: 0, discountMode: "value", grandTotal: 580,
    description: "60,000km full service with multi-point inspection.", remarks: "Recommend timing belt replacement at next service.",
    mileageStatus: "LOWER_THAN_PREVIOUS_RECORD",
  },
  {
    id: "4", number: "INV-2024-039", customer: "Wei Ming", phone: "+60 16-543 2100", email: "",
    vehicle: "Mazda 3 2022", plateNumber: "BPP 7744", vin: "3MZBPACL5NM123456", vehicleType: "Hatchback",
    services: "Suspension Check, Alignment", serviceTypes: ["INSPECTION", "REPAIR"],
    technician: "Ali Rahman", odometer: "28700",
    amount: 250, status: "Paid", date: "2024-01-08", dueDate: "2024-01-23",
    parts: [
      { name: "Alignment Kit", sku: "ALN-KIT-01", quantity: 1, unitPrice: 50 },
    ],
    labour: [
      { description: "Suspension Inspection", pricingMode: "flat", hours: 1, rate: 80 },
      { description: "Wheel Alignment (4-wheel)", pricingMode: "flat", hours: 1, rate: 120 },
    ],
    partsTotal: 50, labourTotal: 200, subtotal: 250, discount: 0, discountMode: "value", grandTotal: 250,
    description: "Customer reported knocking noise. Suspension checked and alignment corrected.", remarks: "",
    mileageStatus: "VALID",
  },
  {
    id: "5", number: "INV-2024-038", customer: "Rachel Ong", phone: "+60 19-111 2233", email: "rachel@email.com",
    vehicle: "Mercedes C200 2021", plateNumber: "WA 9988 C", vin: "W1KZF8DB3MA123456", vehicleType: "Sedan",
    services: "Battery Replacement", serviceTypes: ["REPAIR", "BATTERY CHANGE"],
    technician: "James Wong", odometer: "35600",
    amount: 280, status: "Draft", date: "2024-01-07", dueDate: "-",
    parts: [
      { name: "AGM Battery 80Ah", sku: "BAT-AGM-80", quantity: 1, unitPrice: 240 },
    ],
    labour: [
      { description: "Battery Replacement & Coding", pricingMode: "flat", hours: 1, rate: 40 },
    ],
    partsTotal: 240, labourTotal: 40, subtotal: 280, discount: 0, discountMode: "value", grandTotal: 280,
    description: "Battery dead on arrival. Replaced with new AGM battery.", remarks: "Old battery recycled.",
    mileageStatus: "VALID",
  },
  {
    id: "6", number: "INV-2024-037", customer: "Jason Lee", phone: "+60 12-888 9999", email: "jason.lee@email.com",
    vehicle: "Subaru WRX 2020", plateNumber: "JHN 5566", vin: "JF1VA1E68L9812345", vehicleType: "Sedan",
    services: "Spark Plug, Coil Replacement", serviceTypes: ["REPAIR", "ENGINE WORK"],
    technician: "Ali Rahman", odometer: "55300",
    amount: 420, status: "Paid", date: "2024-01-05", dueDate: "2024-01-20",
    parts: [
      { name: "Iridium Spark Plugs (Set of 4)", sku: "SPK-IR-04", quantity: 1, unitPrice: 120 },
      { name: "Ignition Coil Pack", sku: "IGN-CP-01", quantity: 2, unitPrice: 85 },
    ],
    labour: [
      { description: "Spark Plug & Coil Replacement", pricingMode: "hourly", hours: 2.5, rate: 52 },
    ],
    partsTotal: 290, labourTotal: 130, subtotal: 420, discount: 0, discountMode: "value", grandTotal: 420,
    description: "Engine misfiring on cylinders 2 & 3. Replaced spark plugs and coil packs.", remarks: "",
    mileageStatus: "VALID",
  },
  {
    id: "7", number: "INV-2024-036", customer: "Michelle Tan", phone: "+60 13-456 7890", email: "michelle.t@email.com",
    vehicle: "Audi A4 2019", plateNumber: "KLN 2233", vin: "WAUENAF40KA012345", vehicleType: "Sedan",
    services: "Transmission Fluid Change", serviceTypes: ["GENERAL SERVICE", "TRANSMISSION"],
    technician: "James Wong", odometer: "72800",
    amount: 195, status: "Pending", date: "2024-01-03", dueDate: "2024-01-18",
    parts: [
      { name: "ATF Fluid (4L)", sku: "ATF-04L", quantity: 2, unitPrice: 55 },
      { name: "Transmission Filter", sku: "FLT-TRN-01", quantity: 1, unitPrice: 35 },
    ],
    labour: [
      { description: "Transmission Fluid Flush", pricingMode: "flat", hours: 1, rate: 50 },
    ],
    partsTotal: 145, labourTotal: 50, subtotal: 195, discount: 0, discountMode: "value", grandTotal: 195,
    description: "Scheduled transmission fluid change.", remarks: "Fluid was dark — recommend shorter interval next time.",
    mileageStatus: "VALID",
  },
];
