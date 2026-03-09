import { mockParts } from "./inventoryParts";
import { mockSuppliers } from "./suppliersData";

export type POStatus = "DRAFT" | "ORDERED" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CANCELLED";

export interface PurchaseOrderLine {
  id: string;
  inventoryItemId: string;
  name: string;
  sku: string;
  uom: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  lineTotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string | null;
  supplierName: string | null;
  status: POStatus;
  orderDate: string | null;
  expectedDeliveryDate: string | null;
  receivedDate: string | null;
  totalAmount: number;
  notes: string;
  lines: PurchaseOrderLine[];
  createdAt: string;
}

function makeLine(partId: string, qty: number, received: number, costOverride?: number): PurchaseOrderLine {
  const part = mockParts.find(p => p.id === partId)!;
  const cost = costOverride ?? part.costPrice;
  return {
    id: `pol-${partId}-${Math.random().toString(36).slice(2, 6)}`,
    inventoryItemId: part.id,
    name: part.name,
    sku: part.sku,
    uom: part.uom,
    quantityOrdered: qty,
    quantityReceived: received,
    unitCost: cost,
    lineTotal: qty * cost,
  };
}

function total(lines: PurchaseOrderLine[]): number {
  return lines.reduce((s, l) => s + l.lineTotal, 0);
}

const s1 = mockSuppliers[0]; // AutoParts Asia
const s2 = mockSuppliers[1]; // SG Lubricants
const s3 = mockSuppliers[3]; // Bosch
const s4 = mockSuppliers[2]; // Continental

// DRAFT with supplier
const po1Lines = [makeLine("1", 20, 0), makeLine("6", 8, 0)];
// DRAFT ad-hoc
const po2Lines = [makeLine("3", 30, 0), makeLine("5", 20, 0)];
// ORDERED normal
const po3Lines = [makeLine("2", 15, 0), makeLine("7", 10, 0), makeLine("10", 12, 0)];
// ORDERED overdue
const po4Lines = [makeLine("4", 40, 0), makeLine("9", 6, 0)];
// PARTIALLY_RECEIVED
const po5Lines = [makeLine("1", 10, 10), makeLine("3", 20, 8), makeLine("8", 15, 0)];
// RECEIVED 1
const po6Lines = [makeLine("2", 20, 20), makeLine("5", 15, 15)];
// RECEIVED 2
const po7Lines = [makeLine("6", 10, 10), makeLine("4", 30, 30), makeLine("9", 4, 4)];
// CANCELLED
const po8Lines = [makeLine("7", 25, 0), makeLine("10", 10, 0)];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    poNumber: "PO-20240115-001",
    supplierId: s1.id,
    supplierName: s1.name,
    status: "DRAFT",
    orderDate: null,
    expectedDeliveryDate: null,
    receivedDate: null,
    totalAmount: total(po1Lines),
    notes: "Restock brakes for Q1 demand.",
    lines: po1Lines,
    createdAt: "2024-01-15",
  },
  {
    id: "po-2",
    poNumber: "PO-20240116-001",
    supplierId: null,
    supplierName: null,
    status: "DRAFT",
    orderDate: null,
    expectedDeliveryDate: null,
    receivedDate: null,
    totalAmount: total(po2Lines),
    notes: "",
    lines: po2Lines,
    createdAt: "2024-01-16",
  },
  {
    id: "po-3",
    poNumber: "PO-20240110-001",
    supplierId: s2.id,
    supplierName: s2.name,
    status: "ORDERED",
    orderDate: "2024-01-10",
    expectedDeliveryDate: "2024-01-25",
    receivedDate: null,
    totalAmount: total(po3Lines),
    notes: "Weekly delivery — confirm Tuesday slot.",
    lines: po3Lines,
    createdAt: "2024-01-10",
  },
  {
    id: "po-4",
    poNumber: "PO-20240105-001",
    supplierId: s3.id,
    supplierName: s3.name,
    status: "ORDERED",
    orderDate: "2024-01-05",
    expectedDeliveryDate: "2024-01-12",
    receivedDate: null,
    totalAmount: total(po4Lines),
    notes: "Urgent order — overdue delivery.",
    lines: po4Lines,
    createdAt: "2024-01-05",
  },
  {
    id: "po-5",
    poNumber: "PO-20240108-001",
    supplierId: s1.id,
    supplierName: s1.name,
    status: "PARTIALLY_RECEIVED",
    orderDate: "2024-01-08",
    expectedDeliveryDate: "2024-01-20",
    receivedDate: null,
    totalAmount: total(po5Lines),
    notes: "Partial shipment received 2024-01-14. Remaining on backorder.",
    lines: po5Lines,
    createdAt: "2024-01-08",
  },
  {
    id: "po-6",
    poNumber: "PO-20240102-001",
    supplierId: s2.id,
    supplierName: s2.name,
    status: "RECEIVED",
    orderDate: "2024-01-02",
    expectedDeliveryDate: "2024-01-09",
    receivedDate: "2024-01-09",
    totalAmount: total(po6Lines),
    notes: "All items received and inspected.",
    lines: po6Lines,
    createdAt: "2024-01-02",
  },
  {
    id: "po-7",
    poNumber: "PO-20231220-001",
    supplierId: s4.id,
    supplierName: s4.name,
    status: "RECEIVED",
    orderDate: "2023-12-20",
    expectedDeliveryDate: "2024-01-03",
    receivedDate: "2024-01-02",
    totalAmount: total(po7Lines),
    notes: "Delivered one day early.",
    lines: po7Lines,
    createdAt: "2023-12-20",
  },
  {
    id: "po-8",
    poNumber: "PO-20240112-001",
    supplierId: s3.id,
    supplierName: s3.name,
    status: "CANCELLED",
    orderDate: "2024-01-12",
    expectedDeliveryDate: "2024-01-19",
    receivedDate: null,
    totalAmount: total(po8Lines),
    notes: "Cancelled — duplicate order.",
    lines: po8Lines,
    createdAt: "2024-01-12",
  },
];
