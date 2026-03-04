

## Filter Popover Revamp

### Problem
The filter popover renders all categories and suppliers as flat checkbox lists. As these lists grow, the popover becomes unmanageably tall.

### Solution
Use collapsible accordion sections with inline search for long lists, capped with scroll containers.

```text
┌─────────────────────────┐
│ Filters        Clear all│
├─────────────────────────┤
│ ▸ Category          (3) │  ← collapsed, shows active count
│ ▾ Supplier          (1) │  ← expanded on click
│   🔍 Search...          │  ← only if >5 items
│   ☑ Supplier A          │
│   ☐ Supplier B          │
│   (max-h-40 scrollable) │
├─────────────────────────┤
│ ☐ Low stock only        │  ← Others stays flat
└─────────────────────────┘
```

### Technical Changes (single file: `src/pages/workshop/Inventory.tsx`)

1. **Import** `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from existing UI components
2. **Replace** the flat Category and Supplier sections (lines 651-689) with an `Accordion type="multiple"` containing two `AccordionItem` blocks
3. **Each AccordionTrigger** shows the label plus a count badge when filters are active (e.g., "Category (3)")
4. **Inside each AccordionContent**: render a small `Input` search field (only when list has >5 items) that filters checkboxes locally using two new state variables (`categorySearch`, `supplierSearch`)
5. **Checkbox lists** wrapped in `max-h-40 overflow-y-auto` containers
6. **Reset** search terms when popover closes (via `onOpenChange`)
7. **Others section** (low stock toggle) remains outside the accordion, unchanged

No new dependencies or components needed -- all building blocks already exist in the project.

