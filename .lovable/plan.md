

## Changes to PartDetailDialog

Two quick tweaks in `src/components/workshop/PartDetailDialog.tsx`:

1. **Wider dialog**: Change `max-w-3xl` to `max-w-4xl` on the `DialogContent`
2. **More spacing**: Increase the gap between the movement form and the movement table from `mb-3` to `mb-6` on the form container
3. **Expandable notes row**: Implement the previously approved expandable row approach — add `expandedMovement` state, make rows clickable, show notes in a colspan row beneath, with a `MessageSquare` icon hint for rows that have notes

