

## Plan: Move Vehicle Lookup to Top of Invoice Form

Currently the `VehicleLookup` component is nested inside a 2-column grid alongside the Customer card (lines 343-385). The user wants it to sit at the **top** of the invoice creation form as the first section, before Invoice Details.

### Changes to `src/pages/workshop/CreateInvoice.tsx`

1. **Move `VehicleLookup` out of the 2-column Customer/Vehicle grid** and place it as the first card in the left column (before "Invoice Details"), making it a full-width standalone section.

2. **Move the Odometer card** to remain near the vehicle section — either inline below the VehicleLookup or merged into the Invoice Details card.

3. **Simplify the Customer/Vehicle grid** to just the Customer card (full width or kept in its current card layout).

The component itself (`VehicleLookup.tsx`) requires no changes — it already handles all the stateful lookup logic and transitions. This is purely a layout reorder in `CreateInvoice.tsx`.

