

## Plan: Disable Stock Editing in Edit Part Dialog

**Goal**: Prevent direct stock edits in the Edit Part dialog. Show the field as read-only with a tooltip explaining users should use the movement record instead.

### Changes

**File: `src/components/workshop/EditPartDialog.tsx`**

1. Disable the "Current Stock" input field (`disabled` prop).
2. Add a small `Info` icon (from lucide-react) next to the "Current Stock" label.
3. Wrap the icon in a `Tooltip` that displays: *"Stock is managed via movement records. Use the part detail view to record stock changes."*
4. Import `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` from UI components and `Info` from lucide-react.

The min stock field remains editable since it's a configuration value, not an inventory count.

