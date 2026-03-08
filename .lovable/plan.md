

## Invoice Creation Page

### Overview
A new dedicated page at `/workshop/invoices/new` for creating invoices, using a two-column layout (workspace left, sticky summary sidebar right) that collapses to single-column on mobile. The "New Invoice" button on the existing Invoices list page will navigate here.

### Files to Create

**`src/pages/workshop/CreateInvoice.tsx`** — The main page component containing all invoice creation logic:

- **Invoice Header Card** — Invoice number (text input), service date (date picker, max today), service type (select from enum list), technician (text input)
- **Customer Card** — Name, phone, email fields
- **Vehicle Card** — Plate number, VIN, make, model, vehicle type (badge-style select from SEDAN/SUV/etc.), odometer (number, required > 0)
- **Parts Line Items Card** — Table with columns: Part Name (searchable dropdown from inventory mock data), SKU (auto-filled), Stock Level (read-only badge), Quantity, Unit Price (pre-filled from sellPrice, editable), Line Total (auto-calc), Remove button. "+ Add Part" button below.
- **Labour Section Card** — Table: Description, Hours, Hourly Rate, Total, Remove. "+ Add Labour" button.
- **Notes Card** — Description, Parts Summary, Remarks textareas
- **Summary Sidebar** (sticky right column) — Parts subtotal, labour subtotal, discount input, grand total (prominent). On mobile, this becomes a sticky bottom bar or inline card.
- **Top Action Bar** — Back to invoices link, Save Draft / Issue Invoice / Send to Customer / Print buttons. Secondary: Duplicate, Void.

All state managed locally with `useState`. Auto-recalculation via derived values. Parts dropdown references the same mock inventory data structure from Inventory page (imported as a shared constant or duplicated).

### Files to Modify

**`src/App.tsx`** — Add route `<Route path="invoices/new" element={<CreateInvoice />} />` inside the workshop layout.

**`src/pages/workshop/Invoices.tsx`** — Change "New Invoice" button to use `useNavigate` to go to `/workshop/invoices/new`.

### Design Approach
- Follows existing project patterns: shadcn Card, Input, Select, Button, Table, Badge, Popover
- Date picker using shadcn Calendar in a Popover (with `pointer-events-auto`)
- Two-column grid: `lg:grid-cols-[1fr_340px]`, single column on mobile with summary card at bottom
- Summary sidebar uses `sticky top-6` positioning
- Clean typography, soft shadows (`shadow-soft`), rounded cards, consistent with existing pages
- Responsive: stacks vertically on mobile, action buttons wrap

### Technical Details
- Parts inventory data: reuse the Part interface and mock data (extract to shared file or inline)
- Line totals: `quantity * unitPrice`, computed inline
- Grand total: `partsTotal + labourTotal - discount`
- Service types and vehicle types as const arrays for the select dropdowns
- No backend — all mock/local state

