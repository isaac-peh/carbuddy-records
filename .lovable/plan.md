

## Plan: Add Services Page & Refine Inventory

### What changes

1. **Rename "Inventory" sidebar item to "Parts"** — since we're splitting the concept, "Parts" is more specific. Add a new "Services" item with a `Wrench` or `HandCoins` icon right below it.

2. **Rename the current Inventory page to Parts** (`/workshop/parts`) — the existing page already tracks spare parts well. Minor rename of heading from "Inventory" to "Parts". Keep the route and file as-is or rename for clarity.

3. **Create a new Services page** (`/workshop/services`) with:
   - Header: "Services" with an "Add Service" button
   - Summary cards: Total services count, average price
   - A simple table with columns: **Service Name**, **Description** (short), **Price** (flat rate for now)
   - No stock tracking, no supplier, no SKU — these don't apply to labor
   - Search bar to filter services
   - Mock data: Oil Change Labor, Tyre Change, Brake Pad Replacement (Labor), Diagnostic Scan, A/C Regas, etc.
   - Each row has a "more" menu (edit/delete) like the parts table

4. **Update sidebar** — reorder main items: Dashboard → Parts → Services → Invoices → Jobs

5. **Update routing** in `App.tsx` — add `/workshop/services` route, optionally rename `/workshop/inventory` to `/workshop/parts` (with redirect from old URL)

### Files to create/modify
- **Create**: `src/pages/workshop/Services.tsx`
- **Modify**: `src/components/b2b/B2BSidebar.tsx` (add Services nav item, rename Inventory → Parts)
- **Modify**: `src/App.tsx` (add Services route, rename inventory route)
- **Modify**: `src/pages/workshop/Inventory.tsx` (rename heading from "Inventory" to "Parts")

