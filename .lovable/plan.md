

## Revamp Part Detail Dialog

Complete redesign of `PartDetailDialog.tsx` to match the reference screenshots, introducing a tabbed layout with structured card-based content.

### Layout Structure

**Header (sticky top area, no overlap with close button):**
- Left: Package icon + part name + category Badge pill + SKU below in mono
- Right: Stats pill strip showing STOCK / COST / SELL / VALUE separated by thin dividers, with values below labels
- Close button positioned clearly outside/above the stats strip

**Tabs bar** directly below header (Overview | Movements | Purchase Orders | Sales), with a subtle bottom border separator.

**Tab content** scrolls independently below the tabs.

---

### Tab: Overview (two-column grid)

**Left column (wider, ~60%):**
1. **Item Details card** -- Category, Unit of Measure, Supplier in first row; Item Type ("Good"), Min Stock Level, Created date in second row
2. **Description card** -- part.description text
3. **Recent Activity card** -- last 3-5 movements shown as a timeline list (icon + type label + date/time + notes + signed qty on right)

**Right column (~40%):**
1. **Stock Status card** -- large stock number in center (colored red if below min), UOM label, low-stock warning banner if applicable, reorder point row
2. **Pricing card** -- Cost Price, Sell Price, Margin (green, with % calc), Stock Value rows

### Tab: Movements

The existing movement table and "Record Movement" form, moved into this tab.

### Tab: Purchase Orders

"Coming soon" placeholder with a shopping cart icon, title, and subtitle.

### Tab: Sales

"Coming soon" placeholder with a receipt/trending icon, title, and subtitle.

---

### Technical Details

**File:** `src/components/workshop/PartDetailDialog.tsx` -- full rewrite

- Add `useState` for active tab (default "overview")
- Use `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` from `@/components/ui/tabs`
- Use `Card` from `@/components/ui/card` for content sections
- Dialog size: `max-w-5xl` to fill 27" monitors properly
- Header and tabs are outside the scrollable area; only tab content scrolls
- Movement recording form and table move into the "Movements" tab
- Add `ShoppingCart`, `TrendingUp`/`Receipt` icons for coming-soon placeholders
- Consistent sizing across all tabs since the dialog shell is fixed

**No changes needed to `Inventory.tsx`** -- the props interface stays the same.

