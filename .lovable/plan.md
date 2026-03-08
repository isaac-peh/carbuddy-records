

## Plan: Add Description Field, Resize Dialogs, and Add Toast Notifications

### 1. Add Description Field to Add/Edit Part Dialogs

- **AddPartDialog.tsx**: Add a `description` state and a `Textarea` input field (between Name/SKU and Category). Update the `onAdd` callback interface to include `description: string`. Pass it through on submit and reset on close.
- **EditPartDialog.tsx**: Same treatment — add `description` state, populate from `part` on open, add `Textarea` field, include in `onSave` payload.
- **Inventory.tsx**: The `Part` interface already has `description: string`. Just ensure the handlers pass it through correctly and mock data has descriptions.

### 2. Increase Dialog Sizes for Large Screens

Update `max-w` class on `DialogContent` across all workshop dialogs from `sm:max-w-md` to a larger breakpoint like `sm:max-w-lg` or `sm:max-w-xl`:

| Dialog | Current | New |
|--------|---------|-----|
| AddPartDialog | `sm:max-w-md` | `sm:max-w-xl` |
| EditPartDialog | `sm:max-w-md` | `sm:max-w-xl` |
| AddServiceDialog | `sm:max-w-md` | `sm:max-w-lg` |
| EditServiceDialog | `sm:max-w-md` | `sm:max-w-lg` |
| PartDetailDialog | (check current) | `sm:max-w-2xl` |
| ManageCategoriesDialog | (check current) | `sm:max-w-lg` |

Also increase the base `DialogContent` default `max-w-lg` to `max-w-xl` in `dialog.tsx` so AlertDialogs (delete confirmations) also scale up slightly.

### 3. Add Toast Notifications for All Actions

Import `toast` from `sonner` (already wired in `App.tsx` via `<Sonner />`) and add success toasts to:

**Inventory.tsx:**
- `handleAddPart` → `toast.success("Part added successfully")`
- `handleEditPart` → `toast.success("Part updated successfully")`
- `handleDeletePart` → `toast.success("Part deleted successfully")`
- `handleRecordMovement` → `toast.success("Stock movement recorded")`
- Category rename/delete/add actions → appropriate toasts

**Services.tsx:**
- `handleAddService` → `toast.success("Service added successfully")`
- `handleEditService` → `toast.success("Service updated successfully")`
- `handleDeleteService` → `toast.success("Service deleted successfully")`

### Files to Edit
1. `src/components/workshop/AddPartDialog.tsx` — add description field + resize
2. `src/components/workshop/EditPartDialog.tsx` — add description field + resize
3. `src/components/workshop/AddServiceDialog.tsx` — resize
4. `src/components/workshop/EditServiceDialog.tsx` — resize
5. `src/pages/workshop/Inventory.tsx` — add toasts to all handlers
6. `src/pages/workshop/Services.tsx` — add toasts to all handlers
7. `src/components/workshop/PartDetailDialog.tsx` — resize
8. `src/components/workshop/ManageCategoriesDialog.tsx` — resize

