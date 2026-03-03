

## Part Detail Dialog with Movement Ledger

### Overview
When a user clicks a row in the Parts table, a wide dialog opens showing the part's details (read-only, with edit pencil) and a stock movement history below. A button allows recording manual stock movements.

### Data Model

```text
StockMovement {
  id: string
  partId: string
  date: string (ISO)
  type: "in" | "out" | "adjustment"
  quantity: number          // signed: +10, -2, etc.
  referenceType: string     // "purchase_order" | "manual" | "service_job" | "return" | etc.
  referenceId: string       // e.g. "PO-0012", "SJ-0045", or empty for manual
  costPriceAtTime: number   // cost price snapshot when movement occurred
  notes: string             // optional free-text
  balanceAfter: number      // running balance after this movement
}
```

**Reference types** (initial set, extensible later):
- `purchase_order` — stock in from a PO
- `service_job` — stock out when used on a vehicle/job
- `manual` — manual adjustment (e.g. stocktake correction, damage write-off)
- `return` — stock returned

### New Components

**1. `PartDetailDialog`** (`src/components/workshop/PartDetailDialog.tsx`)
- Wide dialog (`max-w-2xl`)
- **Top section**: Read-only part info grid (name, SKU, category, stock, min stock, cost, sell, supplier) with a pencil icon button that opens the existing `EditPartDialog`
- **Middle section**: "Record Movement" button that expands an inline form:
  - Movement type select (`in` / `out` / `adjustment`)
  - Quantity input (number, signed display)
  - Reference type select (`purchase_order`, `service_job`, `manual`, `return`)
  - Reference ID input (optional, disabled when type is `manual`)
  - Cost price at time input
  - Notes textarea (optional)
  - Save / Cancel buttons
- **Bottom section**: Movement ledger table (scrollable, most recent first)
  - Columns: Date, Type (color-coded badge), Qty (green +, red -), Ref Type, Ref ID, Cost Price, Balance, Notes
  - Mock data seeded for demo

**2. Updates to `Inventory.tsx`**
- Add `stockMovements` state (array of `StockMovement[]`, seeded with mock data)
- Row click opens `PartDetailDialog` (not the edit dialog)
- Keep the existing ⋯ dropdown menu for quick Edit/Delete
- When a movement is recorded, update the part's `stock` accordingly and append to movements array

### Files to Create/Edit
- **Create**: `src/components/workshop/PartDetailDialog.tsx`
- **Edit**: `src/pages/workshop/Inventory.tsx` — add movements state, row click handler, integrate `PartDetailDialog`

